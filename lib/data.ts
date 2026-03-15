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

export async function getProducts() {
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Products fetch error:", error.message);
    return [];
  }

  return data || [];
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
