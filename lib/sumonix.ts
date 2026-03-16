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
  sizes?: string[];
  stock_quantity?: number;
  campaign_badge?: string | null;
};

type AssistantReply = {
  message: string;
  products?: SuggestedProduct[];
  actions?: string[];
};

type AssistantMode = "public" | "admin";

function normalize(text: string) {
  return text.toLowerCase().trim();
}

function includesAny(text: string, words: string[]) {
  return words.some((word) => text.includes(word));
}

function formatCurrency(value: number) {
  return `৳${value}`;
}

function isThanksQuery(query: string) {
  return includesAny(query, ["thanks", "thank you", "ধন্যবাদ", "থ্যাংকস", "jazak", "শুকরিয়া"]);
}

function isByeQuery(query: string) {
  return includesAny(query, ["bye", "বিদায়", "আল্লাহ হাফেজ", "খোদা হাফেজ", "see you", "good night"]);
}

function composePoliteMessage(question: string, coreMessage: string, mode: AssistantMode) {
  const query = normalize(question);
  const welcomePrefix = includesAny(query, [
    "hello",
    "hi",
    "hey",
    "হাই",
    "হ্যালো",
    "আসসালামু",
    "সালাম",
  ])
    ? "স্বাগতম। "
    : "ধন্যবাদ প্রশ্ন করার জন্য। ";

  if (isThanksQuery(query)) {
    return mode === "admin"
      ? "অনেক ধন্যবাদ। আপনার admin কাজগুলোতে আমি পাশে আছি, আবার কিছু লাগলে বলুন।"
      : "অনেক ধন্যবাদ। আপনার শপিংয়ে সাহায্য করতে পেরে ভালো লাগলো, আবার জিজ্ঞেস করতে পারেন।";
  }

  if (isByeQuery(query)) {
    return mode === "admin"
      ? "ধন্যবাদ। আপনার দিনটি সুন্দর কাটুক, প্রয়োজন হলে আবার SUMONIX AI admin-কে বলুন।"
      : "ধন্যবাদ। ভালো থাকুন, আবার আসবেন। প্রয়োজনে আমি সাথে সাথে সাহায্য করব।";
  }

  const closeLine =
    mode === "admin"
      ? "আর কোনো admin task থাকলে বলুন, আমি তাৎক্ষণিকভাবে গাইড করব।"
      : "আর কিছু জানতে চাইলে বলুন, আমি পছন্দের প্রডাক্ট খুঁজে দিতে প্রস্তুত।";

  return `${welcomePrefix}${coreMessage} ${closeLine}`;
}

