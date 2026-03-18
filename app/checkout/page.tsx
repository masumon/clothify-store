import Header from "@/components/Header";
import Image from "next/image";
import Link from "next/link";
import BottomNav from "@/components/BottomNav";
import CheckoutForm from "@/components/CheckoutForm";
import DeliveryCheck from "@/components/DeliveryCheck";
import CheckoutSummaryCard from "@/components/CheckoutSummaryCard";
import { getStoreSettings } from "@/lib/data";

export const revalidate = 60;

export default async function CheckoutPage() {
  const settings = await getStoreSettings();

  return (
    <main className="pb-20">
      <Header
        storeName={settings?.store_name || "Clothify"}
        slogan={settings?.slogan || "Find Your Fit"}
        logoUrl={settings?.logo_url || ""}
        whatsappNumber={settings?.whatsapp_number || "8801811314262"}
      />

      <section className="sticky top-[72px] z-30 border-b border-slate-200 bg-white/95 px-4 py-2 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-2 text-sm">
          <Link href="/" className="inline-flex items-center gap-1.5 font-semibold text-slate-700 hover:text-slate-900">
            <i className="fa-solid fa-arrow-left" aria-hidden="true" />
            Return to Shop
          </Link>
          <p className="inline-flex items-center gap-1.5 font-bold text-slate-900">
            <i className="fa-solid fa-lock" aria-hidden="true" />
            Secure Checkout
          </p>
          <span className="hidden text-xs font-semibold text-slate-500 sm:inline">Encrypted payment flow</span>
        </div>
      </section>

      <section className="mx-auto grid max-w-6xl gap-6 px-4 py-8 lg:grid-cols-[1.2fr_0.8fr]">
        <div className="space-y-6">
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <h1 className="inline-flex items-center gap-2 text-2xl font-extrabold text-slate-900">
              <i className="fa-solid fa-truck-fast text-slate-700" aria-hidden="true" />
              Shipping Details
            </h1>
            <p className="mt-2 text-sm text-slate-600">
              Fill in your order destination and payment details to place your order safely.
            </p>
            <CheckoutForm storeName={settings?.store_name || "Clothify"} />
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <h2 className="inline-flex items-center gap-2 text-lg font-bold text-slate-900">
              <i className="fa-solid fa-wallet text-slate-700" aria-hidden="true" />
              Payment Options
            </h2>
            <p className="mt-2 text-sm text-slate-600">
              Cash on Delivery and Mobile Banking are available. Select the best option in checkout form.
            </p>

            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              <div className="rounded-xl border border-slate-200 bg-slate-50 p-3">
                <p className="text-sm font-bold text-slate-900">Cash on Delivery</p>
                <p className="mt-1 text-xs text-slate-600">Pay after product delivery is confirmed.</p>
              </div>
              <div className="rounded-xl border border-slate-200 bg-slate-50 p-3">
                <p className="text-sm font-bold text-slate-900">Mobile Banking</p>
                <p className="mt-1 text-xs text-slate-600">bKash / Nagad with secure transaction ID validation.</p>
              </div>
            </div>

            <div className="mt-4 space-y-3">
              <DeliveryCheck compact />

              <div>
                <p className="text-sm text-slate-500">Merchant bKash Number</p>
                <p className="text-lg font-semibold text-slate-900">{settings?.bkash_number || "Not set"}</p>
              </div>

              <div>
                <p className="mb-3 text-sm text-slate-500">bKash QR</p>
                {settings?.bkash_qr_url ? (
                  <Image
                    src={settings.bkash_qr_url}
                    alt="bKash QR"
                    width={320}
                    height={320}
                    className="w-full max-w-xs rounded-xl border border-slate-200"
                  />
                ) : (
                  <p className="text-sm text-slate-600">QR not uploaded yet.</p>
                )}
              </div>

              <Link
                href="/payment"
                className="inline-flex items-center justify-center rounded-full border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-800 transition hover:bg-slate-50"
              >
                💳 Payment নির্দেশনা দেখুন
              </Link>
            </div>
          </div>
        </div>

        <CheckoutSummaryCard />
      </section>

      <BottomNav />
    </main>
  );
}
