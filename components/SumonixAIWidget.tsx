"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { FormEvent, useState } from "react";
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

export default function SumonixAIWidget({ mode = "public" }: Props) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [question, setQuestion] = useState("");
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: "assistant",
      text:
        mode === "admin"
          ? "আমি SUMONIX AI admin assistant। sales, stock, orders, draft, featured products, store info সম্পর্কে জিজ্ঞেস করতে পারেন।"
          : "আমি SUMONIX AI। কাপড়, দাম, payment, courier, address, offer বা যেকোনো product সম্পর্কে জিজ্ঞেস করুন।",
    },
  ]);

  const isAdminRoute = pathname.startsWith("/admin");
  if ((mode === "public" && isAdminRoute) || (mode === "admin" && !isAdminRoute)) {
    return null;
  }

  // Keep assistant above mobile sticky navigation on public pages.
  const floatingPositionClass =
    mode === "public"
      ? "bottom-[5.5rem] right-4 sm:bottom-24 sm:right-5 md:bottom-6 md:right-6"
      : "bottom-5 right-5 md:bottom-6 md:right-6";

  const sendQuestion = async (e?: FormEvent) => {
    e?.preventDefault();
    const text = question.trim();
    if (!text || loading) return;

    setMessages((prev) => [...prev, { role: "user", text }]);
    setQuestion("");
    setLoading(true);

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

    try {
      const response = await fetch(mode === "admin" ? "/api/admin/sumonix" : "/api/sumonix", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ question: text }),
      });

      const result = await response.json();
      if (!response.ok) {
        throw new Error(result.error || "SUMONIX AI request failed");
      }

      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          text: result.message || "কোনো উত্তর পাওয়া যায়নি।",
          products: Array.isArray(result.products) ? result.products : [],
          actions: Array.isArray(result.actions) ? result.actions : [],
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

  return (
    <div className={`fixed z-[85] ${floatingPositionClass}`}>
      {open ? (
        <div className="w-[min(92vw,360px)] overflow-hidden rounded-3xl border border-slate-200/90 bg-white shadow-2xl shadow-slate-900/20 ring-1 ring-slate-100">
          <div className="bg-gradient-to-r from-teal-700 to-cyan-700 px-4 py-4 text-white">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-white/80">AI Assistant</p>
                <h3 className="text-lg font-extrabold">SUMONIX AI</h3>
              </div>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="rounded-full bg-white/15 px-3 py-1 text-sm font-semibold text-white"
              >
                Close
              </button>
            </div>
          </div>

          <div className="max-h-[420px] space-y-3 overflow-y-auto bg-slate-50 p-4">
            {messages.map((message, index) => (
              <div key={`${message.role}-${index}`}>
                <div
                  className={`rounded-2xl px-4 py-3 text-sm leading-6 ${
                    message.role === "assistant"
                      ? "bg-white text-slate-800 shadow-sm"
                      : "ml-10 bg-teal-700 text-white"
                  }`}
                >
                  {message.text}
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
          </div>

          <form onSubmit={sendQuestion} className="border-t border-slate-200 bg-white p-3">
            <div className="flex gap-2">
              <input
                type="text"
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                placeholder={mode === "admin" ? "Ask about products, sales, stock..." : "Ask about clothes, price, courier..."}
                className="flex-1 rounded-2xl border border-slate-300 px-4 py-3 text-sm outline-none transition focus:border-teal-400 focus:ring-2 focus:ring-teal-100"
              />
              <button
                type="submit"
                disabled={loading}
                className="rounded-2xl bg-teal-700 px-4 py-3 text-sm font-semibold text-white disabled:opacity-60"
              >
                {loading ? "..." : "Send"}
              </button>
            </div>
          </form>
        </div>
      ) : null}

      {!open ? (
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="group rounded-full bg-gradient-to-r from-teal-700 to-cyan-700 px-5 py-3 text-sm font-bold text-white shadow-xl shadow-teal-900/25 transition hover:scale-[1.02] hover:shadow-2xl"
        >
          <span className="flex items-center gap-2">
            <span className="inline-flex h-2.5 w-2.5 rounded-full bg-emerald-300 shadow-[0_0_0_4px_rgba(110,231,183,0.25)]" />
            SUMONIX AI
          </span>
        </button>
      ) : null}
    </div>
  );
}
