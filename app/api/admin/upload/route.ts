import { NextRequest, NextResponse } from "next/server";
import { getSupabaseAdminClient } from "@/lib/supabase-admin";

const allowedBuckets = new Set(["product-images", "store-assets"]);
const allowedMimeTypes = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
]);
const MAX_UPLOAD_SIZE_BYTES = 5 * 1024 * 1024;

function sanitizeSegment(value: string) {
  return value.replace(/[^a-zA-Z0-9-_/]/g, "-").replace(/\s+/g, "-");
}

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("file");
    const bucket = String(formData.get("bucket") || "").trim();
    const folder = String(formData.get("folder") || "").trim();

    if (!(file instanceof File)) {
      return NextResponse.json({ error: "File is required." }, { status: 400 });
    }

    if (file.size > MAX_UPLOAD_SIZE_BYTES) {
      return NextResponse.json(
        { error: "File too large. Max allowed size is 5MB." },
        { status: 400 }
      );
    }

    if (!allowedMimeTypes.has(file.type)) {
      return NextResponse.json(
        { error: "Invalid file type. Only JPG, PNG, WEBP, GIF are allowed." },
        { status: 400 }
      );
    }

    if (!allowedBuckets.has(bucket)) {
      return NextResponse.json({ error: "Invalid storage bucket." }, { status: 400 });
    }

    const safeFolder = sanitizeSegment(folder || "uploads");
    const safeName = sanitizeSegment(file.name || "upload.bin");
    const path = `${safeFolder}/${Date.now()}-${safeName}`;

    const supabase = getSupabaseAdminClient();

    const { error: uploadError } = await supabase.storage
      .from(bucket)
      .upload(path, file, {
        upsert: false,
        contentType: file.type || "application/octet-stream",
      });

    if (uploadError) {
      return NextResponse.json({ error: uploadError.message }, { status: 500 });
    }

    const { data } = supabase.storage.from(bucket).getPublicUrl(path);

    return NextResponse.json({ url: data.publicUrl }, { status: 201 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unexpected error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
