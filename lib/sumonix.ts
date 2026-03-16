import { getStoreSettings } from "@/lib/data";
import { getSupabaseAdminClient } from "@/lib/supabase-admin";
import { hasSupabasePublicConfig, supabase } from "@/lib/supabase";
import type { Product, Order, StoreSettings } from "@/types";

type SuggestedProduct = {
  id: string;
  name: string;
  price: number;
  image_url: string;
  category: string;
  campaign_badge?: string | null;
};

type AssistantReply = {
  message: string;
  products?: SuggestedProduct[];
};

function normalize(text: string) {
  return text.toLowerCase().trim();
}

function includesAny(text: string, words: string[]) {
  return words.some((word) => text.includes(word));
}

function formatCurrency(value: number) {
  return `৳${value}`;
}

function productToSuggestion(product: Product): SuggestedProduct {
  return {
    id: product.id,
    name: product.name,
    price: Number(product.price),
    image_url: product.image_url,
    category: product.category,
    campaign_badge: product.campaign_badge || null,
  };
}

async function getPublishedProducts() {
  if (!hasSupabasePublicConfig() || !supabase) return [] as Product[];

  let query = supabase
    .from("products")
    .select("*")
    .order("created_at", { ascending: false })
    .eq("is_published", true)
    .limit(100);

  let { data, error } = await query;
  if (error && error.message.toLowerCase().includes("is_published")) {
    const fallback = await supabase
      .from("products")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(100);
    data = fallback.data;
    error = fallback.error;
  }

  if (error) return [];
  return (data || []) as Product[];
}

function findProductMatches(products: Product[], query: string) {
  const normalizedQuery = normalize(query);
  const tokens = normalizedQuery.split(/\s+/).filter(Boolean);

  return products
    .filter((product) => {
      const haystack = normalize(
        `${product.name} ${product.category} ${product.campaign_badge || ""}`
      );
      return tokens.length === 0 || tokens.every((token) => haystack.includes(token));
    })
    .slice(0, 6);
}

function buildStoreReply(settings: StoreSettings | null) {
  if (!settings) {
    return "স্টোর তথ্য এখন পাওয়া যাচ্ছে না। কিছুক্ষণ পরে আবার চেষ্টা করুন।";
  }

  return `স্টোর: ${settings.store_name}. স্লোগান: ${settings.slogan || "N/A"}. ঠিকানা: ${settings.address || "N/A"}. ফোন: ${settings.contact_phone || "N/A"}. WhatsApp: ${settings.whatsapp_number || "N/A"}.`; 
}

export async function getPublicSumonixReply(question: string): Promise<AssistantReply> {
  const query = normalize(question);
  const settings = await getStoreSettings();
  const products = await getPublishedProducts();

  if (!query) {
    return {
      message:
        "আমি SUMONIX AI। আপনি প্রডাক্ট, দাম, সাইজ, পেমেন্ট, কুরিয়ার, ঠিকানা বা কোনো কাপড় দেখতে চাইলে আমাকে জিজ্ঞেস করুন।",
      products: products.slice(0, 4).map(productToSuggestion),
    };
  }

  if (includesAny(query, ["ঠিকানা", "address", "phone", "যোগাযোগ", "contact", "whatsapp", "bkash", "payment", "পেমেন্ট"])) {
    return {
      message: `${buildStoreReply(settings)} পেমেন্ট: bKash এবং Cash on Delivery দুটোই আছে।`,
    };
  }

  if (includesAny(query, ["courier", "কুরিয়ার", "delivery", "ডেলিভারি", "cash on delivery", "cod"])) {
    return {
      message:
        "আমাদের checkout-এ Home Delivery, Pickup, এবং courier নির্বাচন আছে। Pathao, Sundarban, SA Paribahan, RedX, Steadfast, এবং Self Managed courier option আছে। Payment হিসেবে bKash ও Cash on Delivery দুটোই সাপোর্ট করে।",
    };
  }

  if (includesAny(query, ["কত প্রডাক্ট", "how many products", "মোট প্রডাক্ট", "সব প্রডাক্ট"])) {
    return {
      message: `এখন প্রকাশিত প্রডাক্ট আছে ${products.length} টি। চাইলে আমি category বা নাম অনুযায়ী কাপড় দেখাতে পারি।`,
      products: products.slice(0, 4).map(productToSuggestion),
    };
  }

  if (includesAny(query, ["featured", "ফিচার", "campaign", "badge", "offer", "অফার", "sale", "discount"])) {
    const featured = products.filter((product) => product.is_featured || product.campaign_badge).slice(0, 6);
    return {
      message:
        featured.length > 0
          ? `এখন ${featured.length} টি featured বা campaign প্রডাক্ট পাওয়া গেছে। নিচে দেখুন।`
          : "এই মুহূর্তে আলাদা featured/campaign প্রডাক্ট পাওয়া যায়নি।",
      products: featured.map(productToSuggestion),
    };
  }

  if (includesAny(query, ["দাম", "price", "shirt", "panjabi", "polo", "sharee", "kids", "show", "দেখান", "কাপড়", "product"])) {
    const matches = findProductMatches(products, query);
    if (matches.length > 0) {
      const summary = matches
        .slice(0, 3)
        .map((item) => `${item.name} (${formatCurrency(Number(item.price))})`)
        .join(", ");

      return {
        message: `আমি এই matching প্রডাক্টগুলো পেয়েছি: ${summary}. নিচে বিস্তারিত দেখুন।`,
        products: matches.map(productToSuggestion),
      };
    }

    return {
      message:
        "আপনার প্রশ্ন অনুযায়ী নির্দিষ্ট কাপড় পাইনি। আপনি category, product name, বা price range লিখে আবার জিজ্ঞেস করতে পারেন।",
      products: products.slice(0, 4).map(productToSuggestion),
    };
  }

  return {
    message:
      "আমি SUMONIX AI। আমি প্রডাক্ট, দাম, পেমেন্ট, courier, ঠিকানা, এবং available কাপড় সম্পর্কে সাহায্য করতে পারি। চাইলে নাম বা category লিখে কোনো কাপড় দেখাতে বলুন।",
    products: products.slice(0, 3).map(productToSuggestion),
  };
}

