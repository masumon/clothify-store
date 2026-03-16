import { NextResponse } from "next/server";
import { getSupabaseAdminClient } from "@/lib/supabase-admin";

const allowedStatuses = new Set([
  "Pending",
  "Processing",
  "Shipped",
  "Delivered",
  "Completed",
  "Returned",
  "Cancelled",
]);

export async function PATCH(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id?.trim();
    const body = (await req.json()) as { status?: string };
    const status = typeof body.status === "string" ? body.status.trim() : "";

    if (!id || !allowedStatuses.has(status)) {
      return NextResponse.json({ error: "Invalid order status payload." }, { status: 400 });
    }

    const supabase = getSupabaseAdminClient();
    const { error } = await supabase
      .from("orders")
      .update({ status })
      .eq("id", id);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unexpected error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
