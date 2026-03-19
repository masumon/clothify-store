"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import AppIcon from "@/components/AppIcon";
import ProductCard from "@/components/ProductCard";
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
  storeName: string;
  slogan: string;
  logoUrl?: string;
};

function slugify(value: string) {
  return encodeURIComponent(value.trim());
}

type PromoAd = {
  id: string;
  eyebrow: string;
  title: string;
  description: string;
  toneClassName: string;
};

export default function UpazilaHomepageV2({
  products,
  categories,
  activeCategory,
  activeSearch,
  whatsappNumber,
  storeName,
  slogan,
  logoUrl = "",
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
  const logoSrc = logoUrl || "/icons/icon-192.png";

  const heroFocusKeywords = /panjabi|kabli|shirt|t-shirt|polo|pant|trouser|jeans/i;
  const heroProducts = products
    .filter((product) => heroFocusKeywords.test(`${product.name} ${product.category}`))
    .slice(0, 4);
  const heroShowcase = heroProducts.length > 0 ? heroProducts : products.slice(0, 4);
  const leadProduct = heroShowcase[0];
  const sideProducts = heroShowcase.slice(1, 4);

  const featured = products.filter((product) => product.is_featured).slice(0, 6);
  const newArrival = products.slice(0, 9);
  const bestSelling = (featured.length > 0 ? featured : products).slice(0, 9);
  const panjabiCollection = products
    .filter((product) => /panjabi|kabli|ethnic/i.test(product.category || ""))
    .slice(0, 9);
  const casualShirtCollection = products
    .filter((product) => /casual shirt|shirt|polo|t-shirt/i.test(product.category || ""))
    .slice(0, 9);
  const trending = products
    .filter((product) => product.campaign_badge || product.has_video)
    .slice(0, 9);

  const topCategories = categories.slice(0, 8);
  const filterCategories = ["All", ...categories.slice(0, 4)];
  const hasBrowseContext = Boolean(activeCategory || activeSearch);

  const promoAds: PromoAd[] = useMemo(
    () => [
      {
        id: "shirt-pair",
        eyebrow: isBn ? "হট অফার" : "Hot Offer",
        title: isBn ? "দুইটি শার্টে সাশ্রয়" : "Buy 2 Shirts, Save More",
        description: isBn
          ? "স্টুডেন্ট-ফ্রেন্ডলি bundle, limited stock."
          : "Student-friendly bundle with limited stock.",
        toneClassName: "border-amber-200 bg-amber-50/90 text-amber-950",
      },
      {
        id: "festival-bundle",
        eyebrow: isBn ? "ফেস্টিভ bundle" : "Festival Bundle",
        title: isBn ? "পাঞ্জাবি + পায়জামা কম্বো" : "Panjabi + Pajama Set",
        description: isBn
          ? "ঈদ, জুম্মা আর special occasion-এর ready look."
          : "Ready-to-wear pairing for Eid, Jummah, and events.",
        toneClassName: "border-emerald-200 bg-emerald-50/90 text-emerald-950",
      },
      {
        id: "fast-delivery",
        eyebrow: isBn ? "ফাস্ট ডেলিভারি" : "Fast Delivery",
        title: isBn ? "অর্ডার করুন, দ্রুত পৌঁছে যাবে" : "Quick checkout, faster dispatch",
        description: isBn
          ? "Sylhet-first support, trusted payment and easy follow-up."
          : "Sylhet-first support, trusted payment, and smooth follow-up.",
        toneClassName: "border-cyan-200 bg-cyan-50/90 text-cyan-950",
      },
    ],
    [isBn]
  );

  const highlightPoints = [
    {
      icon: "truck" as const,
      title: isBn ? "দ্রুত ডেলিভারি" : "Fast delivery",
      text: isBn ? "উপজেলা ও জেলা ভিত্তিক কভারেজ" : "District and upazila-ready delivery",
    },
    {
      icon: "wallet" as const,
      title: isBn ? "নিরাপদ পেমেন্ট" : "Secure payment",
      text: isBn ? "bKash, Nagad, COD support" : "bKash, Nagad, and COD support",
    },
    {
      icon: "support" as const,
      title: isBn ? "রিয়েল সাপোর্ট" : "Real support",
      text: isBn ? "অর্ডার, সাইজ, পেমেন্টে সাহায্য" : "Help with size, order, and payment",
    },
  ];

  const heroTitle = isBn
    ? "স্মার্ট মেন্সওয়্যার, সহজে বেছে নিন"
    : "Modern menswear, easy to choose";
  const heroSubtitle = isBn
    ? "Minimal layout, পরিষ্কার তথ্য, এবং দ্রুত অর্ডার flow - যাতে visitor ঢুকেই পণ্য দেখতে পারে।"
    : "A cleaner, product-first layout with faster decisions, clearer trust signals, and smoother checkout.";

  const heroAccentClass = isAbo
    ? "from-slate-950 via-slate-900 to-slate-800 text-white"
    : "from-teal-950 via-slate-900 to-sky-900 text-white";
  const heroBadgeClass = isAbo
    ? "border-amber-300/30 bg-amber-300/10 text-amber-200"
    : "border-cyan-300/30 bg-cyan-300/10 text-cyan-100";
  const primaryButtonClass = isAbo
    ? "bg-white text-slate-950 hover:bg-amber-300 hover:text-slate-950"
    : "bg-white text-slate-950 hover:bg-cyan-100 hover:text-slate-950";
  const secondaryButtonClass = isAbo
    ? "border-white/20 bg-white/10 text-white hover:bg-white/16"
    : "border-white/15 bg-white/10 text-white hover:bg-white/18";

  return (
    <section className="space-y-8 sm:space-y-10">
      <section
        className={`relative overflow-hidden rounded-[32px] border border-white/10 bg-gradient-to-br ${heroAccentClass} px-4 py-5 shadow-[0_24px_60px_-34px_rgba(2,6,23,0.75)] sm:px-6 sm:py-7 lg:px-8`}
      >
        <div className="absolute -left-20 top-0 h-52 w-52 rounded-full bg-white/10 blur-3xl" />
        <div className="absolute -right-20 bottom-0 h-64 w-64 rounded-full bg-amber-300/10 blur-3xl" />

        <div className="relative grid gap-6 xl:grid-cols-[1.05fr_0.95fr] xl:items-center">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-3 rounded-full border border-white/10 bg-white/10 px-3 py-2 backdrop-blur">
              <Image
                src={logoSrc}
                alt={storeName}
                width={38}
                height={38}
                className="h-9 w-9 rounded-full border border-white/20 object-cover"
              />
              <div className="min-w-0">
                <p className="truncate text-sm font-black tracking-[0.08em] text-white">{storeName}</p>
                <p className="truncate text-[11px] font-medium text-white/70">{slogan}</p>
              </div>
            </div>

            <div className={`mt-4 inline-flex rounded-full border px-3 py-1 text-[11px] font-bold uppercase tracking-[0.22em] ${heroBadgeClass}`}>
              {isBn ? "প্রিমিয়াম পুরুষদের কালেকশন" : "Premium menswear collection"}
            </div>

            <h2 className="mt-4 max-w-xl text-3xl font-black leading-tight tracking-tight text-white sm:text-4xl lg:text-[3.25rem]">
              {heroTitle}
            </h2>

            <p className="mt-4 max-w-xl text-sm leading-7 text-slate-200 sm:text-base">{heroSubtitle}</p>

            <div className="mt-5 grid gap-2 sm:grid-cols-3">
              {highlightPoints.map((item) => (
                <div
                  key={item.title}
                  className="rounded-2xl border border-white/10 bg-white/10 px-3 py-3 backdrop-blur"
                >
                  <div className="inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-white/12 text-white">
                    <AppIcon name={item.icon} className="h-4.5 w-4.5" />
                  </div>
                  <p className="mt-3 text-sm font-bold text-white">{item.title}</p>
                  <p className="mt-1 text-xs leading-5 text-slate-200">{item.text}</p>
                </div>
              ))}
            </div>

            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <Link
                href="#new-arrival"
                className={`inline-flex items-center justify-center gap-2 rounded-full px-6 py-3 text-sm font-extrabold transition ${primaryButtonClass}`}
              >
                <AppIcon name="store" className="h-4.5 w-4.5" />
                {isBn ? "এখনই পণ্য দেখুন" : "Explore products"}
              </Link>
              <Link
                href="/checkout"
                className={`inline-flex items-center justify-center gap-2 rounded-full border px-6 py-3 text-sm font-semibold transition ${secondaryButtonClass}`}
              >
                <AppIcon name="lock" className="h-4.5 w-4.5" />
                {isBn ? "সুরক্ষিত চেকআউট" : "Secure checkout"}
              </Link>
            </div>
          </div>

          <div className="rounded-[28px] border border-white/10 bg-white/10 p-3 shadow-[0_22px_50px_-34px_rgba(0,0,0,0.8)] backdrop-blur-md sm:p-4">
            {leadProduct ? (
              <div className="grid gap-3 sm:grid-cols-[1.1fr_0.9fr]">
                <Link
                  href={`/product/${leadProduct.id}`}
                  className="group overflow-hidden rounded-[24px] border border-white/10 bg-slate-950/30"
                >
                  <div className="relative h-64 overflow-hidden sm:h-full sm:min-h-[330px]">
                    <Image
                      src={leadProduct.image_url || "/hero-modern-fashion.svg"}
                      alt={leadProduct.name}
                      fill
                      sizes="(max-width: 640px) 90vw, (max-width: 1280px) 48vw, 32vw"
                      className="object-cover transition duration-500 group-hover:scale-105"
                    />
                  </div>
                </Link>

                <div className="flex flex-col gap-3">
                  <div className="rounded-[24px] border border-white/10 bg-slate-950/35 p-4">
                    <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-white/55">
                      {isBn ? "Featured look" : "Featured look"}
                    </p>
                    <h3 className="mt-2 text-xl font-black text-white">{leadProduct.name}</h3>
                    <p className="mt-1 text-sm text-slate-300">{leadProduct.category}</p>
                    <p className="mt-4 text-2xl font-black text-white">৳{leadProduct.price}</p>
                    <p className="mt-2 text-xs leading-5 text-slate-300">
                      {isBn
                        ? "পণ্য, দাম, সাপোর্ট এবং checkout flow সবকিছু পরিষ্কারভাবে দেখুন।"
                        : "See product, pricing, and support details in one clean flow."}
                    </p>
                  </div>

                  <div className="grid gap-3 sm:grid-cols-1">
                    {sideProducts.map((product) => (
                      <Link
                        key={product.id}
                        href={`/product/${product.id}`}
                        className="flex items-center gap-3 rounded-[22px] border border-white/10 bg-slate-950/35 p-3 transition hover:bg-slate-950/45"
                      >
                        <Image
                          src={product.image_url || "/hero-modern-fashion.svg"}
                          alt={product.name}
                          width={84}
                          height={84}
                          className="h-20 w-20 rounded-2xl object-cover"
                        />
                        <div className="min-w-0">
                          <p className="line-clamp-2 text-sm font-bold text-white">{product.name}</p>
                          <p className="mt-1 text-xs text-slate-300">{product.category}</p>
                          <p className="mt-2 text-sm font-bold text-amber-200">৳{product.price}</p>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <div className="rounded-[24px] border border-dashed border-white/15 bg-slate-950/20 px-4 py-10 text-center text-sm text-slate-200">
                {isBn
                  ? "পণ্য যোগ হলে hero showcase এখানে অটোমেটিক দেখাবে।"
                  : "Hero showcase will auto-populate after products are uploaded."}
              </div>
            )}
          </div>
        </div>
      </section>

      <div className="grid gap-3 md:grid-cols-3">
        {promoAds.map((ad) => (
          <article
            key={ad.id}
            className={`rounded-[24px] border px-4 py-4 shadow-[0_14px_34px_-28px_rgba(2,6,23,0.45)] ${ad.toneClassName}`}
          >
            <p className="text-[11px] font-bold uppercase tracking-[0.18em] opacity-75">{ad.eyebrow}</p>
            <h3 className="mt-2 text-lg font-black tracking-tight">{ad.title}</h3>
            <p className="mt-1 text-sm leading-6 opacity-80">{ad.description}</p>
          </article>
        ))}
      </div>

      {hasBrowseContext ? (
        <section className="surface-card p-4 sm:p-5">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.16em] text-slate-500">
                {isBn ? "বর্তমান ব্রাউজ অবস্থা" : "Current browse state"}
              </p>
              <h3 className="mt-1 text-xl font-black tracking-tight text-slate-900">
                {isBn ? "ফিল্টার করা ফলাফল" : "Filtered results"}
              </h3>
            </div>
            <Link
              href="/"
              className="inline-flex items-center gap-2 rounded-full border border-slate-300 bg-white px-4 py-2 text-xs font-semibold uppercase tracking-[0.12em] text-slate-700 transition hover:bg-slate-50"
            >
              <AppIcon name="close" className="h-4 w-4" />
              {isBn ? "সব রিসেট" : "Reset all"}
            </Link>
          </div>

          <div className="mt-4 flex flex-wrap gap-2">
            {activeCategory ? (
              <span className="inline-flex items-center gap-2 rounded-full border border-teal-200 bg-teal-50 px-3 py-1.5 text-xs font-semibold text-teal-800">
                <AppIcon name="categories" className="h-4 w-4" />
                {isBn ? "ক্যাটাগরি" : "Category"}: {activeCategory}
              </span>
            ) : null}
            {activeSearch ? (
              <span className="inline-flex items-center gap-2 rounded-full border border-cyan-200 bg-cyan-50 px-3 py-1.5 text-xs font-semibold text-cyan-800">
                <AppIcon name="search" className="h-4 w-4" />
                {isBn ? "সার্চ" : "Search"}: {activeSearch}
              </span>
            ) : null}
            <span className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-semibold text-slate-700">
              <AppIcon name="packageOpen" className="h-4 w-4" />
              {products.length} {isBn ? "টি পণ্য" : "items found"}
            </span>
          </div>
        </section>
      ) : null}

      <section className="surface-card p-4 sm:p-5">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-slate-500">
              {isBn ? "ব্রাউজ শর্টকাট" : "Browse shortcuts"}
            </p>
            <h3 className="mt-1 text-2xl font-black tracking-tight text-slate-900">
              {isBn ? "দ্রুত ক্যাটাগরি বেছে নিন" : "Jump into your category"}
            </h3>
          </div>

          <div className="flex flex-wrap gap-2">
            {filterCategories.map((item) => {
              const isAll = item === "All";
              const isActive = isAll ? !activeCategory : activeCategory === item;
              const href = isAll
                ? `/?${activeSearch ? `search=${slugify(activeSearch)}` : ""}`.replace(/\?$/, "")
                : `/?category=${slugify(item)}${activeSearch ? `&search=${slugify(activeSearch)}` : ""}`;
              return (
                <Link
                  key={item}
                  href={href}
                  className={`rounded-full border px-4 py-2 text-xs font-bold uppercase tracking-[0.12em] transition ${
                    isActive
                      ? isAbo
                        ? "border-slate-950 bg-slate-950 text-amber-300"
                        : "border-teal-700 bg-teal-700 text-white"
                      : "border-slate-300 bg-white text-slate-700 hover:border-slate-400 hover:bg-slate-50"
                  }`}
                >
                  {item}
                </Link>
              );
            })}
          </div>
        </div>

        <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4 xl:grid-cols-8">
          {topCategories.map((category) => (
            <Link
              key={category}
              href={`/?category=${slugify(category)}${activeSearch ? `&search=${slugify(activeSearch)}` : ""}`}
              title={category}
              className={`rounded-[20px] border px-3 py-3 transition ${
                activeCategory === category
                  ? "border-teal-600 bg-teal-50 text-teal-900"
                  : "border-slate-200 bg-white text-slate-700 hover:-translate-y-0.5 hover:border-slate-300 hover:bg-slate-50"
              }`}
            >
              <p className="text-xs font-bold uppercase tracking-[0.15em] text-slate-400">
                {isBn ? "ক্যাটাগরি" : "Category"}
              </p>
              <p className="mt-2 line-clamp-2 text-sm font-bold text-inherit">{category}</p>
            </Link>
          ))}
        </div>
      </section>

      <section id="new-arrival" className="space-y-4">
        <SectionHeader
          icon={<AppIcon name="shirt" className="h-5 w-5" />}
          title={isBn ? "নতুন আগমন" : "New arrival"}
          subtitle={
            isBn
              ? "নতুন যোগ হওয়া পণ্যগুলো আগে দেখুন এবং দ্রুত অর্ডার করুন।"
              : "Fresh additions to the catalog, ready for quick browsing and checkout."
          }
          rightText={`${newArrival.length} item`}
        />
        <div className="grid grid-cols-2 gap-3 md:grid-cols-3">
          {newArrival.map((product) => (
            <ProductCard key={product.id} product={product} whatsappNumber={safeWhatsApp} />
          ))}
        </div>
      </section>

      <section className="space-y-4">
        <SectionHeader
          icon={<AppIcon name="offers" className="h-5 w-5" />}
          title={isBn ? "সবচেয়ে বিক্রিত" : "Best selling"}
          subtitle={
            isBn
              ? "সবচেয়ে বেশি দেখা ও কেনা পণ্যগুলো একসাথে।"
              : "Your top-performing styles, grouped for faster decisions."
          }
          rightText={`${bestSelling.length} item`}
        />
        <div className="grid grid-cols-2 gap-3 md:grid-cols-3">
          {bestSelling.map((product) => (
            <ProductCard key={product.id} product={product} whatsappNumber={safeWhatsApp} />
          ))}
        </div>
      </section>

      <section className="space-y-4">
        <SectionHeader
          icon={<AppIcon name="store" className="h-5 w-5" />}
          title={isBn ? "পাঞ্জাবি কালেকশন" : "Panjabi collection"}
          subtitle={
            isBn
              ? "ঈদ, জুম্মা, দাওয়াত আর special occasion-এর জন্য curated looks।"
              : "Curated traditional looks for Eid, Jummah, and special occasions."
          }
          rightText={`${panjabiCollection.length} item`}
        />
        <div className="grid grid-cols-2 gap-3 md:grid-cols-3">
          {panjabiCollection.map((product) => (
            <ProductCard key={product.id} product={product} whatsappNumber={safeWhatsApp} />
          ))}
        </div>
      </section>

      <section className="space-y-4">
        <SectionHeader
          icon={<AppIcon name="categories" className="h-5 w-5" />}
          title={isBn ? "শার্ট ও ক্যাজুয়াল কালেকশন" : "Shirt and casual collection"}
          subtitle={
            isBn
              ? "ক্যাম্পাস, outing এবং daily wear-এর জন্য clean smart picks।"
              : "Clean, smart picks for campus, outing, and everyday wear."
          }
          rightText={`${casualShirtCollection.length} item`}
        />
        <div className="grid grid-cols-2 gap-3 md:grid-cols-3">
          {casualShirtCollection.map((product) => (
            <ProductCard key={product.id} product={product} whatsappNumber={safeWhatsApp} />
          ))}
        </div>
      </section>

      {trending.length > 0 ? (
        <section className="space-y-4">
          <SectionHeader
            icon={<AppIcon name="chart" className="h-5 w-5" />}
            title={isBn ? "এখন ট্রেন্ডিং" : "Trending now"}
            subtitle={
              isBn
                ? "ক্যাম্পেইন, reel এবং visitor interest থেকে picked items।"
                : "Items currently boosted by campaigns, reels, and visitor interest."
            }
            rightText={`${trending.length} item`}
          />
          <div className="grid grid-cols-2 gap-3 md:grid-cols-3">
            {trending.map((product) => (
              <ProductCard key={product.id} product={product} whatsappNumber={safeWhatsApp} />
            ))}
          </div>
        </section>
      ) : null}

      {isAbo ? (
        <section className="rounded-[32px] border border-slate-200 bg-white px-4 py-8 shadow-[0_20px_50px_-38px_rgba(2,6,23,0.55)] sm:px-6">
          <div className="mx-auto max-w-3xl text-center">
            <div className="mx-auto inline-flex items-center gap-3 rounded-full border border-slate-200 bg-slate-50 px-3 py-2">
              <Image
                src={logoSrc}
                alt={storeName}
                width={34}
                height={34}
                className="h-8 w-8 rounded-full border border-slate-200 object-cover"
              />
              <span className="text-sm font-bold text-slate-900">{storeName}</span>
            </div>
            <h3 className="mt-4 text-3xl font-black tracking-tight text-slate-900">
              {isBn ? `${storeName} Insider Club` : `Join the ${storeName} Insider Club`}
            </h3>
            <p className="mx-auto mt-2 max-w-2xl text-sm leading-7 text-slate-600">
              {isBn
                ? "নতুন premium drop, early offer, আর best-value combination আগে পেতে email দিন।"
                : "Get early access to premium drops, offers, and best-value combinations."}
            </p>
            <form
              onSubmit={(event) => event.preventDefault()}
              className="mx-auto mt-5 grid max-w-2xl gap-2 sm:grid-cols-[1fr_auto]"
            >
              <input
                type="email"
                placeholder={isBn ? "আপনার ইমেইল লিখুন" : "Enter your email"}
                className="w-full rounded-2xl border border-slate-300 bg-slate-50 px-4 py-3 text-sm text-slate-800 outline-none focus:border-slate-500 focus:ring-2 focus:ring-slate-200"
              />
              <button
                type="submit"
                className="rounded-2xl bg-slate-950 px-5 py-3 text-sm font-bold text-white transition hover:bg-amber-400 hover:text-slate-950"
              >
                {isBn ? "সাবস্ক্রাইব" : "Subscribe"}
              </button>
            </form>
          </div>
        </section>
      ) : null}
    </section>
  );
}
