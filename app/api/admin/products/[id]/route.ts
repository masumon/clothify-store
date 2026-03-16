import { NextResponse } from "next/server";
import { getSupabaseAdminClient } from "@/lib/supabase-admin";

export async function DELETE(
  _req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id?.trim();
    if (!id) {
      return NextResponse.json({ error: "Product id is required." }, { status: 400 });
    }

    const supabase = getSupabaseAdminClient();
    const { error } = await supabase.from("products").delete().eq("id", id);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unexpected error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
