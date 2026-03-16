import { NextResponse } from "next/server";
import { getSupabaseAdminClient } from "@/lib/supabase-admin";

type SettingsPayload = {
  store_name?: string;
  slogan?: string;
  logo_url?: string;
  address?: string;
  contact_phone?: string;
  whatsapp_number?: string;
  bkash_number?: string;
  bkash_qr_url?: string;
};

function normalize(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}

export async function PUT(req: Request) {
  try {
    const payload = (await req.json()) as SettingsPayload;

    const store_name = normalize(payload.store_name);
    const slogan = normalize(payload.slogan);

    if (!store_name || !slogan) {
      return NextResponse.json(
        { error: "Store name and slogan are required." },
        { status: 400 }
      );
    }

    const supabase = getSupabaseAdminClient();

    const { error } = await supabase.from("store_settings").upsert({
      id: 1,
      store_name,
      slogan,
      logo_url: normalize(payload.logo_url) || null,
      address: normalize(payload.address) || null,
      contact_phone: normalize(payload.contact_phone) || null,
      whatsapp_number: normalize(payload.whatsapp_number) || null,
      bkash_number: normalize(payload.bkash_number) || null,
      bkash_qr_url: normalize(payload.bkash_qr_url) || null,
    });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unexpected error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
