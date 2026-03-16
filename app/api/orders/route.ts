import { NextResponse } from "next/server";
import { z } from "zod";
import { getSupabaseAdminClient } from "@/lib/supabase-admin";

const BD_PHONE_RE = /^(?:\+?880|0)?1[3-9]\d{8}$/;
const TRX_RE = /^[A-Z0-9]{6,20}$/i;
const RATE_WINDOW_MS = 60 * 1000;
const RATE_LIMIT = 8;
const MIN_FORM_FILL_MS = 2500;
const MAX_FORM_FILL_MS = 24 * 60 * 60 * 1000;

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

const OrderSchema = z.object({
  customer_name: z.string().min(2, "Name must be at least 2 characters").max(100),
  phone: z
    .string()
    .regex(BD_PHONE_RE, "Invalid Bangladesh phone number (e.g. 01XXXXXXXXX)"),
  address: z.string().min(5, "Address must be at least 5 characters").max(300),
  delivery_method: z
    .enum(["Home Delivery", "Pickup", "Store Pickup"] as const)
    .transform((v) => (v === "Store Pickup" ? "Pickup" : v)),
  total_amount: z
    .number()
    .positive("Total amount must be positive")
    .max(500000, "Amount too large"),
  bkash_trx_id: z
    .string()
    .regex(TRX_RE, "Transaction ID must be 6-20 alphanumeric characters"),
  website: z.string().optional().default(""),
  client_started_at: z.number().int().optional(),
});

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
      total_amount,
      bkash_trx_id,
      website,
      client_started_at,
    } = parsed.data;

    if (website.trim().length > 0) {
      return NextResponse.json({ error: "Invalid request." }, { status: 400 });
    }

    if (typeof client_started_at === "number") {
      const elapsed = Date.now() - client_started_at;
      if (elapsed < MIN_FORM_FILL_MS || elapsed > MAX_FORM_FILL_MS) {
        return NextResponse.json({ error: "Invalid form timing." }, { status: 400 });
      }
    }

    const supabase = getSupabaseAdminClient();

    const { data: existingTrx } = await supabase
      .from("orders")
      .select("id")
      .eq("bkash_trx_id", bkash_trx_id)
      .limit(1);

    if (existingTrx && existingTrx.length > 0) {
      return NextResponse.json(
        { error: "This Transaction ID was already used." },
        { status: 409 }
      );
    }

    const { data, error } = await supabase
      .from("orders")
      .insert([
        {
          customer_name,
          phone,
          address,
          delivery_method,
          total_amount,
          bkash_trx_id,
          status: "Pending",
        },
      ])
      .select("id")
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ id: data?.id }, { status: 201 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unexpected error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
