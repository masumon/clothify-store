import { supabase } from "./supabase";

export async function getStoreSettings() {
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
  const { data, error } = await supabase.from("products").select("category");

  if (error) {
    console.error("Category fetch error:", error.message);
    return [];
  }

  const uniqueCategories = Array.from(
    new Set((data || []).map((item: any) => item.category).filter(Boolean))
  );

  return uniqueCategories;
}

export async function getProductById(id: string) {
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

export async function createOrder(orderData: {
  customer_name: string;
  phone: string;
  address: string;
  delivery_method: string;
  total_amount: number;
  bkash_trx_id: string;
}) {
  const { data, error } = await supabase
    .from("orders")
    .insert([orderData])
    .select()
    .single();

  if (error) {
    console.error("Order insert error:", error.message);
    throw new Error(error.message);
  }

  return data;
}
