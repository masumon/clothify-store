import { NextResponse } from "next/server";
import { z } from "zod";
import { getSupabaseAdminClient } from "@/lib/supabase-admin";
import { sendWhatsAppNotification } from "@/lib/whatsapp-notify";

const BD_PHONE_RE = /^(?:\+?880|0)?1[3-9]\d{8}$/;
const TRX_RE = /^[A-Z0-9]{6,20}$/i;
const RATE_WINDOW_MS = 60 * 1000;
const RATE_LIMIT = 8;
const MIN_FORM_FILL_MS = 2500;
const MAX_FORM_FILL_MS = 24 * 60 * 60 * 1000;
const allowedCouriers = [
  "Pathao",
  "Sundarban",
  "SA Paribahan",
  "RedX",
  "Steadfast",
  "Self Managed",
] as const;
const ORDER_ITEMS_TABLE = "order_items";

type RateBucket = {
  count: number;
  resetAt: number;
};

const globalRateStore = globalThis as unknown as {
  __clothifyOrderRateStore?: Map<string, RateBucket>;
};

if (!globalRateStore.__clothifyOrderRateStore) {
  globalRateStore.__clothifyOrderRateStore = new Map<string, RateBucket>();
}

function getClientIp(req: Request) {
  const forwarded = req.headers.get("x-forwarded-for") || "";
  const first = forwarded.split(",")[0]?.trim();
  return first || req.headers.get("x-real-ip") || "unknown";
}

function isRateLimited(req: Request) {
  const key = getClientIp(req);
  const store = globalRateStore.__clothifyOrderRateStore!;
  const now = Date.now();
  const bucket = store.get(key);

  if (!bucket || now > bucket.resetAt) {
    store.set(key, { count: 1, resetAt: now + RATE_WINDOW_MS });
    return false;
  }

  if (bucket.count >= RATE_LIMIT) {
    return true;
  }

  bucket.count += 1;
  store.set(key, bucket);
  return false;
}

const OrderItemSchema = z.object({
  product_id: z.string().trim().min(1, "Invalid product id").max(120),
  quantity: z.number().int().min(1, "Quantity must be at least 1").max(20),
  selected_size: z.string().trim().max(50).optional().default("Standard"),
});

const OrderSchema = z.object({
  customer_name: z.string().min(2, "Name must be at least 2 characters").max(100),
  phone: z
    .string()
    .regex(BD_PHONE_RE, "Invalid Bangladesh phone number (e.g. 01XXXXXXXXX)"),
  address: z.string().min(5, "Address must be at least 5 characters").max(300),
  delivery_method: z
    .enum(["Home Delivery", "Pickup", "Store Pickup"] as const)
    .transform((v) => (v === "Store Pickup" ? "Pickup" : v)),
  courier_name: z.enum(allowedCouriers).optional().default("Pathao"),
  payment_method: z.enum(["bKash", "Nagad", "Cash on Delivery"] as const).default("bKash"),
  total_amount: z
    .number()
    .positive("Total amount must be positive")
    .max(500000, "Amount too large"),
  bkash_trx_id: z.string().optional().default(""),
  items: z.array(OrderItemSchema).min(1, "At least one order item is required").max(30),
  website: z.string().optional().default(""),
  client_started_at: z.number().int().optional(),
});

type ProductSnapshot = {
  id: string;
  name: string;
  price: number;
  stock_quantity?: number | null;
  is_published?: boolean | null;
};

function roundMoney(value: number) {
  return Math.round(value * 100) / 100;
}

function formatCurrency(value: number) {
  return `৳${Number(value || 0).toLocaleString("en-BD")}`;
}

function compactAddress(text: string) {
  return text.replace(/\s+/g, " ").trim().slice(0, 120);
}

function padSerial(value: number, width = 4) {
  return String(Math.max(1, Math.floor(value))).padStart(width, "0");
}

function getDhakaDateParts(date: Date) {
  const formatter = new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Dhaka",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });
  const parts = formatter.formatToParts(date);
  const year = Number(parts.find((part) => part.type === "year")?.value || "1970");
  const month = Number(parts.find((part) => part.type === "month")?.value || "1");
  const day = Number(parts.find((part) => part.type === "day")?.value || "1");
  return { year, month, day };
}

