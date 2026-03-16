import { NextResponse } from "next/server";
import { getSupabaseAdminClient } from "@/lib/supabase-admin";

type CreateOrderPayload = {
  customer_name: string;
  phone: string;
  address: string;
  delivery_method: string;
  total_amount: number;
  bkash_trx_id: string;
};

function asNonEmptyString(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}

export async function POST(req: Request) {
  try {
    const payload = (await req.json()) as Partial<CreateOrderPayload>;

    const customer_name = asNonEmptyString(payload.customer_name);
    const phone = asNonEmptyString(payload.phone);
    const address = asNonEmptyString(payload.address);
    const delivery_method = asNonEmptyString(payload.delivery_method);
    const bkash_trx_id = asNonEmptyString(payload.bkash_trx_id);
    const total_amount = Number(payload.total_amount);

    if (!customer_name || !phone || !address || !delivery_method || !bkash_trx_id) {
      return NextResponse.json(
        { error: "Please fill all required order fields." },
        { status: 400 }
      );
    }

    if (!Number.isFinite(total_amount) || total_amount <= 0) {
      return NextResponse.json(
        { error: "Order total amount is invalid." },
        { status: 400 }
      );
    }

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
