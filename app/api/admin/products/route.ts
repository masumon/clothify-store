import { NextResponse } from "next/server";
import { getSupabaseAdminClient } from "@/lib/supabase-admin";

type ProductPayload = {
  id?: string;
  ids?: string[];
  name?: string;
  price?: number;
  category?: string;
  sizes?: string[];
  image_url?: string;
  is_published?: boolean;
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
    const ids = Array.isArray(payload.ids)
      ? payload.ids
          .map((item) => (typeof item === "string" ? item.trim() : ""))
          .filter(Boolean)
      : [];
    const name = readString(payload.name);
    const category = readString(payload.category);
    const sizes = readSizes(payload.sizes);
    const price = Number(payload.price);
    const hasPublishedFlag = typeof payload.is_published === "boolean";
    const isPublished = payload.is_published;
    const isBulk = ids.length > 0;

    if (isBulk && !hasPublishedFlag) {
      return NextResponse.json(
        { error: "Bulk update supports publish/unpublish only." },
        { status: 400 }
      );
    }

    if (!isBulk && !id) {
      return NextResponse.json({ error: "Product id is required." }, { status: 400 });
    }

    const supabase = getSupabaseAdminClient();

    let error: { message: string } | null = null;

    if (isBulk) {
      const result = await supabase
        .from("products")
        .update({
          is_published: isPublished,
        })
        .in("id", ids);
      error = result.error;
    } else {
      const updates: Record<string, unknown> = {};
      if (name) updates.name = name;
      if (Number.isFinite(price) && price > 0) updates.price = price;
      if (category) updates.category = category;
      if (Array.isArray(payload.sizes)) updates.sizes = sizes;
      if (hasPublishedFlag) updates.is_published = isPublished;

      if (Object.keys(updates).length === 0) {
        return NextResponse.json({ error: "No valid updates provided." }, { status: 400 });
      }

      const result = await supabase.from("products").update(updates).eq("id", id);
      error = result.error;
    }

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unexpected error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
