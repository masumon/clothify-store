import { NextResponse } from "next/server";
import { getSupabaseAdminClient } from "@/lib/supabase-admin";

type ProductPayload = {
  id?: string;
  name?: string;
  price?: number;
  category?: string;
  sizes?: string[];
  image_url?: string;
};

function readString(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}

function readSizes(value: unknown) {
  if (!Array.isArray(value)) return [];
  return value
    .map((item) => (typeof item === "string" ? item.trim() : ""))
    .filter(Boolean);
}

export async function POST(req: Request) {
  try {
    const payload = (await req.json()) as ProductPayload;
    const name = readString(payload.name);
    const category = readString(payload.category);
    const image_url = readString(payload.image_url);
    const sizes = readSizes(payload.sizes);
    const price = Number(payload.price);

    if (!name || !category || !image_url || !Number.isFinite(price) || price <= 0) {
      return NextResponse.json({ error: "Invalid product payload." }, { status: 400 });
    }

    const supabase = getSupabaseAdminClient();

    const { error } = await supabase.from("products").insert([
      {
        name,
        price,
        category,
        sizes,
        image_url,
      },
    ]);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ ok: true }, { status: 201 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unexpected error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function PATCH(req: Request) {
  try {
    const payload = (await req.json()) as ProductPayload;
    const id = readString(payload.id);
    const name = readString(payload.name);
    const category = readString(payload.category);
    const sizes = readSizes(payload.sizes);
    const price = Number(payload.price);

    if (!id || !name || !category || !Number.isFinite(price) || price <= 0) {
      return NextResponse.json({ error: "Invalid product payload." }, { status: 400 });
    }

    const supabase = getSupabaseAdminClient();

    const { error } = await supabase
      .from("products")
      .update({
        name,
        price,
        category,
        sizes,
      })
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
