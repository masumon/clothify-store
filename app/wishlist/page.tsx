"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { getWishlist, removeFromWishlist, type WishlistItem } from "@/lib/wishlist";
import { addToCart } from "@/lib/cart";
import {
  type Language,
  PREFERENCE_EVENT,
  readSitePreferences,
} from "@/lib/site-preferences";

export default function WishlistPage() {
  const [items, setItems] = useState<WishlistItem[]>([]);
  const [lang, setLang] = useState<Language>("bn");

  useEffect(() => {
    const refresh = () => setItems(getWishlist());
    const syncLang = () => {
      setLang(readSitePreferences().language);
    };

    refresh();
    syncLang();
    window.addEventListener("clothfy-wishlist-change", refresh);
    window.addEventListener(PREFERENCE_EVENT, syncLang);
    return () => {
      window.removeEventListener("clothfy-wishlist-change", refresh);
      window.removeEventListener(PREFERENCE_EVENT, syncLang);
    };
  }, []);

  const handleRemove = (id: string) => removeFromWishlist(id);

  const handleAddToCart = (item: WishlistItem) => {
    addToCart({
      id: item.id,
      name: item.name,
      price: item.price,
      image_url: item.image_url,
      selectedSize: "Standard",
      quantity: 1,
    });
  };

  const isBn = lang === "bn";

  return (
    <main className="min-h-screen pb-24 md:pb-0">
      <Header />

      <div className="mx-auto max-w-4xl px-4 py-8">
        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-2xl font-extrabold text-slate-900">
            {isBn ? "❤️ আমার উইশলিস্ট" : "❤️ My Wishlist"}
          </h1>
          {items.length > 0 && (
            <span className="rounded-full bg-rose-100 px-3 py-1 text-sm font-bold text-rose-700">
              {items.length} {isBn ? "টি আইটেম" : "items"}
            </span>
          )}
        </div>

        {items.length === 0 ? (
          <div className="flex flex-col items-center gap-4 rounded-3xl border border-slate-200 bg-slate-50 py-16 text-center">
            <span className="text-5xl">🤍</span>
            <p className="text-lg font-semibold text-slate-700">
              {isBn ? "উইশলিস্ট খালি আছে" : "Your wishlist is empty"}
            </p>
            <p className="text-sm text-slate-500">
              {isBn
                ? "পণ্য কার্ডে ❤️ বাটন চাপুন সংরক্ষণ করতে"
                : "Tap the ❤️ button on any product card to save it here"}
            </p>
            <Link
              href="/"
              className="mt-2 rounded-full bg-teal-600 px-6 py-3 text-sm font-bold text-white transition hover:bg-teal-700"
            >
              {isBn ? "🛍️ কেনাকাটা শুরু করুন" : "🛍️ Start Shopping"}
            </Link>
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {items.map((item) => (
              <div
                key={item.id}
                className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
              >
                <div className="relative h-48 overflow-hidden bg-slate-100">
                  <Image
                    src={item.image_url}
                    alt={item.name}
                    fill
                    className="object-cover"
                    sizes="(max-width: 640px) 100vw, 33vw"
                  />
                  <button
                    type="button"
                    onClick={() => handleRemove(item.id)}
                    aria-label="Remove from wishlist"
                    className="absolute right-2 top-2 flex h-8 w-8 items-center justify-center rounded-full border border-rose-200 bg-white/90 text-xs text-rose-500 shadow-sm transition hover:bg-rose-50"
                  >
                    ✕
                  </button>
                </div>
                <div className="p-4">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-teal-700">
                    {item.category}
                  </p>
                  <h3 className="mt-1 line-clamp-2 text-sm font-bold text-slate-900">
                    {item.name}
                  </h3>
                  <p className="mt-2 text-lg font-extrabold text-teal-700">৳{item.price}</p>
                  <div className="mt-3 flex gap-2">
                    <button
                      type="button"
                      onClick={() => handleAddToCart(item)}
                      className="flex-1 rounded-full bg-slate-900 py-2.5 text-xs font-bold text-white transition hover:bg-slate-700"
                    >
                      🛒 {isBn ? "কার্টে যোগ" : "Add to Cart"}
                    </button>
                    <Link
                      href={`/product/${item.id}`}
                      className="rounded-full border border-slate-200 px-3 py-2.5 text-xs font-semibold text-slate-700 transition hover:bg-slate-50"
                    >
                      {isBn ? "দেখুন" : "View"}
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <Footer />
    </main>
  );
}
