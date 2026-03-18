import { getCategories, getStoreSettings } from "@/lib/data";
import { getSupabaseAdminClient } from "@/lib/supabase-admin";
import { hasSupabasePublicConfig, supabase } from "@/lib/supabase";
import { getTrafficSnapshotFromDb } from "@/lib/traffic";
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

type SumonixContext = {
  contextPath?: string | null;
  uiLanguage?: string | null;
};

type UserLanguageCode =
  | "bn"
  | "syl"
  | "en"
  | "hi"
  | "ur"
  | "ar"
  | "es"
  | "fr"
  | "de"
  | "it"
  | "pt"
  | "tr"
  | "id"
  | "ms"
  | "ru"
  | "zh"
  | "ja"
  | "ko";

type LanguageProfile = {
  code: UserLanguageCode;
  targetLabel: string;
};

type PublicKnowledgeContext = {
  settings: StoreSettings | null;
  categories: string[];
  products: Product[];
  contextPath: string;
};

type PublicKnowledgeEntry = {
  id: string;
  keywords: string[];
  pathHints?: string[];
  reply: (ctx: PublicKnowledgeContext) => string;
};

type AdminActionResult = {
  actions: string[];
  previews: string[];
};

type TrafficSnapshot = Awaited<ReturnType<typeof getTrafficSnapshotFromDb>>;

type OrderItemRecord = {
  order_id: string;
  product_id: string;
  quantity: number;
  line_total: number;
  created_at?: string | null;
};

type ProductPerformance = {
  product: Product;
  soldQty: number;
  soldAmount: number;
  soldQtyLast14: number;
  velocityPerDay: number;
  stock: number;
  daysToStockout: number | null;
  recommendedRestock: number;
};

type AdminAnalyticsSnapshot = {
  reportDate: string;
  focusRangeDays: number;
  focusSales: number;
  focusOrders: number;
  focusCompleted: number;
  focusPending: number;
  todaySales: number;
  todayOrders: number;
  todayCompleted: number;
  pendingAll: number;
  processingAll: number;
  shippedAll: number;
  completedAll: number;
  returnedAll: number;
  cancelledAll: number;
  totalSalesAll: number;
  topSelling: ProductPerformance[];
  stockAlerts: ProductPerformance[];
  demandSignals: Array<{
    product: Product;
    productId: string;
    visitCount: number;
    uniqueVisitors: number;
    soldQtyLast5: number;
    conversionGap: number;
  }>;
  dropOffPages: Array<{
    path: string;
    visits: number;
    exits: number;
    exitRate: number;
  }>;
  issueFlags: string[];
  suggestions: string[];
  traffic: TrafficSnapshot & {
    visitsToday: number;
    visitsYesterday: number;
    visitsDeltaPct: number;
  };
  forecast: {
    salesTomorrow: number;
    salesNext7: number;
    visitsTomorrow: number;
    visitsNext7: number;
    confidence: "low" | "medium" | "high";
  };
};

const SUMONIX_FB_URL = "https://www.facebook.com/sumon.mumain";
const DAY_MS = 24 * 60 * 60 * 1000;
const DHAKA_TZ = "Asia/Dhaka";
const SUCCESS_STATUSES = new Set(["delivered", "completed"]);
const OPEN_STATUSES = new Set(["pending", "processing", "shipped"]);
const translationCache = new Map<string, string>();
const hasBengaliTextRegex = /[\u0980-\u09ff]/;
const hasArabicTextRegex = /[\u0600-\u06ff]/;
const hasDevanagariRegex = /[\u0900-\u097f]/;
const hasCyrillicRegex = /[\u0400-\u04ff]/;
const hasHanRegex = /[\u4e00-\u9fff]/;
const hasHiraganaKatakanaRegex = /[\u3040-\u30ff]/;
const hasHangulRegex = /[\uac00-\ud7af]/;

function getOutOfScopeMessage() {
  return `দুঃখিত, আমি এই ওয়েবসাইটের বাহিরে উত্তর দিতে পারবো না। আপনার কিছু জানার থাকলে [SUMONIX AI](${SUMONIX_FB_URL}) কে জিজ্ঞেস করুন।`;
}

function normalize(text: string) {
  return text.toLowerCase().trim();
}

function sanitizeUiLanguage(value: string | null | undefined): UserLanguageCode | null {
  const normalized = normalize(value || "");
  if (!normalized) return null;
  if (normalized.startsWith("bn")) return "bn";
  if (normalized.startsWith("en")) return "en";
  if (normalized.startsWith("hi")) return "hi";
  if (normalized.startsWith("ur")) return "ur";
  if (normalized.startsWith("ar")) return "ar";
  if (normalized.startsWith("es")) return "es";
  if (normalized.startsWith("fr")) return "fr";
  if (normalized.startsWith("de")) return "de";
  if (normalized.startsWith("it")) return "it";
  if (normalized.startsWith("pt")) return "pt";
  if (normalized.startsWith("tr")) return "tr";
  if (normalized.startsWith("id")) return "id";
  if (normalized.startsWith("ms")) return "ms";
  if (normalized.startsWith("ru")) return "ru";
  if (normalized.startsWith("zh")) return "zh";
  if (normalized.startsWith("ja")) return "ja";
  if (normalized.startsWith("ko")) return "ko";
  return null;
}

function languageLabel(code: UserLanguageCode) {
  switch (code) {
    case "bn":
      return "Bangla";
    case "syl":
      return "Sylheti";
    case "en":
      return "English";
    case "hi":
      return "Hindi";
    case "ur":
      return "Urdu";
    case "ar":
      return "Arabic";
    case "es":
      return "Spanish";
    case "fr":
      return "French";
    case "de":
      return "German";
    case "it":
      return "Italian";
    case "pt":
      return "Portuguese";
    case "tr":
      return "Turkish";
    case "id":
      return "Indonesian";
    case "ms":
      return "Malay";
    case "ru":
      return "Russian";
    case "zh":
      return "Chinese";
    case "ja":
      return "Japanese";
    case "ko":
      return "Korean";
    default:
      return "English";
  }
}

function detectFromLatinWords(query: string): UserLanguageCode | null {
  const q = normalize(query);
  if (!q) return null;

  if (includesAny(q, ["hola", "gracias", "pedido", "pago", "comprar", "carrito"])) return "es";
  if (includesAny(q, ["bonjour", "merci", "commande", "paiement", "acheter"])) return "fr";
  if (includesAny(q, ["hallo", "danke", "bestellung", "zahlung", "kaufen"])) return "de";
  if (includesAny(q, ["ciao", "grazie", "ordine", "pagamento", "acquistare"])) return "it";
  if (includesAny(q, ["olá", "ola", "obrigado", "pedido", "pagamento", "comprar"])) return "pt";
  if (includesAny(q, ["merhaba", "sipariş", "odeme", "ödeme", "teşekkür"])) return "tr";
  if (includesAny(q, ["halo", "terima kasih", "pesanan", "pembayaran", "beli"])) return "id";
  if (includesAny(q, ["apa khabar", "terima kasih", "pesanan", "bayaran"])) return "ms";

  return null;
}

function isLikelySylheti(query: string) {
  const q = normalize(query);
  return includesAny(q, [
    "sylheti",
    "siloti",
    "sileti",
    "syloti",
    "সিলেটি",
    "সিলটি",
    "কিতা",
    "কিতা লাগবো",
    "আছো নি",
    "তুমার",
    "হইবো নে",
    "আইজ",
    "কিতাবা",
    "অই",
  ]);
}

function detectLanguageProfile(question: string, context?: SumonixContext): LanguageProfile {
  const uiLang = sanitizeUiLanguage(context?.uiLanguage);
  if (uiLang === "bn" && isLikelySylheti(question)) {
    return { code: "syl", targetLabel: languageLabel("syl") };
  }

  if (isLikelySylheti(question)) {
    return { code: "syl", targetLabel: languageLabel("syl") };
  }

  if (hasHangulRegex.test(question)) return { code: "ko", targetLabel: languageLabel("ko") };
  if (hasHiraganaKatakanaRegex.test(question)) return { code: "ja", targetLabel: languageLabel("ja") };
  if (hasHanRegex.test(question)) return { code: "zh", targetLabel: languageLabel("zh") };
  if (hasCyrillicRegex.test(question)) return { code: "ru", targetLabel: languageLabel("ru") };
  if (hasArabicTextRegex.test(question)) return { code: "ar", targetLabel: languageLabel("ar") };
  if (hasDevanagariRegex.test(question)) return { code: "hi", targetLabel: languageLabel("hi") };
  if (hasBengaliTextRegex.test(question)) return { code: "bn", targetLabel: languageLabel("bn") };

  const latinGuess = detectFromLatinWords(question);
  if (latinGuess) return { code: latinGuess, targetLabel: languageLabel(latinGuess) };

  return { code: uiLang || "en", targetLabel: languageLabel(uiLang || "en") };
}

