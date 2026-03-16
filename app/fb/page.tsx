import Link from "next/link";
import Image from "next/image";
import { getProducts, getStoreSettings } from "@/lib/data";
import type { Metadata } from "next";

export const dynamic = "force-dynamic";

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
    <main className="min-h-screen bg-slate-50">
      {/* ── TOP BANNER ────────────────────────────── */}
      <div className="bg-emerald-700 px-4 py-2 text-center text-sm font-semibold text-white">
        📢 ফেইসবুক বুস্ট অফার — সীমিত সময়ের জন্য বিশেষ ছাড়! 🌙
      </div>

      {/* ── HERO ──────────────────────────────────── */}
      <section className="bg-gradient-to-br from-emerald-900 via-green-800 to-emerald-600 px-5 py-14 text-center text-white sm:py-20">
        <p className="mb-3 inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/10 px-4 py-1.5 text-xs font-bold uppercase tracking-widest backdrop-blur">
          🌙 ঈদ কালেকশন ২০২৬
        </p>

        <h1 className="mt-3 text-4xl font-extrabold leading-tight sm:text-5xl">
          {storeName}
        </h1>

        <p className="mx-auto mt-4 max-w-lg text-lg font-semibold text-yellow-300 sm:text-xl">
          ঈদে সেরা পোশাক এখনই অর্ডার করুন!
        </p>

        <p className="mx-auto mt-3 max-w-md text-sm leading-7 text-white/85 sm:text-base">
          প্রিমিয়াম ফ্যাব্রিক · ঘরে বসে অর্ডার · দ্রুত ডেলিভারি · সহজ bKash
          পেমেন্ট
        </p>

        {/* BIG CTAs */}
        <div className="mx-auto mt-8 flex max-w-sm flex-col gap-4">
          <Link
            href="/checkout"
            className="flex items-center justify-center gap-3 rounded-2xl bg-white px-6 py-4 text-lg font-extrabold text-green-800 shadow-lg transition hover:bg-yellow-300"
          >
            ✅ এখনই অর্ডার করুন
          </Link>

          <a
            href={waLink}
            target="_blank"
            rel="noreferrer"
            className="flex items-center justify-center gap-3 rounded-2xl border-2 border-white/50 bg-white/10 px-6 py-4 text-lg font-extrabold text-white backdrop-blur transition hover:bg-white/20"
          >
            💬 WhatsApp এ অর্ডার করুন
          </a>
        </div>

        {/* scroll hint */}
        <p className="mt-8 text-xs text-white/60">
          👇 নিচে পণ্য দেখুন ও পছন্দের পোশাক বেছে নিন
        </p>
      </section>

      {/* ── WHY SHOP HERE ─────────────────────────── */}
      <section className="mx-auto max-w-2xl px-5 py-10">
        <h2 className="mb-6 text-center text-2xl font-extrabold text-slate-900">
          কেন Clothify থেকে কিনবেন?
        </h2>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          {[
            { icon: "🌙", text: "ঈদ স্পেশাল অফার" },
            { icon: "✅", text: "সহজ অর্ডার প্রক্রিয়া" },
            { icon: "🚀", text: "দ্রুত ডেলিভারি" },
            { icon: "💳", text: "bKash পেমেন্ট" },
          ].map((b) => (
            <div
              key={b.text}
              className="flex flex-col items-center gap-2 rounded-2xl border border-slate-200 bg-white p-4 text-center shadow-sm"
            >
              <span className="text-3xl">{b.icon}</span>
              <span className="text-sm font-bold text-slate-800">{b.text}</span>
            </div>
          ))}
        </div>
      </section>

      {/* ── PRODUCTS ──────────────────────────────── */}
      <section className="mx-auto max-w-2xl px-5 pb-10">
        <h2 className="mb-2 text-center text-2xl font-extrabold text-slate-900">
          🛍️ আমাদের পণ্য সমূহ
        </h2>
        <p className="mb-6 text-center text-sm text-slate-500">
          পছন্দের পণ্যটি বেছে নিন, বিস্তারিত দেখুন ও অর্ডার করুন
        </p>

        {featuredProducts.length === 0 ? (
          <div className="rounded-2xl border border-slate-200 bg-white p-10 text-center">
            <p className="font-bold text-slate-700">পণ্য লোড হচ্ছে...</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
            {featuredProducts.map((product: any) => (
              <div
                key={product.id}
                className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm"
              >
                {product.image_url && (
                  <Link href={`/product/${product.id}`}>
                    <Image
                      src={product.image_url}
                      alt={product.name}
                      width={300}
                      height={220}
                      className="h-44 w-full object-cover"
                    />
                  </Link>
                )}
                <div className="p-3">
                  <p className="line-clamp-2 text-sm font-bold leading-snug text-slate-900">
                    {product.name}
                  </p>
                  <p className="mt-1 text-lg font-extrabold text-green-700">
                    ৳{product.price}
                  </p>
                  <Link
                    href="/checkout"
                    className="mt-2 block rounded-xl bg-green-600 py-2 text-center text-sm font-bold text-white transition hover:bg-green-700"
                  >
                    ✅ অর্ডার করুন
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}

        {products.length > 6 && (
          <div className="mt-6 text-center">
            <Link
              href="/"
              className="inline-flex items-center gap-2 rounded-full bg-slate-900 px-8 py-3 text-sm font-bold text-white transition hover:bg-slate-700"
            >
              🛒 সব পণ্য দেখুন ({products.length}টি)
            </Link>
          </div>
        )}
      </section>

      {/* ── BOTTOM CTA ────────────────────────────── */}
      <section className="bg-emerald-800 px-5 py-10 text-center text-white">
        <h2 className="text-2xl font-extrabold">এখনই অর্ডার করুন!</h2>
        <p className="mt-2 text-sm text-white/80">
          সীমিত স্টক — তাড়াতাড়ি অর্ডার করুন
        </p>
        <div className="mx-auto mt-6 flex max-w-xs flex-col gap-4">
          <Link
            href="/checkout"
            className="rounded-2xl bg-white px-6 py-4 text-lg font-extrabold text-green-800 transition hover:bg-yellow-300"
          >
            ✅ checkout করুন
          </Link>
          <a
            href={waLink}
            target="_blank"
            rel="noreferrer"
            className="rounded-2xl border-2 border-white/50 bg-white/10 px-6 py-4 text-lg font-extrabold text-white transition hover:bg-white/20"
          >
            💬 WhatsApp করুন
          </a>
        </div>
        {settings?.address && (
          <p className="mt-8 text-xs text-white/60">
            📍 {settings.address}
          </p>
        )}
        {settings?.contact_phone && (
          <p className="mt-1 text-xs text-white/60">
            📞 {settings.contact_phone}
          </p>
        )}
        <p className="mt-6 text-xs text-white/40">© {storeName}</p>
      </section>
    </main>
  );
}