function productToSuggestion(product: Product): SuggestedProduct {
  return {
    id: product.id,
    name: product.name,
    price: Number(product.price),
    image_url: product.image_url,
    category: product.category,
    sizes: product.sizes || [],
    stock_quantity: product.stock_quantity ?? 20,
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

function extractBudget(query: string) {
  const match = query.match(/(\d{2,6})/);
  if (!match) return null;
  const value = Number(match[1]);
  return Number.isFinite(value) ? value : null;
}

function topProductsByBudget(products: Product[], budget: number) {
  const under = products
    .filter((item) => Number(item.price) <= budget)
    .sort((a, b) => Number(b.price) - Number(a.price))
    .slice(0, 6);

  if (under.length > 0) return under;

  return products
    .slice()
    .sort((a, b) => Math.abs(Number(a.price) - budget) - Math.abs(Number(b.price) - budget))
    .slice(0, 6);
}

function normalizeOrderStatus(query: string): string | null {
  const mapping: Array<{ words: string[]; status: string }> = [
    { words: ["pending", "পেন্ডিং"], status: "Pending" },
    { words: ["processing", "প্রসেসিং"], status: "Processing" },
    { words: ["shipped", "shipment", "শিপ", "কুরিয়ারে"], status: "Shipped" },
    { words: ["delivered", "complete delivery", "ডেলিভার"], status: "Delivered" },
    { words: ["completed", "done", "কমপ্লিট"], status: "Completed" },
    { words: ["returned", "রিটার্ন"], status: "Returned" },
    { words: ["cancel", "cancelled", "বাতিল", "ক্যানসেল"], status: "Cancelled" },
  ];

  for (const item of mapping) {
    if (includesAny(query, item.words)) {
      return item.status;
    }
  }

  return null;
}

function parseNameAfterKeyword(query: string, keywords: string[]) {
  for (const keyword of keywords) {
    const idx = query.indexOf(keyword);
    if (idx === -1) continue;
    const raw = query.slice(idx + keyword.length).trim();
    if (!raw) continue;
    return raw.replace(/(কে|to|as|করুন|set|status|product|order)/g, "").trim();
  }
  return "";
}

async function executeAdminAction(question: string) {
  const query = normalize(question);
  const supabase = getSupabaseAdminClient();
  const actions: string[] = [];

  const status = normalizeOrderStatus(query);
  const orderIdMatch = question.match(/([a-f0-9]{8}-[a-f0-9-]{12,}|\border[-_ ]?[a-z0-9-]{4,}\b)/i);

  if (status && orderIdMatch && includesAny(query, ["order", "অর্ডার", "status", "স্ট্যাটাস"])) {
    const orderId = orderIdMatch[1].replace(/^order[-_ ]?/i, "").trim();
    const { error } = await supabase.from("orders").update({ status }).eq("id", orderId);

    if (!error) {
      actions.push(`Order ${orderId} status updated to ${status}.`);
    }
  }

  const { data: products } = await supabase.from("products").select("id,name").limit(300);
  const productRows = (products || []) as Array<{ id: string; name: string }>;

  const publishName = parseNameAfterKeyword(query, ["publish", "প্রকাশ", "live"]);
  if (publishName) {
    const target = productRows.find((item) => normalize(item.name).includes(normalize(publishName)));
    if (target) {
      const { error } = await supabase
        .from("products")
        .update({ is_published: true })
        .eq("id", target.id);
      if (!error) actions.push(`Product \"${target.name}\" published.`);
    }
  }

  const draftName = parseNameAfterKeyword(query, ["draft", "ড্রাফট", "unpublish"]);
  if (draftName) {
    const target = productRows.find((item) => normalize(item.name).includes(normalize(draftName)));
    if (target) {
      const { error } = await supabase
        .from("products")
        .update({ is_published: false })
        .eq("id", target.id);
      if (!error) actions.push(`Product \"${target.name}\" moved to draft.`);
    }
  }

  const featuredName = parseNameAfterKeyword(query, ["featured", "ফিচার্ড", "feature"]);
  if (featuredName) {
    const target = productRows.find((item) => normalize(item.name).includes(normalize(featuredName)));
    if (target) {
      const { error } = await supabase
        .from("products")
        .update({ is_featured: true })
        .eq("id", target.id);
      if (!error) actions.push(`Product \"${target.name}\" marked featured.`);
    }
  }

  const stockMatch = question.match(/(stock|স্টক)\s+(.+?)\s+(\d{1,5})/i);
  if (stockMatch) {
    const productName = stockMatch[2].trim();
    const quantity = Number(stockMatch[3]);
    const target = productRows.find((item) => normalize(item.name).includes(normalize(productName)));

    if (target && Number.isFinite(quantity) && quantity >= 0) {
      const { error } = await supabase
        .from("products")
        .update({ stock_quantity: quantity })
        .eq("id", target.id);
      if (!error) actions.push(`Product \"${target.name}\" stock set to ${quantity}.`);
    }
  }

  return actions;
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

  const respond = (
    coreMessage: string,
    extras: Omit<AssistantReply, "message"> = {}
  ): AssistantReply => ({
    message: composePoliteMessage(question, coreMessage, "public"),
    ...extras,
  });

  const budget = extractBudget(query);

  if (budget && includesAny(query, ["within", "under", "below", "কমে", "ভিতরে", "budget", "বাজেট"])) {
    const recommended = topProductsByBudget(products, budget);
    return respond(
      recommended.length > 0
        ? `৳${budget} বাজেট অনুযায়ী ${recommended.length}টি প্রডাক্ট সাজেস্ট করেছি। নিচে দেখে কার্টে যোগ করতে পারবেন।`
        : "এই বাজেটে প্রডাক্ট পাওয়া যায়নি।",
      {
        products: recommended.map(productToSuggestion),
      }
    );
  }

  if (isThanksQuery(query) || isByeQuery(query)) {
    return respond("আপনার বার্তাটি পেয়েছি।");
  }

  if (!query) {
    return respond(
      "আমি SUMONIX AI। আপনি প্রডাক্ট, দাম, সাইজ, পেমেন্ট, কুরিয়ার, ঠিকানা বা কোনো কাপড় দেখতে চাইলে আমাকে জিজ্ঞেস করুন।",
      {
        products: products.slice(0, 4).map(productToSuggestion),
      }
    );
  }

  if (includesAny(query, ["ঠিকানা", "address", "phone", "যোগাযোগ", "contact", "whatsapp", "bkash", "payment", "পেমেন্ট"])) {
    return respond(`${buildStoreReply(settings)} পেমেন্ট: bKash এবং Cash on Delivery দুটোই আছে।`);
  }

  if (includesAny(query, ["courier", "কুরিয়ার", "delivery", "ডেলিভারি", "cash on delivery", "cod"])) {
    return respond(
      "আমাদের checkout-এ Home Delivery, Pickup, এবং courier নির্বাচন আছে। Pathao, Sundarban, SA Paribahan, RedX, Steadfast, এবং Self Managed courier option আছে। Payment হিসেবে bKash ও Cash on Delivery দুটোই সাপোর্ট করে।"
    );
  }

  if (includesAny(query, ["কত প্রডাক্ট", "how many products", "মোট প্রডাক্ট", "সব প্রডাক্ট"])) {
    return respond(`এখন প্রকাশিত প্রডাক্ট আছে ${products.length} টি। চাইলে আমি category বা নাম অনুযায়ী কাপড় দেখাতে পারি।`, {
      products: products.slice(0, 4).map(productToSuggestion),
    });
  }

  if (includesAny(query, ["featured", "ফিচার", "campaign", "badge", "offer", "অফার", "sale", "discount"])) {
    const featured = products.filter((product) => product.is_featured || product.campaign_badge).slice(0, 6);
    return respond(
      featured.length > 0
        ? `এখন ${featured.length} টি featured বা campaign প্রডাক্ট পাওয়া গেছে। নিচে দেখুন।`
        : "এই মুহূর্তে আলাদা featured/campaign প্রডাক্ট পাওয়া যায়নি।",
      {
        products: featured.map(productToSuggestion),
      }
    );
  }

  if (includesAny(query, ["দাম", "price", "shirt", "panjabi", "polo", "sharee", "kids", "show", "দেখান", "কাপড়", "product"])) {
    const matches = findProductMatches(products, query);
    if (matches.length > 0) {
      const summary = matches
        .slice(0, 3)
        .map((item) => `${item.name} (${formatCurrency(Number(item.price))})`)
        .join(", ");

      return respond(`আমি এই matching প্রডাক্টগুলো পেয়েছি: ${summary}. নিচে বিস্তারিত দেখুন।`, {
        products: matches.map(productToSuggestion),
      });
    }

    return respond(
      "আপনার প্রশ্ন অনুযায়ী নির্দিষ্ট কাপড় পাইনি। আপনি category, product name, বা price range লিখে আবার জিজ্ঞেস করতে পারেন।",
      {
        products: products.slice(0, 4).map(productToSuggestion),
      }
    );
  }

  return respond(
    "আমি SUMONIX AI। আমি প্রডাক্ট, দাম, পেমেন্ট, courier, ঠিকানা, এবং available কাপড় সম্পর্কে সাহায্য করতে পারি। চাইলে নাম বা category লিখে কোনো কাপড় দেখাতে বলুন।",
    {
      products: products.slice(0, 3).map(productToSuggestion),
    }
  );
}

export async function getAdminSumonixReply(question: string): Promise<AssistantReply> {
  const query = normalize(question);
  const actions = await executeAdminAction(question);
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

  const respond = (
    coreMessage: string,
    extras: Omit<AssistantReply, "message"> = {}
  ): AssistantReply => ({
    message: composePoliteMessage(question, coreMessage, "admin"),
    ...extras,
  });

  if (isThanksQuery(query) || isByeQuery(query)) {
    return respond("আপনার বার্তাটি পেয়েছি।");
  }

  if (actions.length > 0) {
    return respond(`Action completed: ${actions.join(" ")}`, {
      actions,
      products: productRows.slice(0, 5).map(productToSuggestion),
    });
  }

  if (!query || includesAny(query, ["overview", "summary", "ড্যাশবোর্ড", "সব তথ্য", "store status"])) {
    return respond(`SUMONIX AI Admin Summary: মোট প্রডাক্ট ${productRows.length}, draft ${drafts}, featured ${featured}, low stock ${lowStock}, মোট অর্ডার ${orderRows.length}, pending ${pending}, delivered ${delivered}, returned ${returned}, cancelled ${cancelled}, মোট বিক্রয় ${formatCurrency(totalSales)}. ঠিকানা: ${settings?.address || "N/A"}.`, {
      products: productRows.slice(0, 4).map(productToSuggestion),
    });
  }

  if (includesAny(query, ["sales", "বিক্রয়", "revenue", "income"])) {
    return respond(`এখন পর্যন্ত মোট বিক্রয় ${formatCurrency(totalSales)}। Delivered ${delivered}, Pending ${pending}, Returned ${returned}, Cancelled ${cancelled}.`);
  }

  if (includesAny(query, ["stock", "low stock", "স্টক", "featured", "campaign", "draft"])) {
    const lowStockItems = productRows.filter((item) => (item.stock_quantity ?? 20) <= 5).slice(0, 5);
    return respond(`Low stock ${lowStock} টি, featured ${featured} টি, draft ${drafts} টি। নিচে কিছু important product দেখুন।`, {
      products: lowStockItems.length > 0 ? lowStockItems.map(productToSuggestion) : productRows.slice(0, 5).map(productToSuggestion),
    });
  }

  if (includesAny(query, ["product", "প্রডাক্ট", "কাপড়", "show", "দেখান"])) {
    const matches = findProductMatches(productRows, query);
    return respond(
        matches.length > 0
          ? `আপনার query অনুযায়ী ${matches.length} টি product match পেয়েছি।`
          : "নির্দিষ্ট match পাওয়া যায়নি, তবে নিচে কিছু product দেখানো হলো।",
      {
        products: (matches.length > 0 ? matches : productRows.slice(0, 5)).map(productToSuggestion),
      }
    );
  }

  return respond(
    "আমি SUMONIX AI admin assistant। আমি products, orders, stock, sales, draft, featured items, এবং store information সম্পর্কে grounded summary দিতে পারি।",
    {
    products: productRows.slice(0, 4).map(productToSuggestion),
    }
  );
}
