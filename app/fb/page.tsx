"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";

export default function FacebookLandingPage() {
  const [settings, setSettings] = useState<any>(null);
  const [products, setProducts] = useState<any[]>([]);
  const [uiLang, setUiLang] = useState<"en" | "bn">("bn");
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    // Fetch data
    Promise.all([
      fetch("/api/settings").then((r) => (r.ok ? r.json() : {})),
      fetch("/api/products").then((r) => (r.ok ? r.json() : [])),
    ])
      .then(([settingsData, productsData]) => {
        setSettings(settingsData);
        setProducts(productsData);
      })
      .catch((err) => console.error("Failed to load data:", err));

    // Initialize preferences
    const savedLang = localStorage.getItem("clothfy-lang") || localStorage.getItem("clothify-language");
    if (savedLang === "en" || savedLang === "bn") {
      setUiLang(savedLang);
    }

    const savedTheme = localStorage.getItem("clothfy-theme") || localStorage.getItem("clothify-theme") || "system";
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    const shouldUseDark = savedTheme === "dark" || (savedTheme === "system" && prefersDark);
    setIsDarkMode(shouldUseDark);
    document.documentElement.classList.toggle("dark-theme", shouldUseDark);
  }, []);

  const toggleLanguage = () => {
    const nextLang: "en" | "bn" = uiLang === "bn" ? "en" : "bn";
    setUiLang(nextLang);
    localStorage.setItem("clothfy-lang", nextLang);
    localStorage.setItem("clothify-language", nextLang);
    document.documentElement.lang = nextLang;
  };

  const toggleTheme = () => {
    const nextDark = !isDarkMode;
    setIsDarkMode(nextDark);
    localStorage.setItem("clothfy-theme", nextDark ? "dark" : "light");
    localStorage.setItem("clothify-theme", nextDark ? "dark" : "light");
    document.documentElement.classList.toggle("dark-theme", nextDark);
  };

  const storeName = settings?.store_name || "Clothify";
  const whatsappRaw = settings?.whatsapp_number || "01811314262";
  const waNumber = whatsappRaw.replace(/\D/g, "").replace(/^0/, "88");
  const waLink = `https://wa.me/${waNumber}?text=${encodeURIComponent(
    "আস্সালামু আলাইকুম! আমি Clothify থেকে পোশাক অর্ডার করতে চাই। 🛍️"
  )}`;

  const featuredProducts = products.slice(0, 6);
  const isBn = uiLang === "bn";

  return (
    <main className="min-h-screen bg-slate-100">
      {/* Top controls bar */}
      <div className="sticky top-0 z-50 flex items-center justify-between border-b border-white/70 bg-white/80 px-4 py-2 backdrop-blur-xl">
        <Link
          href="/"
          className="inline-flex items-center gap-2 rounded-full border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-100"
        >
          ← {isBn ? "ড্যাশবোর্ডে ফিরুন" : "Back to Dashboard"}
        </Link>
        <div className="flex items-center gap-2">
          <button
            onClick={toggleLanguage}
            className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-slate-300 bg-white text-base text-slate-700 transition hover:bg-slate-100"
            aria-label="Toggle language"
            title={uiLang === "bn" ? "Switch to English" : "বাংলায় পরিবর্তন করুন"}
          >
            🌐
          </button>
          <button
            onClick={toggleTheme}
            className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-slate-300 bg-white text-base text-slate-700 transition hover:bg-slate-100"
            aria-label="Toggle dark mode"
            title="Toggle dark mode"
          >
            <span className="text-base leading-none">{isDarkMode ? "☀️" : "🌙"}</span>
          </button>
        </div>
      </div>

      <div className="bg-[#0F172A] px-4 py-2 text-center text-xs font-semibold uppercase tracking-[0.18em] text-amber-200">
        {isBn ? "ফ্ল্যাশ ক্যাম্পেইন | প্রিমিয়াম ঈদ স্টাইল | সীমিত স্টক" : "Flash Campaign | Premium Eid Styles | Limited Stock"}
      </div>

      <section className="relative overflow-hidden bg-gradient-to-br from-[#0F172A] via-slate-900 to-slate-700 px-5 pb-14 pt-10 text-white sm:pt-14">
        <div className="absolute -left-16 top-0 h-56 w-56 rounded-full bg-amber-400/20 blur-3xl" />
        <div className="absolute right-0 top-10 h-64 w-64 rounded-full bg-cyan-400/20 blur-3xl" />

        <div className="relative mx-auto grid max-w-6xl gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
          <div>
            <div className="mb-4 flex flex-wrap items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-white/75">
              <span className="rounded-full border border-white/25 bg-white/10 px-3 py-1">
                🛍️ {isBn ? "ল্যান্ডিং পেজ" : "Landing Page"}
              </span>
              <span className="rounded-full border border-white/25 bg-white/10 px-3 py-1">
                🌙 {isBn ? "ঈদ স্পেশাল" : "Eid Special"}
              </span>
            </div>

            <h1 className="text-4xl font-extrabold leading-tight sm:text-5xl">
              {isBn ? "প্রিমিয়াম মেন্সওয়্যার" : "Premium Menswear"}
              <span className="block text-amber-200">{isBn ? "আপনার ফিট খুঁজুন" : "Find Your Fit"}</span>
            </h1>

            <p className="mt-4 max-w-xl text-sm leading-7 text-slate-100 sm:text-base">
              {isBn
                ? "সোশ্যাল অ্যাড ভিজিটরদের জন্য অপটিমাইজড চেকআউট: বিশ্বস্ত পণ্য, দ্রুত অর্ডার, হোয়াটসঅ্যাপ সাপোর্ট এবং সহজ পেমেন্ট গাইড।"
                : "Optimized checkout journey for social ad visitors: trusted products, fast order, WhatsApp support, and simple payment guide."}
            </p>

            <div className="mt-6 flex flex-wrap gap-2 text-xs font-semibold">
              <span className="rounded-full bg-white/10 px-3 py-1">⭐ {isBn ? "৪.৮ রেটিং" : "4.8 Rating"}</span>
              <span className="rounded-full bg-white/10 px-3 py-1">🚚 {isBn ? "দ্রুত ডেলিভারি" : "Fast Delivery"}</span>
              <span className="rounded-full bg-white/10 px-3 py-1">💳 {isBn ? "বিকাশ + ক্যাশ অন ডেলিভারি" : "bKash + COD"}</span>
            </div>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/checkout"
                className="inline-flex items-center justify-center gap-2 rounded-full bg-amber-400 px-6 py-3 text-sm font-extrabold text-slate-900 transition hover:bg-amber-300"
              >
                ✅ {isBn ? "এখনই অর্ডার করুন" : "Order Now"}
              </Link>
              <a
                href={waLink}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center justify-center gap-2 rounded-full border border-white/40 bg-white/10 px-6 py-3 text-sm font-extrabold text-white transition hover:bg-white/20"
              >
                💬 {isBn ? "হোয়াটসঅ্যাপ চ্যাট" : "WhatsApp Chat"}
              </a>
              <Link
                href="/"
                className="inline-flex items-center justify-center gap-2 rounded-full border border-slate-400 bg-slate-800/50 px-6 py-3 text-sm font-bold text-slate-100 transition hover:bg-slate-700"
              >
                🧥 {isBn ? "সব পণ্য দেখুন" : "Browse All Products"}
              </Link>
            </div>
          </div>

          <div className="rounded-3xl border border-white/15 bg-white/10 p-4 backdrop-blur">
            <h2 className="text-lg font-bold">{isBn ? "দ্রুত বিশ্বাসযোগ্যতার স্ন্যাপশট" : "Quick Trust Snapshot"}</h2>
            <div className="mt-4 grid grid-cols-2 gap-3">
              {[
                { icon: "🛡️", label: isBn ? "বিশ্বস্ত চেকআউট" : "Trusted Checkout" },
                { icon: "⚡", label: isBn ? "তাৎক্ষণিক সহায়তা" : "Instant Support" },
                { icon: "📦", label: isBn ? "অর্ডার ট্র্যাকিং" : "Order Tracking" },
                { icon: "🎯", label: isBn ? "ফিট-ফোকাসড স্টাইল" : "Fit-Focused Styles" },
              ].map((item) => (
                <div key={item.label} className="rounded-2xl border border-white/15 bg-black/20 p-3 text-sm">
                  <p className="text-xl">{item.icon}</p>
                  <p className="mt-1 font-semibold text-white/90">{item.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-5 py-10">
        <div className="mb-6 flex items-end justify-between gap-3">
          <div>
            <h2 className="text-2xl font-extrabold text-slate-900 sm:text-3xl">
              🔥 {isBn ? "ট্রেন্ডিং পিকস" : "Trending Picks"}
            </h2>
            <p className="mt-1 text-sm text-slate-600">
              {isBn ? "সোশ্যাল ভিজিটরদের জন্য কিউরেটেড সেরা বিক্রিত পণ্য।" : "Top-selling products curated for social visitors."}
            </p>
          </div>
          <Link href="/" className="text-sm font-semibold text-slate-700 underline underline-offset-2">
            {isBn ? "সম্পূর্ণ ক্যাটালগ দেখুন" : "View full catalog"}
          </Link>
        </div>

        {featuredProducts.length === 0 ? (
          <div className="rounded-2xl border border-slate-200 bg-white p-10 text-center">
            <p className="font-bold text-slate-700">{isBn ? "পণ্য লোড হচ্ছে..." : "Products are loading..."}</p>
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {featuredProducts.map((product: any) => (
              <article
                key={product.id}
                className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
              >
                {product.image_url ? (
                  <Link href={`/product/${product.id}`}>
                    <Image
                      src={product.image_url}
                      alt={product.name}
                      width={500}
                      height={380}
                      className="h-56 w-full object-cover"
                    />
                  </Link>
                ) : null}
                <div className="p-4">
                  <p className="line-clamp-2 text-base font-bold text-slate-900">{product.name}</p>
                  <p className="mt-1 text-xl font-extrabold text-emerald-700">৳{product.price}</p>
                  <div className="mt-3 grid grid-cols-2 gap-2">
                    <Link
                      href={`/product/${product.id}`}
                      className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-center text-sm font-semibold text-slate-700"
                    >
                      👁️ {isBn ? "বিস্তারিত" : "Details"}
                    </Link>
                    <Link
                      href="/checkout"
                      className="rounded-xl bg-emerald-600 px-3 py-2 text-center text-sm font-bold text-white"
                    >
                      ✅ {isBn ? "অর্ডার" : "Order"}
                    </Link>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>

      <section className="bg-[#0F172A] px-5 py-10 text-center text-white">
        <h2 className="text-2xl font-extrabold">
          {isBn ? "সঠিক ফিট বাছাই করতে সাহায্য দরকার?" : "Need Help Choosing The Right Fit?"}
        </h2>
        <p className="mt-2 text-sm text-slate-300">
          {isBn
            ? "হোয়াটসঅ্যাপে আমাদের টিমের সাথে চ্যাট করুন অথবা সুরক্ষিত চেকআউটের মাধ্যমে চালিয়ে যান।"
            : "Chat with our team on WhatsApp or continue through secure checkout."}
        </p>
        <div className="mx-auto mt-6 flex max-w-xl flex-col gap-3 sm:flex-row">
          <a
            href={waLink}
            target="_blank"
            rel="noreferrer"
            className="inline-flex flex-1 items-center justify-center gap-2 rounded-full bg-emerald-500 px-6 py-3 text-sm font-extrabold text-white transition hover:bg-emerald-400"
          >
            💬 {isBn ? "হোয়াটসঅ্যাপ সাপোর্ট" : "WhatsApp Support"}
          </a>
          <Link
            href="/checkout"
            className="inline-flex flex-1 items-center justify-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-extrabold text-slate-900 transition hover:bg-slate-100"
          >
            ⚡ {isBn ? "দ্রুত চেকআউট" : "Quick Checkout"}
          </Link>
        </div>
        {settings?.address ? (
          <p className="mt-6 text-xs text-slate-400">📍 {settings.address}</p>
        ) : null}
        {settings?.contact_phone ? (
          <p className="mt-1 text-xs text-slate-400">☎️ {settings.contact_phone}</p>
        ) : null}
      </section>
    </main>
  );
}
