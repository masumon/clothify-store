"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { FormEvent, useEffect, useRef, useState } from "react";
import { addToCart, getCart } from "@/lib/cart";

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

type ChatMessage = {
  role: "user" | "assistant";
  text: string;
  products?: SuggestedProduct[];
  actions?: string[];
};

type Props = {
  mode?: "public" | "admin";
};

function renderRichText(text: string) {
  const markdownLinkRegex = /\[([^\]]+)\]\(((?:https?:\/\/|\/)[^\s)]+)\)/g;
  const rawUrlRegex = /(https?:\/\/[^\s]+)/g;

  const withMarkdownLinks: Array<{
    type: "text" | "link";
    text: string;
    href?: string;
    external?: boolean;
  }> = [];
  let lastIndex = 0;
  let match: RegExpExecArray | null;

  while ((match = markdownLinkRegex.exec(text)) !== null) {
    const [fullMatch, label, href] = match;
    if (match.index > lastIndex) {
      withMarkdownLinks.push({ type: "text", text: text.slice(lastIndex, match.index) });
    }
    withMarkdownLinks.push({
      type: "link",
      text: label,
      href,
      external: /^https?:\/\//.test(href),
    });
    lastIndex = match.index + fullMatch.length;
  }

  if (lastIndex < text.length) {
    withMarkdownLinks.push({ type: "text", text: text.slice(lastIndex) });
  }

  const nodes: Array<{
    type: "text" | "link";
    text: string;
    href?: string;
    external?: boolean;
  }> = [];
  withMarkdownLinks.forEach((part) => {
    if (part.type === "link") {
      nodes.push(part);
      return;
    }

    rawUrlRegex.lastIndex = 0;
    let urlLastIndex = 0;
    let urlMatch: RegExpExecArray | null;
    while ((urlMatch = rawUrlRegex.exec(part.text)) !== null) {
      const [url] = urlMatch;
      if (urlMatch.index > urlLastIndex) {
        nodes.push({ type: "text", text: part.text.slice(urlLastIndex, urlMatch.index) });
      }
      nodes.push({ type: "link", text: url, href: url, external: true });
      urlLastIndex = urlMatch.index + url.length;
    }

    if (urlLastIndex < part.text.length) {
      nodes.push({ type: "text", text: part.text.slice(urlLastIndex) });
    }
  });

  return nodes.map((node, index) => {
    if (node.type === "link" && node.href) {
      if (node.external) {
        return (
          <a
            key={`node-${index}`}
            href={node.href}
            target="_blank"
            rel="noreferrer"
            className="font-semibold text-cyan-700 underline underline-offset-2"
          >
            {node.text}
          </a>
        );
      }

      return (
        <Link
          key={`node-${index}`}
          href={node.href}
          className="font-semibold text-cyan-700 underline underline-offset-2"
        >
          {node.text}
        </Link>
      );
    }

    return <span key={`node-${index}`}>{node.text}</span>;
  });
}

