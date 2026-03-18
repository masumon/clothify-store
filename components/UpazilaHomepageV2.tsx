"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import ProductCard from "@/components/ProductCard";
import SearchAndFilter from "@/components/SearchAndFilter";
import SectionHeader from "@/components/SectionHeader";
import {
  type Language,
  PREFERENCE_EVENT,
  readSitePreferences,
} from "@/lib/site-preferences";
import type { Product } from "@/types";

type Props = {
  products: Product[];
  categories: string[];
  activeCategory: string;
  activeSearch: string;
  whatsappNumber: string;
};

const CATEGORY_ICON_MAP: Record<string, string> = {
  Panjabi: "👘",
  "Kabli Set": "🧥",
  Pajama: "👖",
  "Casual Shirt": "👕",
  "Formal Shirt": "👔",
  "T-Shirt": "👕",
  "Polo Shirt": "🏌️",
  Jeans: "👖",
  Chinos: "👖",
  "Formal Trousers": "👔",
  Belt: "🪢",
  Wallet: "👛",
};

function pickIcon(category: string) {
  return CATEGORY_ICON_MAP[category] || "🛍️";
}

function slugify(value: string) {
  return encodeURIComponent(value.trim());
}

type PromoAd = {
  id: string;
  badge: string;
  title: string;
  description: string;
  className: string;
};

