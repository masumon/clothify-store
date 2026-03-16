import Header from "@/components/Header";
import Footer from "@/components/Footer";
import MobileStickyBar from "@/components/MobileStickyBar";
import SitePreferencesBar from "@/components/SitePreferencesBar";
import Link from "next/link";
import { getStoreSettings } from "@/lib/data";

export const dynamic = "force-dynamic";

export default async function SettingsPage() {
  const settings = await getStoreSettings();

  return (
    <main className="pb-24 md:pb-0">
      <Header
        storeName={settings?.store_name || "Clothify"}
        slogan={settings?.slogan || "Find Your Fit"}
        logoUrl={settings?.logo_url || ""}
      />

      <section className="mx-auto max-w-3xl px-4 py-8 sm:py-10">
        <div className="mb-6 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
            User Settings
          </p>
          <h1 className="mt-2 text-2xl font-bold text-slate-900 sm:text-3xl">
            আপনার পছন্দমত সেটিংস
          </h1>
          <p className="mt-2 text-sm leading-6 text-slate-600 sm:text-base">
            থিম, ভাষা, লেখার আকার এবং হাই কনট্রাস্ট মোড পরিবর্তন করুন।
            আপনার পছন্দ browser-এ সেভ থাকবে।
          </p>
        </div>

        <SitePreferencesBar />

        <div className="mt-6 grid gap-3 sm:grid-cols-2">
          <Link
            href="/"
            className="inline-flex items-center justify-center rounded-2xl border border-slate-300 bg-white px-5 py-3 text-sm font-semibold text-slate-800 transition hover:bg-slate-50"
          >
            🏠 হোমে ফিরে যান
          </Link>
          <Link
            href="/checkout"
            className="inline-flex items-center justify-center rounded-2xl bg-green-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-green-700"
          >
            ✅ অর্ডার করতে যান
          </Link>
        </div>
      </section>

      <Footer
        storeName={settings?.store_name || "Clothify"}
        address={settings?.address || ""}
        phone={settings?.contact_phone || ""}
      />

      <MobileStickyBar />
    </main>
  );
}
