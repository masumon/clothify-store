import { unstable_noStore as noStore } from "next/cache";
import { hasSupabasePublicConfig, supabase } from "./supabase";

export async function getStoreSettings() {
  noStore();

  if (!hasSupabasePublicConfig() || !supabase) {
    return null;
  }

  const { data, error } = await supabase
    .from("store_settings")
    .select("*")
    .eq("id", 1)
    .single();

  if (error) {
    console.error("Store settings fetch error:", error.message);
    return null;
  }

  return data;
}

export async function getProducts(filters?: {
  search?: string;
  category?: string;
}) {
  noStore();

  if (!hasSupabasePublicConfig() || !supabase) {
    return [];
  }

  let query = supabase
    .from("products")
    .select("*")
    .order("created_at", { ascending: false });

  if (filters?.search) {
    query = query.ilike("name", `%${filters.search}%`);
  }

  if (filters?.category && filters.category !== "All") {
    query = query.eq("category", filters.category);
  }

  const { data, error } = await query;

  if (error) {
    console.error("Products fetch error:", error.message);
    return [];
  }

  return data || [];
}

export async function getCategories() {
  noStore();

  if (!hasSupabasePublicConfig() || !supabase) {
    return [];
  }

  const { data, error } = await supabase.from("products").select("category");

  if (error) {
    console.error("Category fetch error:", error.message);
    return [];
  }

  const uniqueCategories = Array.from(
    new Set(
      (data || [])
        .map((item) => item.category)
        .filter((item): item is string => Boolean(item))
    )
  );

  return uniqueCategories;
}

export async function getProductById(id: string) {
  noStore();

  if (!hasSupabasePublicConfig() || !supabase) {
    return null;
  }

  const { data, error } = await supabase
    .from("products")
    .select("*")
    .eq("id", id)
    .single();

  if (error) {
    console.error("Product fetch error:", error.message);
    return null;
  }

  return data;
}