function stylizeSylheti(text: string) {
  const replacements: Array<[RegExp, string]> = [
    [/\bআপনি\b/g, "আপনে"],
    [/\bআপনার\b/g, "আপনারে"],
    [/\bআমি\b/g, "আমি"],
    [/\bআছি\b/g, "আছো"],
    [/\bধন্যবাদ\b/g, "অনেক ধইন্যবাদ"],
    [/\bকিছু\b/g, "কিসু"],
    [/\bকিভাবে\b/g, "কেমনে"],
    [/\bএখন\b/g, "এহন"],
    [/\bআজ\b/g, "আইজ"],
    [/\bযাবে\b/g, "যামু"],
    [/\bকরুন\b/g, "করেন"],
    [/\bপারবো\b/g, "পারমু"],
    [/\bহবে\b/g, "হইব"],
    [/\bবলুন\b/g, "কইন"],
    [/\bস্টোর\b/g, "দোকান"],
  ];

  let output = text;
  for (const [pattern, value] of replacements) {
    output = output.replace(pattern, value);
  }
  return output;
}

async function translateWithOpenAi(text: string, targetLanguage: string) {
  const apiKey = process.env.OPENAI_API_KEY?.trim();
  if (!apiKey) return null;

  const model = process.env.SUMONIX_TRANSLATION_MODEL?.trim() || "gpt-4o-mini";
  const cacheKey = `${targetLanguage}::${text}`;
  const cached = translationCache.get(cacheKey);
  if (cached) return cached;

  try {
    const response = await fetch("https://api.openai.com/v1/responses", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model,
        input: [
          {
            role: "system",
            content:
              "Translate the input into the requested language. Keep links, numbers, and product IDs unchanged. Return only translated text.",
          },
          {
            role: "user",
            content: `Target language: ${targetLanguage}\nText:\n${text}`,
          },
        ],
      }),
    });

    if (!response.ok) {
      return null;
    }

    const data = (await response.json()) as {
      output_text?: string;
      output?: Array<{
        content?: Array<{ type?: string; text?: string }>;
      }>;
    };

    const outputText =
      data.output_text ||
      data.output
        ?.flatMap((item) => item.content || [])
        .map((item) => item.text || "")
        .join("")
        .trim();

    if (!outputText) return null;
    translationCache.set(cacheKey, outputText);
    return outputText;
  } catch {
    return null;
  }
}

function toTranslationCode(code: UserLanguageCode) {
  switch (code) {
    case "bn":
    case "syl":
      return "bn";
    default:
      return code;
  }
}