export default function SumonixAIWidget({ mode = "public" }: Props) {
  const pathname = usePathname();
  const messagesScrollRef = useRef<HTMLDivElement | null>(null);
  const [open, setOpen] = useState(false);
  const [question, setQuestion] = useState("");
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);

  const isAdminRoute = pathname.startsWith("/admin");
  const shouldHide = (mode === "public" && isAdminRoute) || (mode === "admin" && !isAdminRoute);
  const quickPrompts =
    mode === "admin"
      ? [
          "আজকের sales + pending report দিন",
          "গত ৫ দিনের intent gap বলুন",
          "কোথায় drop-off বেশি হচ্ছে?",
          "restock alert দিন",
        ]
      : [
          "কিভাবে অর্ডার করবো?",
          "পেমেন্ট কিভাবে করবো?",
          "ডেলিভারি কতো দিনে হবে?",
          "আমি checkout এ আটকে গেছি",
        ];

  useEffect(() => {
    if (!open) return;
    const container = messagesScrollRef.current;
    if (!container) return;
    container.scrollTop = container.scrollHeight;
  }, [messages, loading, open]);

  if (shouldHide) {
    return null;
  }

  // Keep assistant above mobile sticky navigation on public pages.
  const floatingPositionClass =
    mode === "public"
      ? "bottom-[8.4rem] left-4 sm:bottom-24 sm:left-5 md:bottom-24 md:left-6"
      : "bottom-5 right-5 md:bottom-6 md:right-6";

  const getUiLanguage = () => {
    if (typeof window === "undefined") return "";
    const htmlLang = document.documentElement.lang || "";
    if (htmlLang) return htmlLang;
    return localStorage.getItem("clothfy-lang") || "";
  };

  const submitQuestion = async (rawText: string) => {
    const text = rawText.trim();
    if (!text || loading) return;

    setMessages((prev) => [...prev, { role: "user", text }]);
    setQuestion("");

    if (mode === "public") {
      const q = text.toLowerCase();
      if (q.includes("cart") || q.includes("কার্ট") || q.includes("আমার কার্ট")) {
        const cart = getCart();
        const total = cart.reduce((sum, item) => sum + Number(item.price) * item.quantity, 0);
        const summary =
          cart.length === 0
            ? "আপনার কার্ট এখন খালি। আমি চাইলে কিছু কাপড় সাজেস্ট করতে পারি।"
            : `আপনার কার্টে ${cart.length}টি item আছে। মোট মূল্য ৳${total}.`;

        setMessages((prev) => [
          ...prev,
          {
            role: "assistant",
            text: summary,
          },
        ]);
        setLoading(false);
        return;
      }
    }

    setLoading(true);

    try {
      const response = await fetch(mode === "admin" ? "/api/admin/sumonix" : "/api/sumonix", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          question: text,
          contextPath: pathname,
          uiLanguage: getUiLanguage(),
        }),
      });

      const result = await response.json().catch(() => ({} as Record<string, unknown>));
      const resultMessage =
        typeof (result as { message?: unknown }).message === "string"
          ? ((result as { message: string }).message || "").trim()
          : "";

      if (!response.ok) {
        const apiError =
          typeof (result as { error?: unknown }).error === "string"
            ? (result as { error: string }).error
            : "SUMONIX AI request failed";
        throw new Error(apiError);
      }

      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          text: resultMessage || "আমি এই প্রশ্নের জন্য concise response তৈরি করতে পারিনি, আবার একটু বিস্তারিত লিখে দিন।",
          products: Array.isArray((result as { products?: unknown }).products)
            ? ((result as { products: SuggestedProduct[] }).products || [])
            : [],
          actions: Array.isArray((result as { actions?: unknown }).actions)
            ? ((result as { actions: string[] }).actions || [])
            : [],
        },
      ]);
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "Unexpected error";
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          text: `দুঃখিত, এখন উত্তর দিতে পারছি না: ${message}`,
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const sendQuestion = async (e?: FormEvent) => {
    e?.preventDefault();
    await submitQuestion(question);
  };

  return (
    <div className={`fixed z-[85] ${floatingPositionClass}`}>
      {open ? (
        <div className="w-[min(90vw,312px)] overflow-hidden rounded-3xl border border-slate-200/90 bg-white shadow-2xl shadow-slate-900/25 ring-1 ring-slate-100">
          <div className="bg-gradient-to-r from-teal-800 via-cyan-700 to-sky-700 px-4 py-3.5 text-white">
            <div className="flex items-center justify-between gap-3">
              <div>
                <h3 className="text-base font-extrabold">SUMONIX AI</h3>
              </div>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="rounded-full bg-white/15 px-3 py-1 text-xs font-semibold text-white"
              >
                Close
              </button>
            </div>
          </div>

          <div
            ref={messagesScrollRef}
            className="max-h-[320px] space-y-3 overflow-y-auto bg-[radial-gradient(circle_at_top,#e0f7fa_0%,#f8fafc_42%,#f8fafc_100%)] p-3"
          >
            {messages.map((message, index) => (
              <div key={`${message.role}-${index}`}>
                <div
                  className={`rounded-2xl px-3.5 py-2.5 text-sm leading-6 ${
                    message.role === "assistant"
                      ? "border border-slate-200 bg-white text-slate-800 shadow-sm"
                      : "ml-10 bg-gradient-to-r from-teal-700 to-cyan-700 text-white"
                  }`}
                >
                  {renderRichText(message.text)}
                </div>

                {message.products?.length ? (
                  <div className="mt-3 grid gap-3">
                    {message.products.map((product) => (
                      <div
                        key={product.id}
                        className="rounded-2xl border border-slate-200 bg-white p-3 shadow-sm"
                      >
                        <Link href={`/product/${product.id}`} className="flex items-center gap-3">
                          <Image
                            src={product.image_url}
                            alt={product.name}
                            width={56}
                            height={56}
                            className="h-14 w-14 rounded-xl object-cover"
                          />
                          <div className="min-w-0">
                            <p className="truncate text-sm font-bold text-slate-900">{product.name}</p>
                            <p className="text-xs text-slate-500">{product.category}</p>
                            <p className="text-sm font-semibold text-teal-700">৳{product.price}</p>
                            {(product.stock_quantity ?? 20) <= 5 ? (
                              <p className="text-[11px] font-semibold text-amber-700">
                                {(product.stock_quantity ?? 20) <= 0
                                  ? "Out of stock"
                                  : `Low stock: ${product.stock_quantity ?? 20}`}
                              </p>
                            ) : null}
                          </div>
                        </Link>

                        {mode === "public" ? (
                          <button
                            type="button"
                            disabled={(product.stock_quantity ?? 20) <= 0}
                            onClick={() => {
                              addToCart({
                                id: product.id,
                                name: product.name,
                                price: Number(product.price),
                                image_url: product.image_url,
                                selectedSize: product.sizes?.[0] || "Standard",
                                quantity: 1,
                              });
                              setMessages((prev) => [
                                ...prev,
                                {
                                  role: "assistant",
                                  text: `✅ ${product.name} কার্টে যোগ হয়েছে।`,
                                },
                              ]);
                            }}
                            className="mt-2 w-full rounded-xl bg-teal-700 px-3 py-2 text-xs font-semibold text-white disabled:opacity-50"
                          >
                            {(product.stock_quantity ?? 20) <= 0 ? "Out of Stock" : "Add to Cart"}
                          </button>
                        ) : null}
                      </div>
                    ))}
                  </div>
                ) : null}

                {message.actions?.length ? (
                  <ul className="mt-2 space-y-1 text-xs font-semibold text-emerald-700">
                    {message.actions.map((action, idx) => (
                      <li key={`${action}-${idx}`}>• {action}</li>
                    ))}
                  </ul>
                ) : null}
              </div>
            ))}

            {loading ? (
              <div className="rounded-2xl bg-white px-4 py-3 text-sm leading-6 text-slate-800 shadow-sm">
                <span className="font-semibold text-teal-700">SUMONIX AI typing......</span>
                <span className="ml-2 inline-flex items-center gap-1 align-middle">
                  <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-teal-600 [animation-delay:0ms]" />
                  <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-teal-600 [animation-delay:120ms]" />
                  <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-teal-600 [animation-delay:240ms]" />
                </span>
              </div>
            ) : null}
          </div>

          <form onSubmit={sendQuestion} className="border-t border-slate-200 bg-white p-3">
            <div className="mb-2 flex flex-wrap gap-2">
              {quickPrompts.map((prompt) => (
                <button
                  key={prompt}
                  type="button"
                  disabled={loading}
                  onClick={() => void submitQuestion(prompt)}
                  className="rounded-full border border-cyan-200 bg-cyan-50 px-3 py-1 text-[11px] font-semibold text-cyan-700 transition hover:bg-cyan-100 disabled:opacity-50"
                >
                  {prompt}
                </button>
              ))}
            </div>

            <div className="flex gap-2">
              <input
                type="text"
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                placeholder={
                  mode === "admin" ? "Ask your admin question..." : "Ask your question..."
                }
                className="flex-1 rounded-2xl border border-slate-300 px-3 py-2.5 text-sm outline-none transition focus:border-teal-400 focus:ring-2 focus:ring-teal-100"
              />
              <button
                type="submit"
                disabled={loading}
                className="rounded-2xl bg-teal-700 px-3.5 py-2.5 text-sm font-semibold text-white disabled:opacity-60"
              >
                {loading ? "Typing..." : "Send"}
              </button>
            </div>
          </form>
        </div>
      ) : null}

      {!open ? (
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="group rounded-full bg-gradient-to-r from-teal-700 via-cyan-700 to-sky-700 px-4 py-2.5 text-xs font-bold text-white shadow-xl shadow-teal-900/25 transition hover:scale-[1.03] hover:shadow-2xl"
        >
          <span className="flex items-center gap-2">
            <span className="inline-flex h-2 w-2 rounded-full bg-emerald-300 shadow-[0_0_0_3px_rgba(110,231,183,0.25)]" />
            SUMONIX AI
          </span>
        </button>
      ) : null}
    </div>
  );
}