export default function UpazilaHomepageV2({
  products,
  categories,
  activeCategory,
  activeSearch,
  whatsappNumber,
}: Props) {
  const safeWhatsApp = whatsappNumber || "8801811314262";
  const [lang, setLang] = useState<Language>("bn");
  const [dismissedAds, setDismissedAds] = useState<string[]>([]);

  useEffect(() => {
    const sync = () => setLang(readSitePreferences().language);
    sync();
    window.addEventListener(PREFERENCE_EVENT, sync);
    return () => window.removeEventListener(PREFERENCE_EVENT, sync);
  }, []);

  const isBn = lang === "bn";
  const heroFocusKeywords = /panjabi|kabli|shirt|t-shirt|polo|pant|trouser|jeans/i;
  const heroLooks = products
    .filter((p) => heroFocusKeywords.test(`${p.name} ${p.category}`))
    .slice(0, 10);
  const heroCarouselProducts = (heroLooks.length > 0 ? heroLooks : products.slice(0, 10)).filter(
    (product, index, list) => list.findIndex((candidate) => candidate.id === product.id) === index
  );
  const heroMarqueeItems =
    heroCarouselProducts.length > 0 ? [...heroCarouselProducts, ...heroCarouselProducts] : [];

  const featured = products.filter((p) => p.is_featured).slice(0, 6);
  const newArrival = products.slice(0, 9);
  const bestSelling = (featured.length > 0 ? featured : products).slice(0, 9);
  const panjabiCollection = products
    .filter((p) => /panjabi|kabli|ethnic/i.test(p.category || ""))
    .slice(0, 9);
  const casualShirtCollection = products
    .filter((p) => /casual shirt|shirt|polo|t-shirt/i.test(p.category || ""))
    .slice(0, 9);
  const trending = products
    .filter((p) => p.campaign_badge || p.has_video)
    .slice(0, 9);

  const topCategories = categories.slice(0, 8);

  const trustItems = isBn
    ? ["✅ COD Available", "💳 bKash / Nagad Secure", "🔁 7 দিন Exchange", "🚚 Upazila Fast Delivery"]
    : ["✅ COD Available", "💳 bKash / Nagad Secure", "🔁 7-Day Exchange", "🚚 Upazila Fast Delivery"];

  const promoAds: PromoAd[] = useMemo(
    () => [
      {
        id: "hot-offer",
        badge: "Ad",
        title: isBn ? "Buy 2 Shirts, Save ৳300" : "Buy 2 Shirts, Save ৳300",
        description: isBn
          ? "Limited stock. Student-friendly combo deal."
          : "Limited stock. Student-friendly combo deal.",
        className:
          "border-amber-300 bg-gradient-to-br from-amber-100/95 to-orange-100/95 text-slate-900",
      },
      {
        id: "festival-deal",
        badge: "Ad",
        title: isBn ? "Panjabi + Pajama Bundle" : "Panjabi + Pajama Bundle",
        description: isBn
          ? "Eid-ready look with special exchange support."
          : "Eid-ready look with special exchange support.",
        className:
          "border-emerald-300 bg-gradient-to-br from-emerald-100/95 to-teal-100/95 text-slate-900",
      },
    ],
    [isBn]
  );

  const visibleAds = promoAds.filter((ad) => !dismissedAds.includes(ad.id));

  return (
    <section className="space-y-8">
      <div id="filters-top" className="scroll-mt-24">
        <SearchAndFilter categories={categories} />
      </div>

      <div className="relative overflow-hidden rounded-3xl border border-teal-100 bg-gradient-to-br from-[#000080] via-[#0a3b7a] to-[#008080] p-4 text-white sm:p-6">
        <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-[#CC5500]/30 blur-2xl" />
        <div className="absolute -bottom-10 -left-10 h-40 w-40 rounded-full bg-[#8A9A5B]/30 blur-2xl" />

        <div className="relative z-10">
          <p className="text-center text-[11px] font-bold uppercase tracking-[0.2em] text-amber-200">
            Eid Men&apos;s Style Hero
          </p>

          {heroMarqueeItems.length > 0 ? (
            <div className="hero-marquee-mask mt-3 rounded-2xl">
              <div className="hero-marquee-track">
                {heroMarqueeItems.map((product, index) => (
                  <Link key={`${product.id}-${index}`} href={`/product/${product.id}`} className="hero-look-card group">
                    <div className="relative h-36 overflow-hidden rounded-2xl sm:h-44">
                      <Image
                        src={product.image_url || "/hero-modern-fashion.svg"}
                        alt={product.name}
                        fill
                        sizes="(max-width: 640px) 60vw, 220px"
                        className="object-cover transition duration-500 group-hover:scale-105"
                      />
                    </div>
                    <div className="px-1 pb-1 pt-2">
                      <p className="line-clamp-1 text-xs font-semibold text-white/95">{product.name}</p>
                      <p className="mt-0.5 line-clamp-1 text-[11px] font-medium text-amber-200">{product.category}</p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          ) : (
            <div className="mt-3 rounded-2xl border border-white/25 bg-white/10 px-4 py-5 text-sm font-semibold text-white/90">
              Premium Panjabi, Shirt, Pant & T-Shirt images will appear automatically after product upload.
            </div>
          )}

          <div className="mt-4 rounded-2xl border border-white/20 bg-white/10 p-4 backdrop-blur-sm">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-amber-200">
              Upazila Style Drop • Smart Budget Premium
            </p>
            <h2 className="mt-2 text-xl font-extrabold leading-tight text-white sm:text-3xl">
              ভাই, আপনার Fit Ready! 2026 Men&apos;s Collection
            </h2>
            <p className="mt-2 text-sm text-slate-100 sm:text-base">
              Panjabi, Polo, Shirt, Jeans - trendy look, budget-friendly price, trusted checkout.
            </p>

            <div className="mt-4 flex flex-wrap gap-2">
              <Link
                href="#new-arrival"
                className="rounded-full bg-[#CC5500] px-4 py-2 text-sm font-bold text-white transition hover:-translate-y-0.5 hover:bg-[#b84c00]"
              >
                🛍️ Shop Now
              </Link>
              <a
                href={`https://wa.me/${safeWhatsApp}?text=${encodeURIComponent("ভাই, একটা product নিয়ে help লাগবে")}`}
                target="_blank"
                rel="noreferrer"
                className="rounded-full border border-white/50 bg-white/10 px-4 py-2 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:bg-white/20"
              >
                💬 WhatsApp Help
              </a>
            </div>

            <div className="mt-4 grid grid-cols-2 gap-2 text-[11px] sm:flex sm:flex-wrap">
              {trustItems.map((item) => (
                <span key={item} className="rounded-full bg-white/15 px-3 py-1.5 font-semibold">
                  {item}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {visibleAds.length > 0 ? (
        <div className="grid gap-3 sm:grid-cols-2">
          {visibleAds.map((ad) => (
            <div key={ad.id} className={`relative rounded-2xl border p-4 shadow-sm ${ad.className}`}>
              <span className="rounded-full border border-black/10 bg-white/70 px-2 py-0.5 text-[10px] font-bold uppercase tracking-[0.2em]">
                {ad.badge}
              </span>
              <h3 className="mt-2 text-lg font-extrabold">{ad.title}</h3>
              <p className="mt-1 text-sm text-slate-700">{ad.description}</p>
              <button
                type="button"
                onClick={() => setDismissedAds((prev) => [...prev, ad.id])}
                className="absolute right-2 top-2 inline-flex h-7 w-7 items-center justify-center rounded-full border border-black/15 bg-white/80 text-sm font-bold text-slate-700 transition hover:scale-110 hover:bg-white"
                aria-label="Close ad"
                title={isBn ? "বন্ধ করুন" : "Close"}
              >
                ✕
              </button>
            </div>
          ))}
        </div>
      ) : null}

      <div className="surface-card p-4 sm:p-5">
        <div className="mb-3 flex items-center justify-between">
          <p className="text-xs font-bold uppercase tracking-[0.16em] text-slate-500">
            {isBn ? "ক্যাটাগরি শর্টকাট" : "Category Shortcuts"}
          </p>
          <Link href="/categories" className="text-xs font-semibold text-teal-700 hover:underline">
            {isBn ? "সব দেখুন" : "View All"}
          </Link>
        </div>

        <div className="grid grid-cols-4 gap-2 sm:grid-cols-8">
          {topCategories.map((category) => (
            <Link
              key={category}
              href={`/?category=${slugify(category)}${activeSearch ? `&search=${slugify(activeSearch)}` : ""}`}
              title={category}
              className={`group flex flex-col items-center justify-center rounded-2xl border px-2 py-3 text-center transition hover:scale-105 ${
                activeCategory === category
                  ? "border-teal-600 bg-teal-50 text-teal-900"
                  : "border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
              }`}
            >
              <span className="text-lg leading-none">{pickIcon(category)}</span>
              <span className="mt-1 line-clamp-1 text-[10px] font-semibold sm:text-xs">
                {category}
              </span>
            </Link>
          ))}
        </div>
      </div>

      <div id="new-arrival">
        <SectionHeader
          icon="🆕"
          title="New Arrival"
          subtitle="নতুন কালেকশন — fresh drop for campus + outing"
          rightText={`${newArrival.length} item`}
        />
        <div className="grid grid-cols-2 gap-3 md:grid-cols-3">
          {newArrival.map((product) => (
            <ProductCard key={product.id} product={product} whatsappNumber={safeWhatsApp} />
          ))}
        </div>
      </div>

      <div>
        <SectionHeader
          icon="🔥"
          title="Best Selling"
          subtitle="জনপ্রিয় পণ্য — local boys&apos; top picks"
          rightText={`${bestSelling.length} item`}
        />
        <div className="grid grid-cols-2 gap-3 md:grid-cols-3">
          {bestSelling.map((product) => (
            <ProductCard key={product.id} product={product} whatsappNumber={safeWhatsApp} />
          ))}
        </div>
      </div>

      <div>
        <SectionHeader
          icon="👘"
          title="Panjabi Collection"
          subtitle="Ethnic wear for Jumu&apos;ah, Eid, wedding and events"
          rightText={`${panjabiCollection.length} item`}
        />
        <div className="grid grid-cols-2 gap-3 md:grid-cols-3">
          {panjabiCollection.map((product) => (
            <ProductCard key={product.id} product={product} whatsappNumber={safeWhatsApp} />
          ))}
        </div>
      </div>

      <div>
        <SectionHeader
          icon="👔"
          title="Casual Shirt Collection"
          subtitle="Daily campus-ready smart casual look"
          rightText={`${casualShirtCollection.length} item`}
        />
        <div className="grid grid-cols-2 gap-3 md:grid-cols-3">
          {casualShirtCollection.map((product) => (
            <ProductCard key={product.id} product={product} whatsappNumber={safeWhatsApp} />
          ))}
        </div>
      </div>

      {trending.length > 0 ? (
        <div>
          <SectionHeader
            icon="📈"
            title="Trending Now"
            subtitle="Facebook/TikTok-inspired current trend picks"
            rightText={`${trending.length} item`}
          />
          <div className="grid grid-cols-2 gap-3 md:grid-cols-3">
            {trending.map((product) => (
              <ProductCard key={product.id} product={product} whatsappNumber={safeWhatsApp} />
            ))}
          </div>
        </div>
      ) : null}

      <div className="rounded-3xl border border-slate-200 bg-white p-4 sm:p-6">
        <SectionHeader
          icon="🛡️"
          title="Why Trust Clothify"
          subtitle="Clear policy + human support + real reviews"
        />
        <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {[
            "✅ COD all over Bangladesh",
            "🔁 7 দিন easy exchange",
            "📍 Upazila-friendly delivery",
            "🔐 Verified bKash/Nagad payment",
          ].map((item) => (
            <div key={item} className="rounded-2xl border border-slate-200 bg-slate-50 px-3 py-3 text-sm font-semibold text-slate-700">
              {item}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