async function translateWithPublicEndpoint(text: string, targetCode: string) {
  const cacheKey = `public:${targetCode}::${text}`;
  const cached = translationCache.get(cacheKey);
  if (cached) return cached;

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 4000);

  try {
    const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl=${encodeURIComponent(
      targetCode
    )}&dt=t&q=${encodeURIComponent(text)}`;
    const response = await fetch(url, {
      method: "GET",
      signal: controller.signal,
      headers: {
        "User-Agent": "Mozilla/5.0",
      },
    });

    if (!response.ok) return null;
    const data = (await response.json()) as unknown;
    if (!Array.isArray(data) || !Array.isArray(data[0])) return null;

    const translated = (data[0] as unknown[])
      .map((item) => (Array.isArray(item) ? String(item[0] || "") : ""))
      .join("")
      .trim();

    if (!translated) return null;
    translationCache.set(cacheKey, translated);
    return translated;
  } catch {
    return null;
  } finally {
    clearTimeout(timeout);
  }
}

async function localizeTextForProfile(
  text: string,
  profile: LanguageProfile
): Promise<string> {
  if (!text) return text;

  if (profile.code === "bn") {
    return text;
  }

  if (profile.code === "syl") {
    return stylizeSylheti(text);
  }

  if (profile.code === "en") {
    if (!hasBengaliTextRegex.test(text)) return text;
    const translated = await translateWithOpenAi(text, "English");
    if (translated) return translated;
    const publicTranslated = await translateWithPublicEndpoint(text, "en");
    return publicTranslated || text;
  }

  const translated = await translateWithOpenAi(text, profile.targetLabel);
  if (translated) return translated;

  const publicTranslated = await translateWithPublicEndpoint(
    text,
    toTranslationCode(profile.code)
  );
  if (publicTranslated) return publicTranslated;

  if (hasBengaliTextRegex.test(text)) {
    const englishFallback = await translateWithOpenAi(text, "English");
    if (englishFallback) return englishFallback;
    const publicEnglish = await translateWithPublicEndpoint(text, "en");
    if (publicEnglish) return publicEnglish;
  }

  return text;
}

function sanitizePath(path: string | null | undefined) {
  if (!path) return "/";
  const trimmed = path.split("?")[0]?.split("#")[0]?.trim() || "/";
  if (!trimmed) return "/";
  return trimmed.startsWith("/") ? trimmed : `/${trimmed}`;
}

function tokenize(text: string) {
  return normalize(text)
    .replace(/[^a-z0-9\u0980-\u09ff\s+/.-]+/g, " ")
    .split(/\s+/)
    .filter(Boolean);
}

function includesAny(text: string, words: string[]) {
  return words.some((word) => text.includes(word));
}

function formatCurrency(value: number) {
  return `৳${Number(value || 0).toLocaleString("en-BD")}`;
}

function isThanksQuery(query: string) {
  return includesAny(query, [
    "thanks",
    "thank you",
    "ধন্যবাদ",
    "থ্যাংকস",
    "jazak",
    "শুকরিয়া",
    "gracias",
    "merci",
    "danke",
    "شكرا",
    "धन्यवाद",
  ]);
}

function isByeQuery(query: string) {
  return includesAny(query, [
    "bye",
    "বিদায়",
    "আল্লাহ হাফেজ",
    "খোদা হাফেজ",
    "see you",
    "good night",
    "adios",
    "au revoir",
    "tschüss",
    "مع السلامة",
    "फिर मिलेंगे",
  ]);
}

function composePoliteMessage(
  question: string,
  coreMessage: string,
  mode: AssistantMode,
  profile: LanguageProfile
) {
  const query = normalize(question);
  const isBanglaStyle = profile.code === "bn" || profile.code === "syl";
  const welcomePrefix = isBanglaStyle
    ? includesAny(query, [
        "hello",
        "hi",
        "hey",
        "হাই",
        "হ্যালো",
        "আসসালামু",
        "সালাম",
      ])
      ? "স্বাগতম। "
      : "ধন্যবাদ প্রশ্ন করার জন্য। "
    : includesAny(query, ["hello", "hi", "hey", "hola", "bonjour", "merhaba"])
      ? "Welcome. "
      : "Thanks for your question. ";

  if (isThanksQuery(query)) {
    if (profile.code === "syl") {
      return mode === "admin"
        ? "অনেক ধইন্যবাদ। admin কামত লাগলে আবার কইন।"
        : "অনেক ধইন্যবাদ। shopping-এ help করতে পাইরা ভাল লাগল।";
    }

    if (!isBanglaStyle) {
      return mode === "admin"
        ? "Thanks. I am ready to help with your admin operations anytime."
        : "Thanks. Glad to help you with shopping. Ask me anything anytime.";
    }

    return mode === "admin"
      ? "অনেক ধন্যবাদ। আপনার admin কাজগুলোতে আমি পাশে আছি, আবার কিছু লাগলে বলুন।"
      : "অনেক ধন্যবাদ। আপনার শপিংয়ে সাহায্য করতে পেরে ভালো লাগলো, আবার জিজ্ঞেস করতে পারেন।";
  }

  if (isByeQuery(query)) {
    if (profile.code === "syl") {
      return mode === "admin"
        ? "ধইন্যবাদ। দরকার অইলে SUMONIX admin-রে আবার কইন।"
        : "ধইন্যবাদ। ভালা থাইকেন, দরকার অইলে আবার আইয়েন।";
    }

    if (!isBanglaStyle) {
      return mode === "admin"
        ? "Thanks. Have a great day. Reach out again for any admin task."
        : "Thanks. Take care and come back anytime. I am here to help.";
    }

    return mode === "admin"
      ? "ধন্যবাদ। আপনার দিনটি সুন্দর কাটুক, প্রয়োজন হলে আবার SUMONIX AI admin-কে বলুন।"
      : "ধন্যবাদ। ভালো থাকুন, আবার আসবেন। প্রয়োজনে আমি সাথে সাথে সাহায্য করব।";
  }

  const closeLine = (() => {
    if (profile.code === "syl") {
      return mode === "admin"
        ? "আর admin task থাকলে কইন, সাথে সাথে guide দিমু।"
        : "আর কিসু জানন লাগলে কইন, পছন্দের product দেহাই দিমু।";
    }

    if (!isBanglaStyle) {
      return mode === "admin"
        ? "If you have any admin task, I can guide you instantly."
        : "Ask me anything else and I will help you find the right products.";
    }

    return mode === "admin"
      ? "আর কোনো admin task থাকলে বলুন, আমি তাৎক্ষণিকভাবে গাইড করব।"
      : "আর কিছু জানতে চাইলে বলুন, আমি পছন্দের প্রডাক্ট খুঁজে দিতে প্রস্তুত।";
  })();

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

function uniqueCategoriesFromProducts(products: Product[]) {
  return Array.from(
    new Set(
      products
        .map((product) => (product.category || "").trim())
        .filter(Boolean)
    )
  );
}

async function getPublishedProducts() {
  if (!hasSupabasePublicConfig() || !supabase) return [] as Product[];

  let query = supabase
    .from("products")
    .select("*")
    .order("created_at", { ascending: false })
    .eq("is_published", true)
    .limit(120);

  let { data, error } = await query;
  if (error && error.message.toLowerCase().includes("is_published")) {
    const fallback = await supabase
      .from("products")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(120);
    data = fallback.data;
    error = fallback.error;
  }

  if (error) return [];
  return (data || []) as Product[];
}

function scoreProductMatch(product: Product, tokens: string[]) {
  if (tokens.length === 0) return 0;
  const haystack = normalize(
    `${product.name} ${product.category} ${(product.sizes || []).join(" ")} ${
      product.campaign_badge || ""
    }`
  );
  return tokens.reduce((score, token) => (haystack.includes(token) ? score + 1 : score), 0);
}

function findProductMatches(products: Product[], query: string) {
  const tokens = tokenize(query).filter((token) => token.length >= 2);
  if (tokens.length === 0) {
    return products.slice(0, 6);
  }

  return products
    .map((product) => ({
      product,
      score: scoreProductMatch(product, tokens),
    }))
    .filter((item) => item.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 6)
    .map((item) => item.product);
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

async function executeAdminAction(question: string, allowMutation: boolean): Promise<AdminActionResult> {
  const query = normalize(question);
  const supabaseClient = getSupabaseAdminClient();
  const actions: string[] = [];
  const previews: string[] = [];

  const status = normalizeOrderStatus(query);
  const orderIdMatch = question.match(/([a-f0-9]{8}-[a-f0-9-]{12,}|\border[-_ ]?[a-z0-9-]{4,}\b)/i);

  if (status && orderIdMatch && includesAny(query, ["order", "অর্ডার", "status", "স্ট্যাটাস"])) {
    const orderId = orderIdMatch[1].replace(/^order[-_ ]?/i, "").trim();
    const previewText = `Order ${orderId} -> status ${status}`;
    if (!allowMutation) {
      previews.push(previewText);
    } else {
      const { error } = await supabaseClient.from("orders").update({ status }).eq("id", orderId);
      if (!error) {
        actions.push(`Order ${orderId} status updated to ${status}.`);
      }
    }
  }

  const { data: products } = await supabaseClient.from("products").select("id,name").limit(300);
  const productRows = (products || []) as Array<{ id: string; name: string }>;

  const publishName = parseNameAfterKeyword(query, ["publish", "প্রকাশ", "live"]);
  if (publishName) {
    const target = productRows.find((item) => normalize(item.name).includes(normalize(publishName)));
    if (target) {
      const previewText = `Publish product "${target.name}"`;
      if (!allowMutation) {
        previews.push(previewText);
      } else {
        const { error } = await supabaseClient
          .from("products")
          .update({ is_published: true })
          .eq("id", target.id);
        if (!error) actions.push(`Product "${target.name}" published.`);
      }
    }
  }

  const draftName = parseNameAfterKeyword(query, ["draft", "ড্রাফট", "unpublish"]);
  if (draftName) {
    const target = productRows.find((item) => normalize(item.name).includes(normalize(draftName)));
    if (target) {
      const previewText = `Move product "${target.name}" to draft`;
      if (!allowMutation) {
        previews.push(previewText);
      } else {
        const { error } = await supabaseClient
          .from("products")
          .update({ is_published: false })
          .eq("id", target.id);
        if (!error) actions.push(`Product "${target.name}" moved to draft.`);
      }
    }
  }

  const featuredName = parseNameAfterKeyword(query, ["featured", "ফিচার্ড", "feature"]);
  if (featuredName) {
    const target = productRows.find((item) => normalize(item.name).includes(normalize(featuredName)));
    if (target) {
      const previewText = `Mark product "${target.name}" as featured`;
      if (!allowMutation) {
        previews.push(previewText);
      } else {
        const { error } = await supabaseClient
          .from("products")
          .update({ is_featured: true })
          .eq("id", target.id);
        if (!error) actions.push(`Product "${target.name}" marked featured.`);
      }
    }
  }

  const stockMatch = question.match(/(stock|স্টক)\s+(.+?)\s+(\d{1,5})/i);
  if (stockMatch) {
    const productName = stockMatch[2].trim();
    const quantity = Number(stockMatch[3]);
    const target = productRows.find((item) => normalize(item.name).includes(normalize(productName)));

    if (target && Number.isFinite(quantity) && quantity >= 0) {
      const previewText = `Set product "${target.name}" stock to ${quantity}`;
      if (!allowMutation) {
        previews.push(previewText);
      } else {
        const { error } = await supabaseClient
          .from("products")
          .update({ stock_quantity: quantity })
          .eq("id", target.id);
        if (!error) actions.push(`Product "${target.name}" stock set to ${quantity}.`);
      }
    }
  }

  return { actions, previews };
}

function buildStoreReply(settings: StoreSettings | null) {
  if (!settings) {
    return "স্টোর তথ্য এখন পাওয়া যাচ্ছে না। কিছুক্ষণ পরে আবার চেষ্টা করুন।";
  }

  return `স্টোর: ${settings.store_name}. স্লোগান: ${settings.slogan || "N/A"}. ঠিকানা: ${
    settings.address || "N/A"
  }. ফোন: ${settings.contact_phone || "N/A"}. WhatsApp: ${
    settings.whatsapp_number || "N/A"
  }.`;
}

function getPublicKnowledgeEntries(ctx: PublicKnowledgeContext): PublicKnowledgeEntry[] {
  const categoriesText =
    ctx.categories.length > 0
      ? ctx.categories.slice(0, 12).join(", ")
      : "এই মুহূর্তে category list পাওয়া যায়নি";

  return [
    {
      id: "website-overview",
      keywords: ["website", "ওয়েবসাইট", "site", "সাইট", "কি কি আছে", "কী কী আছে", "feature", "ফিচার", "পেজ"],
      pathHints: ["/"],
      reply: () =>
        "ওয়েবসাইটের গুরুত্বপূর্ণ সেকশনগুলো: [Home](/), [Categories](/categories), [Search](/search), [Offers](/offers), [Wishlist](/wishlist), [Cart](/cart), [Checkout](/checkout), [Profile](/profile), [Profile Orders](/profile/orders), [Size Guide](/size-guide), [Help](/help), [Settings](/settings), [Facebook](/fb)।",
    },
    {
      id: "categories",
      keywords: ["category", "categories", "ক্যাটাগরি", "ক্যাটেগরি", "collection", "collections", "ধরন"],
      pathHints: ["/categories", "/search"],
      reply: () =>
        `Available category: ${categoriesText}. দ্রুত ফিল্টার করতে [Categories](/categories) বা [Search](/search) ব্যবহার করুন।`,
    },
    {
      id: "search-filter",
      keywords: ["search", "find", "খুঁজে", "খুঁজবো", "filter", "ফিল্টার", "size filter", "color", "fabric"],
      pathHints: ["/search", "/"],
      reply: () =>
        "আপনি [Search](/search) পেজে category, size, color/fabric এবং sort ব্যবহার করে খুব দ্রুত প্রডাক্ট খুঁজে নিতে পারবেন।",
    },
    {
      id: "wishlist-cart",
      keywords: ["wishlist", "wish list", "পছন্দ", "কার্ট", "cart", "add to cart", "save later"],
      pathHints: ["/wishlist", "/cart"],
      reply: () =>
        "পরে কেনার জন্য [Wishlist](/wishlist) ব্যবহার করুন, আর অর্ডারের আগে [Cart](/cart)-এ quantity/size চেক করে তারপর [Checkout](/checkout)-এ যান।",
    },
    {
      id: "checkout-payment",
      keywords: ["checkout", "অর্ডার", "order", "buy", "কিভাবে অর্ডার", "payment", "পেমেন্ট", "bkash", "nagad", "cod", "cash on delivery"],
      pathHints: ["/checkout", "/cart"],
      reply: () =>
        "অর্ডার ফ্লো: [Cart](/cart) -> [Checkout](/checkout) -> customer info + address -> payment method (bKash/Nagad/Cash on Delivery) -> Place Order।",
    },
    {
      id: "delivery-courier",
      keywords: ["delivery", "ডেলিভারি", "courier", "কুরিয়ার", "upazila", "উপজেলা", "district", "জেলা", "shipping"],
      pathHints: ["/checkout", "/help"],
      reply: () =>
        "Checkout-এ delivery method ও courier নির্বাচন করা যায়। Home Delivery, Pickup এবং courier options আছে; উপজেলা/জেলা অনুযায়ী address দিয়ে order করা যায়।",
    },
    {
      id: "size-guide-exchange",
      keywords: ["size", "সাইজ", "fit", "exchange", "এক্সচেঞ্জ", "return", "রিটার্ন", "measurement"],
      pathHints: ["/size-guide", "/help"],
      reply: () =>
        "সাইজ/ফিট জানতে [Size Guide](/size-guide) দেখুন। কোন কনফিউশন থাকলে [Help](/help) থেকে WhatsApp support নিলে দ্রুত size guidance পাবেন।",
    },
    {
      id: "profile-orders",
      keywords: ["order status", "track", "tracking", "স্ট্যাটাস", "অর্ডার স্ট্যাটাস", "আমার অর্ডার", "profile"],
      pathHints: ["/profile", "/profile/orders", "/order-success"],
      reply: () =>
        "অর্ডার সম্পর্কিত তথ্য দেখতে [Profile](/profile) এবং [My Orders](/profile/orders) পেজ ব্যবহার করুন। অর্ডার সফল হলে [Order Success](/order-success) পেজও দেখাবে।",
    },
    {
      id: "contact-help",
      keywords: ["help", "support", "সহায়তা", "যোগাযোগ", "contact", "phone", "whatsapp", "address"],
      pathHints: ["/help", "/settings"],
      reply: (knowledgeCtx) =>
        `${buildStoreReply(knowledgeCtx.settings)} দ্রুত সহায়তার জন্য [Help](/help) পেজ থেকে WhatsApp flow ব্যবহার করুন।`,
    },
    {
      id: "settings-language-theme",
      keywords: ["language", "ভাষা", "theme", "dark", "light", "mode", "settings", "পছন্দ", "preference"],
      pathHints: ["/settings"],
      reply: () =>
        "ভাষা, ডার্ক/লাইট থিম, contrast, text size পরিবর্তনের জন্য [Settings](/settings) পেজ বা top preference controls ব্যবহার করুন।",
    },
    {
      id: "offers",
      keywords: ["offer", "offers", "discount", "sale", "অফার", "ডিসকাউন্ট", "deal"],
      pathHints: ["/offers", "/"],
      reply: () =>
        "চলতি offer দেখতে [Offers](/offers) পেজ দেখুন, আর featured/campaign items আমি chat-এও সাজেস্ট করতে পারি।",
    },
    {
      id: "facebook",
      keywords: ["facebook", "fb", "page", "ফেসবুক", "social"],
      pathHints: ["/fb"],
      reply: () => "Facebook presence দেখতে [Facebook](/fb) পেজে যান।",
    },
  ];
}

function scoreKnowledgeEntry(
  entry: PublicKnowledgeEntry,
  normalizedQuery: string,
  queryTokens: string[],
  contextPath: string
) {
  let score = 0;

  entry.keywords.forEach((keyword) => {
    if (normalizedQuery.includes(keyword)) {
      score += keyword.includes(" ") ? 3 : 2;
    }
  });

  if (queryTokens.length > 0) {
    queryTokens.forEach((token) => {
      if (token.length >= 3 && entry.keywords.some((keyword) => keyword.includes(token))) {
        score += 1;
      }
    });
  }

  if (entry.pathHints?.some((path) => contextPath.startsWith(path))) {
    score += 1;
  }

  return score;
}

function resolveKnowledgeReply(ctx: PublicKnowledgeContext, query: string) {
  const normalizedQuery = normalize(query);
  const tokens = tokenize(query);
  const entries = getPublicKnowledgeEntries(ctx);

  const ranked = entries
    .map((entry) => ({
      entry,
      score: scoreKnowledgeEntry(entry, normalizedQuery, tokens, ctx.contextPath),
    }))
    .filter((item) => item.score > 0)
    .sort((a, b) => b.score - a.score);

  if (ranked.length === 0) return null;
  if (ranked[0].score < 2) return null;

  return ranked[0].entry.reply(ctx);
}

export async function getPublicSumonixReply(
  question: string,
  context?: SumonixContext
): Promise<AssistantReply> {
  const query = normalize(question);
  const contextPath = sanitizePath(context?.contextPath);
  const languageProfile = detectLanguageProfile(question, context);
  const [settings, products, categoryRows] = await Promise.all([
    getStoreSettings(),
    getPublishedProducts(),
    getCategories(),
  ]);
  const categories = categoryRows.length > 0 ? categoryRows : uniqueCategoriesFromProducts(products);
  const knowledgeContext: PublicKnowledgeContext = {
    settings,
    categories,
    products,
    contextPath,
  };

  const respond = async (
    coreMessage: string,
    extras: Omit<AssistantReply, "message"> = {}
  ): Promise<AssistantReply> => {
    const baseMessage = composePoliteMessage(question, coreMessage, "public", languageProfile);
    const message = await localizeTextForProfile(baseMessage, languageProfile);
    const actions = extras.actions
      ? await Promise.all(extras.actions.map((item) => localizeTextForProfile(item, languageProfile)))
      : undefined;

    return {
      message,
      ...extras,
      ...(actions ? { actions } : {}),
    };
  };

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
      "আমি SUMONIX AI। আপনার পুরো ওয়েবসাইটে product discovery, checkout flow, payment, delivery, language/theme settings, help/support নিয়ে গাইড করতে পারি।",
      {
        products: products.slice(0, 4).map(productToSuggestion),
      }
    );
  }

  if (includesAny(query, ["ঠিকানা", "address", "phone", "যোগাযোগ", "contact", "whatsapp", "bkash", "payment", "পেমেন্ট"])) {
    return respond(`${buildStoreReply(settings)} পেমেন্ট: bKash, Nagad এবং Cash on Delivery সাপোর্ট করে।`);
  }

  if (includesAny(query, ["courier", "কুরিয়ার", "delivery", "ডেলিভারি", "cash on delivery", "cod"])) {
    return respond(
      "Checkout-এ Home Delivery, Pickup, এবং courier নির্বাচন আছে। Payment হিসেবে bKash, Nagad, এবং Cash on Delivery সাপোর্ট করে।"
    );
  }

  if (includesAny(query, ["কিভাবে অর্ডার", "how to order", "order process", "অর্ডার করতে", "buy process"])) {
    return respond(
      "অর্ডার ধাপ: 1) [Home](/) বা [Search](/search) থেকে product দেখুন, 2) [Product] page থেকে Add to Cart, 3) [Cart](/cart) এ size/quantity যাচাই, 4) [Checkout](/checkout) এ নাম-ফোন-ঠিকানা দিন, 5) payment method (bKash/Nagad/COD) বেছে Place Order করুন।"
    );
  }

  if (includesAny(query, ["কিভাবে পেমেন্ট", "payment কিভাবে", "trx", "transaction", "বিকাশ", "নগদ"])) {
    return respond(
      "Payment options: bKash, Nagad, Cash on Delivery। bKash/Nagad হলে valid Transaction ID দিন; COD হলে checkout-এ Cash on Delivery বাছুন। সমস্যা হলে [Help](/help) থেকে WhatsApp support নিন।"
    );
  }

  if (includesAny(query, ["আটকে", "stuck", "পারছি না", "হচ্ছে না", "সমস্যা", "error", "problem", "not working"])) {
    return respond(
      "আপনি যেখানেই আটকে যান, এই quick fix follow করুন: 1) page refresh, 2) cart/update পুনরায় দিন, 3) [Checkout](/checkout) info ঠিক করে submit করুন, 4) payment field/TRX format যাচাই করুন। তবুও সমস্যা হলে [Help](/help) থেকে WhatsApp-এ লিখুন, টিম দ্রুত guide করবে।"
    );
  }

  if (includesAny(query, ["সুবিধা", "benefit", "advantage", "কেন কিনবো", "why buy", "বিশেষত্ব"])) {
    return respond(
      "সাইটের সুবিধা: fast product discovery, wishlist/cart, multiple payment (bKash/Nagad/COD), courier/home delivery, size guidance, WhatsApp support, language/theme preferences, এবং secure order validation।"
    );
  }

  if (includesAny(query, ["কত প্রডাক্ট", "how many products", "মোট প্রডাক্ট", "সব প্রডাক্ট"])) {
    return respond(
      `এখন প্রকাশিত প্রডাক্ট আছে ${products.length} টি। চাইলে category, budget বা নাম অনুযায়ী সাজেস্ট করতে পারি।`,
      {
        products: products.slice(0, 4).map(productToSuggestion),
      }
    );
  }

  if (includesAny(query, ["category", "categories", "ক্যাটাগরি", "ক্যাটেগরি", "collection"])) {
    const summary = categories.length > 0 ? categories.slice(0, 12).join(", ") : "কোন category list পাওয়া যায়নি";
    return respond(`বর্তমান category: ${summary}. বিস্তারিত দেখতে [Categories](/categories) অথবা [Search](/search) ব্যবহার করুন।`, {
      products: products.slice(0, 6).map(productToSuggestion),
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

  if (includesAny(query, ["track", "tracking", "status", "অর্ডার স্ট্যাটাস", "আমার অর্ডার"])) {
    return respond(
      "অর্ডারের অবস্থা দেখতে [Profile](/profile) এবং [My Orders](/profile/orders) পেজে যান। অর্ডার করার পর success পেজেও basic info থাকে।"
    );
  }

  const knowledgeReply = resolveKnowledgeReply(knowledgeContext, query);
  if (knowledgeReply) {
    return respond(knowledgeReply, {
      products: products.slice(0, 3).map(productToSuggestion),
    });
  }

  return respond(
    `${getOutOfScopeMessage()} সাইটের ফিচার জানতে [Home](/), [Search](/search), [Categories](/categories), [Help](/help) এবং [Settings](/settings) দেখুন।`,
    {
      products: products.slice(0, 3).map(productToSuggestion),
    }
  );
}

function safeNumber(value: unknown, fallback = 0) {
  const numeric = Number(value);
  return Number.isFinite(numeric) ? numeric : fallback;
}

function getDayKeyInDhaka(value: string | number | Date) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";

  const formatter = new Intl.DateTimeFormat("en-CA", {
    timeZone: DHAKA_TZ,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });
  const parts = formatter.formatToParts(date);
  const year = parts.find((part) => part.type === "year")?.value || "0000";
  const month = parts.find((part) => part.type === "month")?.value || "01";
  const day = parts.find((part) => part.type === "day")?.value || "01";
  return `${year}-${month}-${day}`;
}

function getRecentDayKeys(days: number) {
  const safeDays = Math.max(1, days);
  const keys: string[] = [];
  for (let i = safeDays - 1; i >= 0; i -= 1) {
    keys.push(getDayKeyInDhaka(Date.now() - i * DAY_MS));
  }
  return keys;
}

function computePercentDelta(current: number, previous: number) {
  if (previous === 0) return current > 0 ? 100 : 0;
  return ((current - previous) / previous) * 100;
}

function formatSignedPercent(value: number) {
  const rounded = Math.round(value * 10) / 10;
  if (rounded > 0) return `+${rounded}%`;
  return `${rounded}%`;
}

function detectRangeDaysFromQuery(query: string) {
  if (includesAny(query, ["today", "আজ", "আজকে"])) return 1;
  if (includesAny(query, ["last 30", "30d", "৩০ দিন", "month", "মাস"])) return 30;
  if (includesAny(query, ["last 14", "14d", "১৪ দিন", "two week", "দুই সপ্তাহ"])) return 14;
  if (includesAny(query, ["last 7", "7d", "৭ দিন", "week", "সপ্তাহ"])) return 7;

  const dayMatch = query.match(/(\d{1,2})\s*(day|days|দিন)/i);
  if (dayMatch) {
    const parsed = Number(dayMatch[1]);
    if (Number.isFinite(parsed)) {
      return Math.max(1, Math.min(parsed, 60));
    }
  }

  return 7;
}

function normalizeTrafficPath(path: string) {
  const cleaned = sanitizePath(path || "/");
  if (/^\/product\/[^/]+/i.test(cleaned)) return "/product/*";
  return cleaned;
}

function parseProductIdFromPath(path: string) {
  const cleaned = sanitizePath(path || "/");
  const match = cleaned.match(/^\/product\/([^/]+)/i);
  if (!match) return "";
  return decodeURIComponent(match[1] || "").trim();
}

function formatRangeLabel(days: number) {
  if (days <= 1) return "আজ";
  return `গত ${days} দিন`;
}

function pushUnique(list: string[], value: string) {
  if (!value) return;
  if (!list.includes(value)) list.push(value);
}

function resolveConfidence(series: number[]): "low" | "medium" | "high" {
  const filtered = series.filter((value) => Number.isFinite(value));
  if (filtered.length === 0) return "low";

  const activeCount = filtered.filter((value) => value > 0).length;
  const mean = filtered.reduce((sum, value) => sum + value, 0) / filtered.length;
  if (mean <= 0) return "low";

  const variance =
    filtered.reduce((sum, value) => sum + (value - mean) ** 2, 0) / filtered.length;
  const stdev = Math.sqrt(variance);
  const coeff = stdev / mean;

  if (activeCount >= 10 && coeff <= 0.6) return "high";
  if (activeCount >= 6) return "medium";
  return "low";
}

function buildForecast(series: number[]) {
  if (series.length === 0) {
    return {
      tomorrow: 0,
      next7: 0,
      confidence: "low" as const,
    };
  }

  const window = Math.max(1, Math.min(3, series.length));
  const lastSlice = series.slice(-window);
  const lastAvg = lastSlice.reduce((sum, value) => sum + value, 0) / window;
  const prevSlice = series.slice(-(window * 2), -window);
  const prevAvg =
    prevSlice.length > 0
      ? prevSlice.reduce((sum, value) => sum + value, 0) / prevSlice.length
      : lastAvg;

  const trend = lastAvg - prevAvg;
  const tomorrow = Math.max(0, lastAvg + trend * 0.35);
  const next7 = tomorrow * 7;
  const confidence = resolveConfidence(series);

  return {
    tomorrow,
    next7,
    confidence,
  };
}

function mergeConfidence(
  left: "low" | "medium" | "high",
  right: "low" | "medium" | "high"
): "low" | "medium" | "high" {
  const rank = { low: 1, medium: 2, high: 3 } as const;
  return rank[left] <= rank[right] ? left : right;
}

async function getOrderItemsSafe(supabaseClient: ReturnType<typeof getSupabaseAdminClient>) {
  try {
    const { data, error } = await supabaseClient
      .from("order_items")
      .select("order_id,product_id,quantity,line_total,created_at")
      .order("created_at", { ascending: false })
      .limit(8000);

    if (error) return [] as OrderItemRecord[];
    return (data || []) as OrderItemRecord[];
  } catch {
    return [] as OrderItemRecord[];
  }
}

type PageVisitRecord = {
  visitor_id: string;
  path: string;
  source: string;
  country: string;
  created_at: string;
};

async function getPageVisitsSafe(
  supabaseClient: ReturnType<typeof getSupabaseAdminClient>,
  days = 7
) {
  try {
    const sinceIso = new Date(Date.now() - Math.max(1, days) * DAY_MS).toISOString();
    const { data, error } = await supabaseClient
      .from("page_visits")
      .select("visitor_id,path,source,country,created_at")
      .gte("created_at", sinceIso)
      .order("created_at", { ascending: true })
      .limit(10000);

    if (error) return [] as PageVisitRecord[];
    return (data || []) as PageVisitRecord[];
  } catch {
    return [] as PageVisitRecord[];
  }
}

function buildAdminAnalyticsSnapshot(params: {
  query: string;
  products: Product[];
  orders: Order[];
  orderItems: OrderItemRecord[];
  traffic: TrafficSnapshot;
  pageVisits: PageVisitRecord[];
}): AdminAnalyticsSnapshot {
  const { query, products, orders, orderItems, traffic, pageVisits } = params;
  const now = Date.now();
  const reportDate = getDayKeyInDhaka(now);
  const yesterdayKey = getDayKeyInDhaka(now - DAY_MS);
  const focusRangeDays = detectRangeDaysFromQuery(query);
  const focusCutoff = now - focusRangeDays * DAY_MS;
  const last14Cutoff = now - 14 * DAY_MS;
  const last5Cutoff = now - 5 * DAY_MS;

  const orderMeta = new Map<
    string,
    { status: string; createdAt: number; dayKey: string; total: number }
  >();

  let todaySales = 0;
  let todayOrders = 0;
  let todayCompleted = 0;
  let focusSales = 0;
  let focusOrders = 0;
  let focusCompleted = 0;
  let focusPending = 0;
  let totalSalesAll = 0;
  let pendingAll = 0;
  let processingAll = 0;
  let shippedAll = 0;
  let completedAll = 0;
  let returnedAll = 0;
  let cancelledAll = 0;

  for (const order of orders) {
    const status = normalize(String(order.status || ""));
    const totalAmount = safeNumber(order.total_amount);
    totalSalesAll += totalAmount;

    if (status === "pending") pendingAll += 1;
    if (status === "processing") processingAll += 1;
    if (status === "shipped") shippedAll += 1;
    if (SUCCESS_STATUSES.has(status)) completedAll += 1;
    if (status === "returned") returnedAll += 1;
    if (status === "cancelled") cancelledAll += 1;

    const createdAt = new Date(order.created_at || "").getTime();
    const hasValidTime = Number.isFinite(createdAt);
    const dayKey = hasValidTime ? getDayKeyInDhaka(createdAt) : "";

    if (hasValidTime && dayKey === reportDate) {
      todayOrders += 1;
      todaySales += totalAmount;
      if (SUCCESS_STATUSES.has(status)) todayCompleted += 1;
    }

    if (hasValidTime && createdAt >= focusCutoff) {
      focusOrders += 1;
      if (status !== "cancelled") focusSales += totalAmount;
      if (SUCCESS_STATUSES.has(status)) focusCompleted += 1;
      if (OPEN_STATUSES.has(status)) focusPending += 1;
    }

    if (order.id && hasValidTime) {
      orderMeta.set(String(order.id), {
        status,
        createdAt,
        dayKey,
        total: totalAmount,
      });
    }
  }

  const productById = new Map(products.map((item) => [item.id, item]));
  const soldByProduct = new Map<
    string,
    { qty: number; amount: number; qtyLast14: number; qtyLast5: number }
  >();

  for (const item of orderItems) {
    const productId = String(item.product_id || "").trim();
    if (!productId) continue;

    const order = orderMeta.get(String(item.order_id || "").trim());
    if (!order || !SUCCESS_STATUSES.has(order.status)) continue;

    const qty = safeNumber(item.quantity);
    if (qty <= 0) continue;

    const existing = soldByProduct.get(productId) || {
      qty: 0,
      amount: 0,
      qtyLast14: 0,
      qtyLast5: 0,
    };
    existing.qty += qty;

    const product = productById.get(productId);
    const lineTotal = safeNumber(item.line_total);
    existing.amount += lineTotal > 0 ? lineTotal : qty * safeNumber(product?.price);

    if (order.createdAt >= last14Cutoff) existing.qtyLast14 += qty;
    if (order.createdAt >= last5Cutoff) existing.qtyLast5 += qty;

    soldByProduct.set(productId, existing);
  }

  const performanceRows: ProductPerformance[] = products.map((product) => {
    const sold = soldByProduct.get(product.id) || {
      qty: 0,
      amount: 0,
      qtyLast14: 0,
      qtyLast5: 0,
    };
    const velocityPerDay = sold.qtyLast14 / 14;
    const stock = safeNumber(product.stock_quantity, 20);
    const daysToStockout = velocityPerDay > 0 ? stock / velocityPerDay : null;
    const reorderPoint = Math.max(5, Math.ceil(velocityPerDay * 7));
    const targetStock = Math.max(10, Math.ceil(velocityPerDay * 21));
    let recommendedRestock = stock < reorderPoint ? Math.max(1, targetStock - stock) : 0;
    if (stock <= 2 && recommendedRestock === 0) {
      recommendedRestock = Math.max(1, 8 - stock);
    }

    return {
      product,
      soldQty: sold.qty,
      soldAmount: sold.amount,
      soldQtyLast14: sold.qtyLast14,
      velocityPerDay,
      stock,
      daysToStockout,
      recommendedRestock,
    };
  });

  const topSelling = performanceRows
    .filter((item) => item.soldQty > 0)
    .sort((a, b) => {
      if (b.soldQty !== a.soldQty) return b.soldQty - a.soldQty;
      return b.soldAmount - a.soldAmount;
    })
    .slice(0, 6);

  const stockAlerts = performanceRows
    .filter(
      (item) =>
        item.stock <= 5 ||
        item.recommendedRestock > 0 ||
        (item.daysToStockout !== null && item.daysToStockout <= 10)
    )
    .sort((a, b) => {
      const daysA = a.daysToStockout === null ? 9999 : a.daysToStockout;
      const daysB = b.daysToStockout === null ? 9999 : b.daysToStockout;
      if (daysA !== daysB) return daysA - daysB;
      if (a.stock !== b.stock) return a.stock - b.stock;
      return b.soldQty - a.soldQty;
    })
    .slice(0, 6);

  const trafficDayMap = new Map<string, number>();
  for (const item of traffic.dailyVisits || []) {
    trafficDayMap.set(item.date, safeNumber(item.count));
  }
  const visitsToday = trafficDayMap.get(reportDate) || 0;
  const visitsYesterday = trafficDayMap.get(yesterdayKey) || 0;
  const visitsDeltaPct = computePercentDelta(visitsToday, visitsYesterday);

  const dayKeys14 = getRecentDayKeys(14);
  const salesByDay = new Map<string, number>(dayKeys14.map((key) => [key, 0]));
  for (const order of orderMeta.values()) {
    if (!salesByDay.has(order.dayKey)) continue;
    if (order.status === "cancelled") continue;
    salesByDay.set(order.dayKey, (salesByDay.get(order.dayKey) || 0) + order.total);
  }
  const salesSeries = dayKeys14.map((key) => salesByDay.get(key) || 0);
  const visitSeries = dayKeys14.map((key) => trafficDayMap.get(key) || 0);
  const salesForecast = buildForecast(salesSeries);
  const visitForecast = buildForecast(visitSeries);

  const recentVisits5 = pageVisits.filter((visit) => {
    const ts = new Date(visit.created_at).getTime();
    return Number.isFinite(ts) && ts >= last5Cutoff;
  });

  const interestByProduct = new Map<string, { visits: number; visitors: Set<string> }>();
  for (const visit of recentVisits5) {
    const productId = parseProductIdFromPath(visit.path);
    if (!productId) continue;
    const existing = interestByProduct.get(productId) || {
      visits: 0,
      visitors: new Set<string>(),
    };
    existing.visits += 1;
    if (visit.visitor_id) existing.visitors.add(visit.visitor_id);
    interestByProduct.set(productId, existing);
  }

  const demandSignals = Array.from(interestByProduct.entries())
    .map(([productId, value]) => {
      const product = productById.get(productId);
      if (!product) return null;
      const soldQtyLast5 = soldByProduct.get(productId)?.qtyLast5 || 0;
      const uniqueVisitors = value.visitors.size;
      const conversionGap = Math.max(0, uniqueVisitors - soldQtyLast5);
      return {
        product,
        productId,
        visitCount: value.visits,
        uniqueVisitors,
        soldQtyLast5,
        conversionGap,
      };
    })
    .filter((item): item is NonNullable<typeof item> => Boolean(item))
    .filter((item) => item.uniqueVisitors >= 2 && (item.conversionGap > 0 || item.visitCount >= 4))
    .sort((a, b) => {
      if (b.conversionGap !== a.conversionGap) return b.conversionGap - a.conversionGap;
      return b.visitCount - a.visitCount;
    })
    .slice(0, 6);

  const pageVisitsCount = new Map<string, number>();
  const pageExitsCount = new Map<string, number>();
  const visitsByVisitor = new Map<string, Array<{ path: string; at: number }>>();

  for (const visit of recentVisits5) {
    const at = new Date(visit.created_at).getTime();
    if (!Number.isFinite(at)) continue;
    const visitorId = String(visit.visitor_id || "").trim();
    if (!visitorId) continue;
    const bucket = visitsByVisitor.get(visitorId) || [];
    bucket.push({
      path: normalizeTrafficPath(visit.path || "/"),
      at,
    });
    visitsByVisitor.set(visitorId, bucket);
  }

  for (const records of visitsByVisitor.values()) {
    records.sort((a, b) => a.at - b.at);
    for (const event of records) {
      pageVisitsCount.set(event.path, (pageVisitsCount.get(event.path) || 0) + 1);
    }
    const lastPath = records[records.length - 1]?.path;
    if (lastPath) {
      pageExitsCount.set(lastPath, (pageExitsCount.get(lastPath) || 0) + 1);
    }
  }

  const dropOffPages = Array.from(pageVisitsCount.entries())
    .map(([path, visits]) => {
      const exits = pageExitsCount.get(path) || 0;
      const exitRate = visits > 0 ? exits / visits : 0;
      return {
        path,
        visits,
        exits,
        exitRate,
      };
    })
    .filter((item) => item.visits >= 3)
    .sort((a, b) => {
      if (b.exitRate !== a.exitRate) return b.exitRate - a.exitRate;
      return b.visits - a.visits;
    })
    .slice(0, 6);

  const issueFlags: string[] = [];
  const suggestions: string[] = [];

  if (focusPending >= 5) {
    pushUnique(issueFlags, `⏳ ${formatRangeLabel(focusRangeDays)} open order বেশি (${focusPending})`);
    pushUnique(suggestions, "Pending/Processing অর্ডারে SLA tag সেট করে 2-4 ঘন্টার মধ্যে first response দিন।");
  }

  if (visitsDeltaPct <= -15) {
    pushUnique(issueFlags, `📉 আজ visitor গতকালের তুলনায় কমেছে (${formatSignedPercent(visitsDeltaPct)})`);
    pushUnique(suggestions, "Top source campaign/creative refresh করে Home ও Offers page CTA আরও স্পষ্ট করুন।");
  }

  const checkoutDrop = dropOffPages.find((item) => item.path === "/checkout");
  if (checkoutDrop && checkoutDrop.exitRate >= 0.4) {
    pushUnique(
      issueFlags,
      `🛑 Checkout drop-off বেশি (${Math.round(checkoutDrop.exitRate * 100)}%)`
    );
    pushUnique(
      suggestions,
      "Checkout form ছোট করুন, payment instruction (bKash/Nagad/COD) first fold-এ দিন, এবং trust badge স্পষ্ট করুন।"
    );
  }

  const productDrop = dropOffPages.find((item) => item.path === "/product/*");
  if (productDrop && productDrop.exitRate >= 0.45) {
    pushUnique(
      issueFlags,
      `👕 Product page exit rate বেশি (${Math.round(productDrop.exitRate * 100)}%)`
    );
    pushUnique(
      suggestions,
      "Product page-এ size guide, stock urgency, fabric details, এবং clear Add to Cart CTA উপরে রাখুন।"
    );
  }

  if (demandSignals.length > 0) {
    const topDemand = demandSignals[0];
    pushUnique(
      issueFlags,
      `🔥 গত ৫ দিনে "${topDemand.product.name}"-এ উচ্চ আগ্রহ, কিন্তু sales gap আছে`
    );
    pushUnique(
      suggestions,
      "High-intent product-এ limited-time offer, size availability note, এবং fast checkout link যোগ করুন।"
    );
  }

  const searchDrop = dropOffPages.find(
    (item) => item.path === "/search" || item.path === "/categories"
  );
  if (searchDrop && searchDrop.exitRate >= 0.4) {
    pushUnique(
      suggestions,
      "Search/Categories এ no-result fallback card এবং best-seller suggestions দেখান যাতে user সাইটে থাকে।"
    );
  }

  if (issueFlags.length === 0) {
    pushUnique(issueFlags, "✅ বড় কোনো critical issue detect হয়নি, তবে continuous optimization দরকার।");
  }

  if (suggestions.length === 0) {
    pushUnique(suggestions, "Traffic source অনুযায়ী landing page copy match করে A/B test চালান।");
  }

  return {
    reportDate,
    focusRangeDays,
    focusSales,
    focusOrders,
    focusCompleted,
    focusPending,
    todaySales,
    todayOrders,
    todayCompleted,
    pendingAll,
    processingAll,
    shippedAll,
    completedAll,
    returnedAll,
    cancelledAll,
    totalSalesAll,
    topSelling,
    stockAlerts,
    demandSignals,
    dropOffPages,
    issueFlags,
    suggestions,
    traffic: {
      ...traffic,
      visitsToday,
      visitsYesterday,
      visitsDeltaPct,
    },
    forecast: {
      salesTomorrow: salesForecast.tomorrow,
      salesNext7: salesForecast.next7,
      visitsTomorrow: visitForecast.tomorrow,
      visitsNext7: visitForecast.next7,
      confidence: mergeConfidence(salesForecast.confidence, visitForecast.confidence),
    },
  };
}

function formatTopSellingLine(item: ProductPerformance, index: number) {
  return `${index + 1}) ${item.product.name} - qty ${item.soldQty}, sales ${formatCurrency(
    item.soldAmount
  )}`;
}

function formatStockAlertLine(item: ProductPerformance, index: number) {
  const daysText =
    item.daysToStockout === null ? "demand low" : `~${Math.max(1, Math.round(item.daysToStockout))} দিন`;
  return `${index + 1}) ${item.product.name} - stock ${item.stock}, velocity ${item.velocityPerDay.toFixed(
    2
  )}/day, risk ${daysText}, restock +${item.recommendedRestock}`;
}

function formatDemandSignalLine(
  item: AdminAnalyticsSnapshot["demandSignals"][number],
  index: number
) {
  return `${index + 1}) ${item.product.name} - গত ৫ দিনে view ${item.visitCount}, interested visitor ${
    item.uniqueVisitors
  }, sold ${item.soldQtyLast5}`;
}

function formatDropOffLine(item: AdminAnalyticsSnapshot["dropOffPages"][number], index: number) {
  return `${index + 1}) ${item.path} - visits ${item.visits}, exit ${item.exits} (${Math.round(
    item.exitRate * 100
  )}%)`;
}

export async function getAdminSumonixReply(
  question: string,
  context?: SumonixContext
): Promise<AssistantReply> {
  const query = normalize(question);
  const languageProfile = detectLanguageProfile(question, context);
  const allowMutation = includesAny(query, ["confirm", "execute", "run now", "নিশ্চিত", "কনফার্ম"]);
  const actionQuestion = allowMutation
    ? question.replace(/^\s*(confirm|execute)\s*[:\-]?\s*/i, "")
    : question;
  const actionResult = await executeAdminAction(actionQuestion, allowMutation);
  const actions = actionResult.actions;
  const previews = actionResult.previews;
  const supabaseClient = getSupabaseAdminClient();
  const currentPath = sanitizePath(context?.contextPath);
  const [settings, productsResult, ordersResult, orderItems, traffic, pageVisits] =
    await Promise.all([
      getStoreSettings(),
      supabaseClient.from("products").select("*"),
      supabaseClient.from("orders").select("*"),
      getOrderItemsSafe(supabaseClient),
      getTrafficSnapshotFromDb(30, 14),
      getPageVisitsSafe(supabaseClient, 7),
  ]);

  const productRows = (productsResult.data || []) as Product[];
  const orderRows = (ordersResult.data || []) as Order[];
  const analytics = buildAdminAnalyticsSnapshot({
    query,
    products: productRows,
    orders: orderRows,
    orderItems,
    traffic,
    pageVisits,
  });
  const featured = productRows.filter((item) => item.is_featured).length;
  const drafts = productRows.filter((item) => item.is_published === false).length;

  const respond = async (
    coreMessage: string,
    extras: Omit<AssistantReply, "message"> = {}
  ): Promise<AssistantReply> => {
    const baseMessage = composePoliteMessage(question, coreMessage, "admin", languageProfile);
    const message = await localizeTextForProfile(baseMessage, languageProfile);
    const actions = extras.actions
      ? await Promise.all(extras.actions.map((item) => localizeTextForProfile(item, languageProfile)))
      : undefined;

    return {
      message,
      ...extras,
      ...(actions ? { actions } : {}),
    };
  };

  if (isThanksQuery(query) || isByeQuery(query)) {
    return respond("আপনার বার্তাটি পেয়েছি।");
  }

  if (!allowMutation && previews.length > 0) {
    return respond(
      `আমি ${previews.length}টি admin action detect করেছি, accidental update এড়াতে আগে confirm দরকার। "confirm ..." লিখে আবার পাঠান।`,
      {
        actions: previews.map((item) => `Preview: ${item}`),
        products: productRows.slice(0, 5).map(productToSuggestion),
      }
    );
  }

  if (actions.length > 0) {
    return respond(`Action completed: ${actions.join(" ")}`, {
      actions,
      products: productRows.slice(0, 5).map(productToSuggestion),
    });
  }

  if (includesAny(query, ["where", "কোথায়", "navigate", "page", "menu", "location"])) {
    return respond(
      `Admin quick links: [Dashboard](/admin), [Orders](/admin/orders), [Products](/admin/products), [Settings](/admin/settings)। Current panel: ${currentPath}.`
    );
  }

  if (includesAny(query, ["notification", "নোটিফিকেশন", "problem", "সমস্যা", "issue", "drop", "চলে যাচ্ছে", "retain", "থাকবে"])) {
    const issueLines = analytics.issueFlags.map((item) => `Issue: ${item}`);
    const suggestionLines = analytics.suggestions.map((item) => `Fix: ${item}`);
    const dropLines = analytics.dropOffPages.slice(0, 3).map((item, index) => formatDropOffLine(item, index));

    return respond(
      `Issue scan (${analytics.reportDate}) complete. ${issueLines[0] || "No major issue"}. সবচেয়ে বেশি drop-off: ${dropLines[0] || "No strong drop-off signal"}।`,
      {
        actions: [...issueLines, ...suggestionLines, ...dropLines].slice(0, 10),
        products:
          analytics.demandSignals.length > 0
            ? analytics.demandSignals.slice(0, 4).map((item) => productToSuggestion(item.product))
            : productRows.slice(0, 4).map(productToSuggestion),
      }
    );
  }

  if (includesAny(query, ["গত 5", "last 5", "5 দিন", "পাঁচ দিন", "intent", "চাইছিল", "কিনতে চাই", "ক্রয় করতে"])) {
    const demandLines =
      analytics.demandSignals.length > 0
        ? analytics.demandSignals.slice(0, 5).map((item, index) => formatDemandSignalLine(item, index))
        : ["গত ৫ দিনে strong demand-gap signal পাওয়া যায়নি।"];

    return respond(
      `গত ৫ দিনের user-intent scan (${analytics.reportDate}) অনুযায়ী high-interest কিন্তু কম-conversion product detect করেছি।`,
      {
        actions: [
          ...demandLines,
          `Suggestion: ${analytics.suggestions[0] || "High-intent products এ CTA + offer টেস্ট করুন।"}`,
        ],
        products:
          analytics.demandSignals.length > 0
            ? analytics.demandSignals.slice(0, 5).map((item) => productToSuggestion(item.product))
            : productRows.slice(0, 4).map(productToSuggestion),
      }
    );
  }

  if (includesAny(query, ["traffic", "visitor", "visit", "ভিজিটর", "কাস্টমার আসছে", "source", "উৎস", "কোথা থেকে", "country"])) {
    const topSources =
      analytics.traffic.topSources.length > 0
        ? analytics.traffic.topSources
            .slice(0, 4)
            .map((item) => `${item.name} (${item.count})`)
            .join(", ")
        : "No source data yet";
    const topCountries =
      analytics.traffic.topCountries.length > 0
        ? analytics.traffic.topCountries
            .slice(0, 3)
            .map((item) => `${item.name} (${item.count})`)
            .join(", ")
        : "No country data yet";
    const dropLines = analytics.dropOffPages.slice(0, 3).map((item, index) => formatDropOffLine(item, index));

    return respond(
      `Traffic (${analytics.reportDate}): আজ visits ${analytics.traffic.visitsToday}, গতকাল ${analytics.traffic.visitsYesterday} (${formatSignedPercent(
        analytics.traffic.visitsDeltaPct
      )}), live users ${analytics.traffic.liveUsers}. Top sources: ${topSources}.`,
      {
        actions: [
          `Top regions: ${topCountries}`,
          ...dropLines,
          `Retention: ${analytics.suggestions[0] || "Landing-to-checkout flow optimize করুন।"}`,
        ],
      }
    );
  }

  if (includesAny(query, ["top selling", "best seller", "বেশি সেল", "সবচেয়ে বেশি", "most sold", "popular"])) {
    const topLines =
      analytics.topSelling.length > 0
        ? analytics.topSelling.map((item, index) => formatTopSellingLine(item, index))
        : ["এখনো sales data কম, top-selling list তৈরি হয়নি।"];

    return respond(`Best-selling products snapshot (${analytics.reportDate}) প্রস্তুত।`, {
      actions: topLines,
      products:
        analytics.topSelling.length > 0
          ? analytics.topSelling.map((item) => productToSuggestion(item.product))
          : productRows.slice(0, 5).map(productToSuggestion),
    });
  }

  if (includesAny(query, ["stock", "restock", "inventory", "স্টক", "রিস্টক", "কি কি স্টক লাগবে"])) {
    const stockLines =
      analytics.stockAlerts.length > 0
        ? analytics.stockAlerts.slice(0, 6).map((item, index) => formatStockAlertLine(item, index))
        : ["Critical stock risk detect হয়নি।"];

    return respond(
      `Inventory alert (${analytics.reportDate}): restock দরকার এমন প্রডাক্টগুলো বিশ্লেষণ করেছি।`,
      {
        actions: [
          ...stockLines,
          `Note: demand signals last 5 days: ${analytics.demandSignals.length} product.`,
        ],
        products:
          analytics.stockAlerts.length > 0
            ? analytics.stockAlerts.slice(0, 6).map((item) => productToSuggestion(item.product))
            : productRows.slice(0, 5).map(productToSuggestion),
      }
    );
  }

  if (includesAny(query, ["predict", "prediction", "forecast", "পেডিক্ট", "প্রেডিক্ট", "ভবিষ্যৎ", "আগামী"])) {
    const keyRisk =
      analytics.issueFlags.find((item) => item.includes("drop-off")) ||
      analytics.issueFlags.find((item) => item.includes("visitor")) ||
      analytics.issueFlags[0] ||
      "No major risk";

    return respond(
      `Prediction (${analytics.reportDate}): আগামীকাল estimated sales ${formatCurrency(
        analytics.forecast.salesTomorrow
      )}, next 7 days ${formatCurrency(analytics.forecast.salesNext7)}; আগামীকাল estimated visits ${Math.round(
        analytics.forecast.visitsTomorrow
      )}, next 7 days ${Math.round(analytics.forecast.visitsNext7)}. Confidence: ${
        analytics.forecast.confidence
      }.`,
      {
        actions: [
          `Risk signal: ${keyRisk}`,
          ...analytics.suggestions.slice(0, 3).map((item) => `Action: ${item}`),
        ],
      }
    );
  }

  if (includesAny(query, ["today", "আজ", "আজকে"]) && includesAny(query, ["sales", "বিক্রি", "order", "অর্ডার", "pending", "পেন্ডিং", "completed", "সম্পন্ন"])) {
    return respond(
      `আজ (${analytics.reportDate}) sales ${formatCurrency(analytics.todaySales)}, orders ${analytics.todayOrders}, completed ${analytics.todayCompleted}. বর্তমান open order (pending+processing+shipped) ${
        analytics.pendingAll + analytics.processingAll + analytics.shippedAll
      }.`
    );
  }

  if (includesAny(query, ["status", "স্ট্যাটাস", "pending", "পেন্ডিং", "completed", "ডেলিভার", "সম্পন্ন"])) {
    return respond(
      `Order status summary: completed ${analytics.completedAll}, pending ${analytics.pendingAll}, processing ${analytics.processingAll}, shipped ${analytics.shippedAll}, returned ${analytics.returnedAll}, cancelled ${analytics.cancelledAll}.`
    );
  }

  if (!query || includesAny(query, ["overview", "summary", "ড্যাশবোর্ড", "সব তথ্য", "store status", "auto", "সবকিছু", "full report"])) {
    const topSource = analytics.traffic.topSources[0];
    const topSelling = analytics.topSelling[0];
    const demandLine = analytics.demandSignals[0]
      ? `${analytics.demandSignals[0].product.name} (interest ${analytics.demandSignals[0].uniqueVisitors}, sold ${analytics.demandSignals[0].soldQtyLast5})`
      : "No strong gap detected";

    return respond(
      `SUMONIX Auto Admin Brief (${analytics.reportDate}): ${formatRangeLabel(
        analytics.focusRangeDays
      )} sales ${formatCurrency(analytics.focusSales)}, orders ${analytics.focusOrders}, completed ${
        analytics.focusCompleted
      }, open ${analytics.focusPending}. আজ sales ${formatCurrency(
        analytics.todaySales
      )}, আজ visitor ${analytics.traffic.visitsToday} (${formatSignedPercent(
        analytics.traffic.visitsDeltaPct
      )} vs yesterday). Top source: ${
        topSource ? `${topSource.name} (${topSource.count})` : "N/A"
      }. Top product: ${
        topSelling ? `${topSelling.product.name} (qty ${topSelling.soldQty})` : "N/A"
      }. Demand gap (5d): ${demandLine}. Forecast tomorrow sales ${formatCurrency(
        analytics.forecast.salesTomorrow
      )}.`,
      {
        actions: [
          ...analytics.issueFlags.slice(0, 3).map((item) => `Issue: ${item}`),
          ...analytics.suggestions.slice(0, 4).map((item) => `Action: ${item}`),
        ],
        products:
          analytics.topSelling.length > 0
            ? analytics.topSelling.slice(0, 5).map((item) => productToSuggestion(item.product))
            : productRows.slice(0, 5).map(productToSuggestion),
      }
    );
  }

  if (includesAny(query, ["sales", "বিক্রয়", "revenue", "income"])) {
    return respond(
      `${formatRangeLabel(analytics.focusRangeDays)} sales ${formatCurrency(
        analytics.focusSales
      )}, orders ${analytics.focusOrders}, completed ${analytics.focusCompleted}. Lifetime sales ${formatCurrency(
        analytics.totalSalesAll
      )}.`
    );
  }

  if (includesAny(query, ["featured", "campaign", "draft"])) {
    return respond(
      `Catalog signal: featured ${featured}, draft ${drafts}, stock-alert products ${analytics.stockAlerts.length}.`
    );
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
    `আপনি আমাকে sales, status, top-selling, stock alert, visitor source, drop-off issue, last 5 days intent, prediction বা full auto report জিজ্ঞেস করতে পারেন। Store contact: ${settings?.address || "N/A"}.`,
    {
      products: productRows.slice(0, 4).map(productToSuggestion),
    }
  );
}

export type { AssistantReply, SumonixContext };
