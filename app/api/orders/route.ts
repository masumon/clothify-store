import { NextResponse } from "next/server";
import { z } from "zod";
import { getSupabaseAdminClient } from "@/lib/supabase-admin";

const BD_PHONE_RE = /^(?:\+?880|0)?1[3-9]\d{8}$/;
const TRX_RE = /^[A-Z0-9]{6,20}$/i;

const OrderSchema = z.object({
  customer_name: z.string().min(2, "Name must be at least 2 characters").max(100),
  phone: z
    .string()
    .regex(BD_PHONE_RE, "Invalid Bangladesh phone number (e.g. 01XXXXXXXXX)"),
  address: z.string().min(5, "Address must be at least 5 characters").max(300),
  delivery_method: z.enum(["Home Delivery", "Pickup"], {
    errorMap: () => ({ message: "Delivery method must be Home Delivery or Pickup" }),
  }),
  total_amount: z
    .number({ invalid_type_error: "Total must be a number" })
    .positive("Total amount must be positive")
    .max(500000, "Amount too large"),
  bkash_trx_id: z
    .string()
    .regex(TRX_RE, "Transaction ID must be 6-20 alphanumeric characters"),
});

export async function POST(req: Request) {
  try {
    const body: unknown = await req.json();
    const parsed = OrderSchema.safeParse(body);

    if (!parsed.success) {
      const firstError = parsed.error.errors[0]?.message ?? "Invalid input";
      return NextResponse.json({ error: firstError }, { status: 400 });
    }

    const { customer_name, phone, address, delivery_method, total_amount, bkash_trx_id } =
      parsed.data;

    const supabase = getSupabaseAdminClient();

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