export async function getAdminSumonixReply(question: string): Promise<AssistantReply> {
  const query = normalize(question);
  const supabase = getSupabaseAdminClient();
  const settings = await getStoreSettings();

  const [{ data: products }, { data: orders }] = await Promise.all([
    supabase.from("products").select("*"),
    supabase.from("orders").select("*"),
  ]);

  const productRows = (products || []) as Product[];
  const orderRows = (orders || []) as Order[];
  const totalSales = orderRows.reduce((sum, item) => sum + Number(item.total_amount || 0), 0);
  const pending = orderRows.filter((item) => item.status === "Pending").length;
  const delivered = orderRows.filter((item) => item.status === "Delivered").length;
  const returned = orderRows.filter((item) => item.status === "Returned").length;
  const cancelled = orderRows.filter((item) => item.status === "Cancelled").length;
  const lowStock = productRows.filter((item) => (item.stock_quantity ?? 20) <= 5).length;
  const featured = productRows.filter((item) => item.is_featured).length;
  const drafts = productRows.filter((item) => item.is_published === false).length;

  if (!query || includesAny(query, ["overview", "summary", "ড্যাশবোর্ড", "সব তথ্য", "store status"])) {
    return {
      message: `SUMONIX AI Admin Summary: মোট প্রডাক্ট ${productRows.length}, draft ${drafts}, featured ${featured}, low stock ${lowStock}, মোট অর্ডার ${orderRows.length}, pending ${pending}, delivered ${delivered}, returned ${returned}, cancelled ${cancelled}, মোট বিক্রয় ${formatCurrency(totalSales)}. ঠিকানা: ${settings?.address || "N/A"}.`,
      products: productRows.slice(0, 4).map(productToSuggestion),
    };
  }

  if (includesAny(query, ["sales", "বিক্রয়", "revenue", "income"])) {
    return {
      message: `এখন পর্যন্ত মোট বিক্রয় ${formatCurrency(totalSales)}। Delivered ${delivered}, Pending ${pending}, Returned ${returned}, Cancelled ${cancelled}.`,
    };
  }

  if (includesAny(query, ["stock", "low stock", "স্টক", "featured", "campaign", "draft"])) {
    const lowStockItems = productRows.filter((item) => (item.stock_quantity ?? 20) <= 5).slice(0, 5);
    return {
      message: `Low stock ${lowStock} টি, featured ${featured} টি, draft ${drafts} টি। নিচে কিছু important product দেখুন।`,
      products: lowStockItems.length > 0 ? lowStockItems.map(productToSuggestion) : productRows.slice(0, 5).map(productToSuggestion),
    };
  }

  if (includesAny(query, ["product", "প্রডাক্ট", "কাপড়", "show", "দেখান"])) {
    const matches = findProductMatches(productRows, query);
    return {
      message:
        matches.length > 0
          ? `আপনার query অনুযায়ী ${matches.length} টি product match পেয়েছি।`
          : "নির্দিষ্ট match পাওয়া যায়নি, তবে নিচে কিছু product দেখানো হলো।",
      products: (matches.length > 0 ? matches : productRows.slice(0, 5)).map(productToSuggestion),
    };
  }

  return {
    message:
      "আমি SUMONIX AI admin assistant। আমি products, orders, stock, sales, draft, featured items, এবং store information সম্পর্কে grounded summary দিতে পারি।",
    products: productRows.slice(0, 4).map(productToSuggestion),
  };
}
