import { unstable_noStore as noStore } from "next/cache";
import { hasSupabasePublicConfig, supabase } from "./supabase";

type CacheEntry<T> = {
  value: T;
  expiresAt: number;
};

type DataCacheState = {
  settings: CacheEntry<any> | null;
  categories: CacheEntry<string[]> | null;
  productsAll: CacheEntry<any[]> | null;
  productsById: Map<string, CacheEntry<any>>;
  pending: Map<string, Promise<any>>;
};

const SETTINGS_TTL_MS = 60 * 1000;
const CATEGORIES_TTL_MS = 60 * 1000;
const PRODUCTS_TTL_MS = 45 * 1000;
const PRODUCT_BY_ID_TTL_MS = 60 * 1000;

const globalDataState = globalThis as unknown as {
  __clothifyDataCacheState?: DataCacheState;
};

if (!globalDataState.__clothifyDataCacheState) {
  globalDataState.__clothifyDataCacheState = {
    settings: null,
    categories: null,
    productsAll: null,
    productsById: new Map(),
    pending: new Map(),
  };
}

const cacheState = globalDataState.__clothifyDataCacheState;

function readCache<T>(entry: CacheEntry<T> | null) {
  if (!entry) return null;
  if (Date.now() > entry.expiresAt) return null;
  return entry.value;
}

function writeCache<T>(value: T, ttlMs: number): CacheEntry<T> {
  return {
    value,
    expiresAt: Date.now() + ttlMs,
  };
}

async function getOrSetPending<T>(key: string, load: () => Promise<T>) {
  const existing = cacheState.pending.get(key) as Promise<T> | undefined;
  if (existing) return existing;

  const pendingPromise = load().finally(() => {
    cacheState.pending.delete(key);
  });

  cacheState.pending.set(key, pendingPromise as Promise<any>);
  return pendingPromise;
}

export async function getStoreSettings() {
  if (!hasSupabasePublicConfig() || !supabase) {
    return null;
  }

  const cached = readCache(cacheState.settings);
  if (cached) {
    return cached;
  }

  return getOrSetPending("store-settings", async () => {
    const { data, error } = await supabase
      .from("store_settings")
      .select("*")
      .eq("id", 1)
      .single();

    if (error) {
      console.error("Store settings fetch error:", error.message);
      return null;
    }

    cacheState.settings = writeCache(data, SETTINGS_TTL_MS);
    return data;
  });
}

export async function getProducts(filters?: {
  search?: string;
  category?: string;
}) {
  const hasFilters = Boolean(filters?.search?.trim()) || Boolean(filters?.category && filters.category !== "All");
  if (hasFilters) {
    noStore();
  }

  if (!hasSupabasePublicConfig() || !supabase) {
    return [];
  }

  if (!hasFilters) {
    const cached = readCache(cacheState.productsAll);
    if (cached) {
      return cached;
    }

    return getOrSetPending("products-all", async () => {
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Products fetch error:", error.message);
        return [];
      }

      const rows = data || [];
      cacheState.productsAll = writeCache(rows, PRODUCTS_TTL_MS);
      return rows;
    });
  }

  let query = supabase.from("products").select("*").order("created_at", { ascending: false });

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
  if (!hasSupabasePublicConfig() || !supabase) {
    return [];
  }

  const cached = readCache(cacheState.categories);
  if (cached) {
    return cached;
  }

  return getOrSetPending("categories", async () => {
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

    cacheState.categories = writeCache(uniqueCategories, CATEGORIES_TTL_MS);
    return uniqueCategories;
  });
}

export async function getProductById(id: string) {
  if (!hasSupabasePublicConfig() || !supabase) {
    return null;
  }

  const key = id.trim();
  if (!key) return null;

  const cached = readCache(cacheState.productsById.get(key) || null);
  if (cached) {
    return cached;
  }

  return getOrSetPending(`product-${key}`, async () => {
    const { data, error } = await supabase
      .from("products")
      .select("*")
      .eq("id", key)
      .single();

    if (error) {
      console.error("Product fetch error:", error.message);
      return null;
    }

    cacheState.productsById.set(key, writeCache(data, PRODUCT_BY_ID_TTL_MS));
    return data;
  });
}
