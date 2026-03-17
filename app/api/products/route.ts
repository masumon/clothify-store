import { NextResponse } from "next/server";
import { getProducts } from "@/lib/data";

export const revalidate = 60;

export async function GET() {
  try {
    const products = await getProducts();
    return NextResponse.json(products || []);
  } catch (error) {
    console.error("Products API error:", error);
    return NextResponse.json([], { status: 500 });
  }
}
