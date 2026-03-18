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
  type UiMode,
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
  badgeClassName: string;
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
  const [uiMode, setUiMode] = useState<UiMode>("default");

  useEffect(() => {
    const sync = () => {
      const prefs = readSitePreferences();
      setLang(prefs.language);
      setUiMode(prefs.uiMode);
    };
    sync();
    window.addEventListener(PREFERENCE_EVENT, sync);
    return () => window.removeEventListener(PREFERENCE_EVENT, sync);
  }, []);

  const isBn = lang === "bn";
  const isAbo = uiMode === "abo";
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
  const aboFilterCategories = ["All", ...categories.slice(0, 4)];

  const promoAds: PromoAd[] = useMemo(
    () => [
      {
        id: "hot-offer",
        badge: "Ad",
        title: "Buy 2 Shirts, Save ৳300",
        description: isBn
          ? "Limited stock. Student-friendly combo deal."
          : "Limited stock. Student-friendly combo deal.",
        className: "border-amber-300/80 bg-[#fff4d8]",
        badgeClassName: "border-amber-800/20 bg-amber-900/10 text-amber-900",
      },
      {
        id: "festival-deal",
        badge: "Ad",
        title: "Panjabi + Pajama Bundle",
        description: isBn
          ? "Eid-ready look with special exchange support."
          : "Eid-ready look with special exchange support.",
        className: "border-emerald-300/80 bg-[#e7fbe9]",
        badgeClassName: "border-emerald-800/20 bg-emerald-900/10 text-emerald-900",
      },
      {
        id: "flash-deal",
        badge: "Ad",
        title: isBn ? "আজকের Flash Deal" : "Today Flash Deal",
        description: isBn
          ? "Top pick item-এ সীমিত সময়ের discount."
          : "Limited-time discount on top picks.",
        className: "border-cyan-300/80 bg-[#e8f7ff]",
        badgeClassName: "border-cyan-800/20 bg-cyan-900/10 text-cyan-900",
      },
    ],
    [isBn]
  );

  const promoMarqueeCards = promoAds.length > 0 ? [...promoAds, ...promoAds] : [];

  return (
    <section className="space-y-8">
      <div id="filters-top" className="scroll-mt-24 flex justify-end">
        <div className="w-full md:max-w-xl">
          <SearchAndFilter categories={categories} compact />
        </div>
      </div>

      <div className="relative overflow-hidden rounded-3xl border border-teal-100 bg-gradient-to-br from-[#000080] via-[#0a3b7a] to-[#008080] p-4 text-white sm:p-6">
        <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-[#CC5500]/30 blur-2xl" />
        <div className="absolute -bottom-10 -left-10 h-40 w-40 rounded-full bg-[#8A9A5B]/30 blur-2xl" />

        <div className="relative z-10">
          <p className="text-center text-[11px] font-bold uppercase tracking-[0.2em] text-amber-200">
            {isBn ? "আজকের অফার + প্রিমিয়াম কালেকশন" : "Today Offers + Premium Collection"}
          </p>

          {promoMarqueeCards.length > 0 ? (
            <div className="promo-marquee-mask mt-3">
              <div className="promo-marquee-track">
                {promoMarqueeCards.map((ad, index) => (
                  <article
                    key={`${ad.id}-${index}`}
                    className={`promo-ad-card rounded-2xl border px-3 py-2 shadow-sm ${ad.className}`}
                  >
                    <span
                      className={`inline-flex rounded-full border px-2 py-0.5 text-[9px] font-bold uppercase tracking-[0.18em] ${ad.badgeClassName}`}
                    >
                      {ad.badge}
                    </span>
                    <p className="mt-1 line-clamp-1 text-xs font-extrabold text-[#102a43]">{ad.title}</p>
                    <p className="line-clamp-1 text-[11px] font-medium text-[#334e68]">{ad.description}</p>
                  </article>
                ))}
              </div>
            </div>
          ) : null}

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

          {isAbo ? (
            <div className="mt-4 rounded-2xl border border-white/20 bg-black/35 px-4 py-5 text-center backdrop-blur-sm sm:px-6">
              <h2 className="text-2xl font-extrabold uppercase tracking-[0.08em] text-white sm:text-4xl">
                Elevate Your Aesthetic
              </h2>
              <p className="mx-auto mt-2 max-w-2xl text-sm text-slate-100 sm:text-base">
                Discover the ultimate menswear collection. Designed in Sylhet, curated for the modern man globally.
              </p>
              <div className="mt-4">
                <Link
                  href="#new-arrival"
                  className="inline-flex items-center justify-center rounded-full bg-white px-6 py-2.5 text-sm font-extrabold text-slate-900 shadow-lg transition hover:bg-amber-300"
                >
                  Explore Collection
                </Link>
              </div>
            </div>
          ) : null}

          <div className="mt-4 flex justify-center">
            <Link
              href="#new-arrival"
              className="rounded-full bg-[#CC5500] px-6 py-2.5 text-sm font-extrabold text-white transition hover:-translate-y-0.5 hover:bg-[#b84c00]"
            >
              {isBn ? "এখানে অর্ডার করুন" : "Order Here"}
            </Link>
          </div>
        </div>
      </div>

      {isAbo ? (
        <div className="rounded-2xl border border-slate-200 bg-white px-3 py-4 shadow-[0_14px_34px_-30px_rgba(2,6,23,0.45)]">
          <h3 className="text-center text-2xl font-black uppercase tracking-[0.08em] text-slate-900">
            Trending Collection
          </h3>
          <div className="mt-3 flex flex-wrap items-center justify-center gap-2">
            {aboFilterCategories.map((item) => {
              const isAll = item === "All";
              const isActive = isAll ? !activeCategory : activeCategory === item;
              const href = isAll
                ? `/?${activeSearch ? `search=${slugify(activeSearch)}` : ""}`.replace(/\?$/, "")
                : `/?category=${slugify(item)}${activeSearch ? `&search=${slugify(activeSearch)}` : ""}`;
              return (
                <Link
                  key={item}
                  href={href}
                  className={`rounded-full border px-4 py-2 text-xs font-bold uppercase tracking-[0.1em] transition ${
                    isActive
                      ? "border-slate-900 bg-slate-900 text-white"
                      : "border-slate-300 bg-white text-slate-700 hover:border-slate-900 hover:text-slate-900"
                  }`}
                >
                  {item}
                </Link>
              );
            })}
          </div>
        </div>
      ) : null}

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

      {isAbo ? (
        <section className="rounded-3xl border border-slate-200 bg-slate-50 px-4 py-8 text-center sm:px-6">
          <h3 className="text-2xl font-extrabold text-slate-900">Join The ABO VIP Club</h3>
          <p className="mx-auto mt-2 max-w-2xl text-sm text-slate-600">
            Get special offers, free giveaways and early access to exclusive premium drops.
          </p>
          <form
            onSubmit={(e) => e.preventDefault()}
            className="mx-auto mt-5 grid max-w-2xl gap-2 sm:grid-cols-[1fr_auto]"
          >
            <input
              type="email"
              placeholder="Enter your email"
              className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-800 outline-none focus:border-slate-500 focus:ring-2 focus:ring-slate-200"
            />
            <button
              type="submit"
              className="rounded-xl bg-slate-900 px-5 py-3 text-sm font-bold text-white transition hover:bg-amber-400 hover:text-slate-900"
            >
              Subscribe
            </button>
          </form>
        </section>
      ) : null}
    </section>
  );
}
