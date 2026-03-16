import Link from "next/link";
import Image from "next/image";
import { getProducts, getStoreSettings } from "@/lib/data";
import type { Metadata } from "next";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "ফেইসবুক অফার — Clothify",
  description:
    "ঈদ স্পেশাল অফার চলছে! সেরা মানের পোশাক এখনই অর্ডার করুন। দ্রুত ডেলিভারি, সহজ bKash পেমেন্ট।",
  openGraph: {
    title: "🌙 ঈদ সেল চলছে! এখনই অর্ডার করুন — Clothify",
    description:
      "সেরা মানের পোশাক, সহজ অর্ডার, দ্রুত ডেলিভারি। এখনই কেনাকাটা করুন!",
    type: "website",
  },
};

export default async function FacebookLandingPage() {
  const settings = await getStoreSettings();
  const products = await getProducts();

  const storeName = settings?.store_name || "Clothify";
  const whatsappRaw = settings?.whatsapp_number || "01811314262";
  const waNumber = whatsappRaw.replace(/\D/g, "").replace(/^0/, "88");
  const waLink = `https://wa.me/${waNumber}?text=${encodeURIComponent(
    "আস্সালামু আলাইকুম! আমি Clothify থেকে পোশাক অর্ডার করতে চাই। 🛍️"
  )}`;

  const featuredProducts = products.slice(0, 6);

  return (
    <main className="min-h-screen bg-slate-100">
      <div className="bg-[#0F172A] px-4 py-2 text-center text-xs font-semibold uppercase tracking-[0.18em] text-amber-200">
        Flash Campaign | Premium Eid Styles | Limited Stock
      </div>

      <section className="relative overflow-hidden bg-gradient-to-br from-[#0F172A] via-slate-900 to-slate-700 px-5 pb-14 pt-10 text-white sm:pt-14">
        <div className="absolute -left-16 top-0 h-56 w-56 rounded-full bg-amber-400/20 blur-3xl" />
        <div className="absolute right-0 top-10 h-64 w-64 rounded-full bg-cyan-400/20 blur-3xl" />

        <div className="relative mx-auto grid max-w-6xl gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
          <div>
            <div className="mb-4 flex flex-wrap items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-white/75">
              <span className="rounded-full border border-white/25 bg-white/10 px-3 py-1">🛍️ Clothfy Landing</span>
              <span className="rounded-full border border-white/25 bg-white/10 px-3 py-1">🌙 Eid Special</span>
            </div>

            <h1 className="text-4xl font-extrabold leading-tight sm:text-5xl">
              Premium Menswear
              <span className="block text-amber-200">Find Your Fit</span>
            </h1>

            <p className="mt-4 max-w-xl text-sm leading-7 text-slate-100 sm:text-base">
              Social ad visitors এর জন্য optimized checkout journey: trusted products, fast order,
              WhatsApp support, এবং simple payment guide.
            </p>

            <div className="mt-6 flex flex-wrap gap-2 text-xs font-semibold">
              <span className="rounded-full bg-white/10 px-3 py-1">⭐ 4.8 Rating</span>
              <span className="rounded-full bg-white/10 px-3 py-1">🚚 Fast Delivery</span>
              <span className="rounded-full bg-white/10 px-3 py-1">💳 bKash + COD</span>
            </div>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/checkout"
                className="inline-flex items-center justify-center gap-2 rounded-full bg-amber-400 px-6 py-3 text-sm font-extrabold text-slate-900 transition hover:bg-amber-300"
              >
                ✅ Order Now
              </Link>
              <a
                href={waLink}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center justify-center gap-2 rounded-full border border-white/40 bg-white/10 px-6 py-3 text-sm font-extrabold text-white transition hover:bg-white/20"
              >
                💬 WhatsApp Chat
              </a>
              <Link
                href="/"
                className="inline-flex items-center justify-center gap-2 rounded-full border border-slate-400 bg-slate-800/50 px-6 py-3 text-sm font-bold text-slate-100 transition hover:bg-slate-700"
              >
                🧥 Browse All Products
              </Link>
            </div>
          </div>

          <div className="rounded-3xl border border-white/15 bg-white/10 p-4 backdrop-blur">
            <h2 className="text-lg font-bold">Quick Trust Snapshot</h2>
            <div className="mt-4 grid grid-cols-2 gap-3">
              {[
                { icon: "🛡️", label: "Trusted Checkout" },
                { icon: "⚡", label: "Instant Support" },
                { icon: "📦", label: "Order Tracking" },
                { icon: "🎯", label: "Fit-Focused Styles" },
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
            <h2 className="text-2xl font-extrabold text-slate-900 sm:text-3xl">🔥 Trending Picks</h2>
            <p className="mt-1 text-sm text-slate-600">Top-selling products curated for social visitors.</p>
          </div>
          <Link href="/" className="text-sm font-semibold text-slate-700 underline underline-offset-2">
            View full catalog
          </Link>
        </div>

        {featuredProducts.length === 0 ? (
          <div className="rounded-2xl border border-slate-200 bg-white p-10 text-center">
            <p className="font-bold text-slate-700">Products are loading...</p>
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
                      👁️ Details
                    </Link>
                    <Link
                      href="/checkout"
                      className="rounded-xl bg-emerald-600 px-3 py-2 text-center text-sm font-bold text-white"
                    >
                      ✅ Order
                    </Link>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>

      <section className="bg-[#0F172A] px-5 py-10 text-center text-white">
        <h2 className="text-2xl font-extrabold">Need Help Choosing The Right Fit?</h2>
        <p className="mt-2 text-sm text-slate-300">Chat with our team on WhatsApp or continue through secure checkout.</p>
        <div className="mx-auto mt-6 flex max-w-xl flex-col gap-3 sm:flex-row">
          <a
            href={waLink}
            target="_blank"
            rel="noreferrer"
            className="inline-flex flex-1 items-center justify-center gap-2 rounded-full bg-emerald-500 px-6 py-3 text-sm font-extrabold text-white transition hover:bg-emerald-400"
          >
            💬 WhatsApp Support
          </a>
          <Link
            href="/checkout"
            className="inline-flex flex-1 items-center justify-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-extrabold text-slate-900 transition hover:bg-slate-100"
          >
            ⚡ Quick Checkout
          </Link>
        </div>
        {settings?.address ? <p className="mt-6 text-xs text-slate-400">📍 {settings.address}</p> : null}
        {settings?.contact_phone ? <p className="mt-1 text-xs text-slate-400">☎️ {settings.contact_phone}</p> : null}
      </section>
    </main>
  );
}
