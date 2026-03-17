import { NextResponse } from "next/server";
import { getStoreSettings } from "@/lib/data";

export const revalidate = 60;

export async function GET() {
  try {
    const settings = await getStoreSettings();
    return NextResponse.json(settings || {});
  } catch (error) {
    console.error("Settings API error:", error);
    return NextResponse.json({}, { status: 500 });
  }
}