function getDhakaDayWindow(createdAtIso: string) {
  const createdAt = new Date(createdAtIso);
  const { year, month, day } = getDhakaDateParts(createdAt);
  const offsetMs = 6 * 60 * 60 * 1000;
  const dayStartUtc = new Date(Date.UTC(year, month - 1, day, 0, 0, 0, 0) - offsetMs);
  const dayEndUtc = new Date(dayStartUtc.getTime() + 24 * 60 * 60 * 1000);

  const dateKey = `${year}${String(month).padStart(2, "0")}${String(day).padStart(2, "0")}`;
  return {
    dayStartIso: dayStartUtc.toISOString(),
    dayEndIso: dayEndUtc.toISOString(),
    dateKey,
  };
}

async function generateInvoiceNumber(
  supabase: ReturnType<typeof getSupabaseAdminClient>,
  createdAtIso: string
) {
  const { dayStartIso, dayEndIso, dateKey } = getDhakaDayWindow(createdAtIso);

  const { count } = await supabase
    .from("orders")
    .select("id", { count: "exact", head: true })
    .gte("created_at", dayStartIso)
    .lt("created_at", dayEndIso);

  const serial = padSerial(Number(count || 1), 4);
  return `INV-${dateKey}-${serial}`;
}

export async function POST(req: Request) {
  try {
    if (isRateLimited(req)) {
      return NextResponse.json(
        { error: "Too many requests. Please try again shortly." },
        { status: 429 }
      );
    }

    const body: unknown = await req.json();
    const parsed = OrderSchema.safeParse(body);

    if (!parsed.success) {
      const firstError = parsed.error.issues[0]?.message ?? "Invalid input";
      return NextResponse.json({ error: firstError }, { status: 400 });
    }

    const {
      customer_name,
      phone,
      address,
      delivery_method,
      courier_name,
      payment_method,
      total_amount,
      bkash_trx_id,
      items,
      website,
      client_started_at,
    } = parsed.data;

    const normalizedTrx = bkash_trx_id.trim();
    const finalTrxId =
      payment_method === "Cash on Delivery"
        ? `COD-${Date.now().toString(36).toUpperCase()}`
        : normalizedTrx;

    if ((payment_method === "bKash" || payment_method === "Nagad") && !TRX_RE.test(normalizedTrx)) {
      return NextResponse.json(
        { error: "Transaction ID must be 6-20 alphanumeric characters" },
        { status: 400 }
      );
    }

    if (website.trim().length > 0) {
      return NextResponse.json({ error: "Invalid request." }, { status: 400 });
    }

    if (typeof client_started_at === "number") {
      const elapsed = Date.now() - client_started_at;
      if (elapsed < MIN_FORM_FILL_MS || elapsed > MAX_FORM_FILL_MS) {
        return NextResponse.json({ error: "Invalid form timing." }, { status: 400 });
      }
    }

    let supabase;
    try {
      supabase = getSupabaseAdminClient();
    } catch {
      return NextResponse.json(
        { error: "Order service is temporarily unavailable. Please try again later." },
        { status: 503 }
      );
    }

    if (payment_method === "bKash" || payment_method === "Nagad") {
      const { data: existingTrx } = await supabase
        .from("orders")
        .select("id")
        .eq("bkash_trx_id", finalTrxId)
        .limit(1);

      if (existingTrx && existingTrx.length > 0) {
        return NextResponse.json(
          { error: "This Transaction ID was already used." },
          { status: 409 }
        );
      }
    }

    const productIds = Array.from(new Set(items.map((item) => item.product_id)));
    const { data: productRows, error: productError } = await supabase
      .from("products")
      .select("id,name,price,stock_quantity,is_published")
      .in("id", productIds);

    if (productError) {
      return NextResponse.json(
        { error: "Unable to validate order items right now." },
        { status: 503 }
      );
    }

    const products = (productRows || []) as ProductSnapshot[];
    if (products.length !== productIds.length) {
      return NextResponse.json(
        { error: "Some selected products are no longer available." },
        { status: 409 }
      );
    }

    const productMap = new Map(products.map((item) => [item.id, item]));
    const quantityByProduct = new Map<string, number>();
    let serverTotal = 0;

    for (const item of items) {
      const product = productMap.get(item.product_id);
      if (!product) {
        return NextResponse.json(
          { error: "Some selected products are no longer available." },
          { status: 409 }
        );
      }

      if (product.is_published === false) {
        return NextResponse.json(
          { error: `${product.name} is not available for ordering right now.` },
          { status: 409 }
        );
      }

      const stock = Number(product.stock_quantity ?? 20);
      const nextQty = (quantityByProduct.get(item.product_id) || 0) + item.quantity;
      if (!Number.isFinite(stock) || stock < nextQty) {
        return NextResponse.json(
          { error: `${product.name} has insufficient stock.` },
          { status: 409 }
        );
      }

      quantityByProduct.set(item.product_id, nextQty);
      serverTotal = roundMoney(serverTotal + Number(product.price) * item.quantity);
    }

    const normalizedClientTotal = roundMoney(total_amount);
    const normalizedServerTotal = roundMoney(serverTotal);
    if (normalizedClientTotal !== normalizedServerTotal) {
      return NextResponse.json(
        {
          error: "Order amount mismatch. Please refresh cart and try again.",
          expected_total: normalizedServerTotal,
        },
        { status: 409 }
      );
    }

    const deliveryMeta = `${delivery_method} | Courier: ${courier_name} | Payment: ${payment_method}`;

    const { data, error } = await supabase
      .from("orders")
      .insert([
        {
          customer_name,
          phone,
          address,
          delivery_method: deliveryMeta,
          total_amount: normalizedServerTotal,
          bkash_trx_id: finalTrxId,
          status: "Pending",
        },
      ])
      .select("id,created_at")
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    let invoiceNumber = "";
    if (data?.created_at) {
      invoiceNumber = await generateInvoiceNumber(supabase, data.created_at);
    }

    if (data?.id) {
      const orderItemsRows = items.map((item) => {
        const product = productMap.get(item.product_id)!;
        const unitPrice = Number(product.price);
        return {
          order_id: data.id,
          product_id: item.product_id,
          selected_size: item.selected_size || "Standard",
          quantity: item.quantity,
          unit_price: unitPrice,
          line_total: roundMoney(unitPrice * item.quantity),
        };
      });

      const { error: orderItemsError } = await supabase
        .from(ORDER_ITEMS_TABLE)
        .insert(orderItemsRows);

      if (orderItemsError) {
        const message = orderItemsError.message.toLowerCase();
        const isTableMissing =
          message.includes(`relation "${ORDER_ITEMS_TABLE}"`) ||
          message.includes(`relation '${ORDER_ITEMS_TABLE}'`) ||
          message.includes(`table "${ORDER_ITEMS_TABLE}"`) ||
          message.includes(`table '${ORDER_ITEMS_TABLE}'`);
        if (!isTableMissing) {
          console.error("Order items persistence error:", orderItemsError.message);
        }
      }

      for (const [productId, orderedQty] of quantityByProduct.entries()) {
        const snapshot = productMap.get(productId);
        if (!snapshot) continue;
        const currentStock = Number(snapshot.stock_quantity ?? 20);
        const nextStock = Math.max(0, currentStock - orderedQty);
        const { error: stockError } = await supabase
          .from("products")
          .update({ stock_quantity: nextStock })
          .eq("id", productId);

        if (stockError) {
          console.error("Stock update failed:", stockError.message);
        }
      }

      const itemsPreview = items
        .slice(0, 5)
        .map((item) => {
          const product = productMap.get(item.product_id);
          const productName = product?.name || item.product_id;
          return `${productName} x${item.quantity}`;
        })
        .join(", ");

      void sendWhatsAppNotification({
        type: "order_created",
        title: "🛒 New Order Received",
        message: `${invoiceNumber || data.id} | ${customer_name} | ${phone} | ${formatCurrency(normalizedServerTotal)} | ${payment_method} | ${delivery_method} | ${compactAddress(address)} | Items: ${itemsPreview}`,
        metadata: {
          order_id: data.id,
          invoice_number: invoiceNumber || null,
          total_amount: normalizedServerTotal,
          payment_method,
          courier_name,
          delivery_method,
        },
      });
    }

    return NextResponse.json(
      {
        id: data?.id,
        created_at: data?.created_at || new Date().toISOString(),
        invoice_number: invoiceNumber || undefined,
      },
      { status: 201 }
    );
  } catch {
    return NextResponse.json(
      { error: "Unable to place order right now. Please try again." },
      { status: 500 }
    );
  }
}
