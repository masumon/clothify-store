"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { FormEvent, useState } from "react";

type SuggestedProduct = {
  id: string;
  name: string;
  price: number;
  image_url: string;
  category: string;
  campaign_badge?: string | null;
};

type ChatMessage = {
  role: "user" | "assistant";
  text: string;
  products?: SuggestedProduct[];
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

  const sendQuestion = async (e?: FormEvent) => {
    e?.preventDefault();
    const text = question.trim();
    if (!text || loading) return;

    setMessages((prev) => [...prev, { role: "user", text }]);
    setQuestion("");
    setLoading(true);

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
    <div className="fixed bottom-5 right-5 z-[80]">
      {open ? (
        <div className="w-[340px] overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-2xl shadow-slate-900/20">
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
                      <Link
                        key={product.id}
                        href={`/product/${product.id}`}
                        className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white p-3 shadow-sm"
                      >
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
                        </div>
                      </Link>
                    ))}
                  </div>
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
          className="rounded-full bg-gradient-to-r from-teal-700 to-cyan-700 px-5 py-3 text-sm font-bold text-white shadow-xl shadow-teal-900/25"
        >
          SUMONIX AI
        </button>
      ) : null}
    </div>
  );
}
