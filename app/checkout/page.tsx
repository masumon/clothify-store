import Header from "@/components/Header";
import Image from "next/image";
import Link from "next/link";
import BottomNav from "@/components/BottomNav";
import CheckoutForm from "@/components/CheckoutForm";
import DeliveryCheck from "@/components/DeliveryCheck";
import CheckoutSummaryCard from "@/components/CheckoutSummaryCard";
import AppIcon from "@/components/AppIcon";
import { getStoreSettings } from "@/lib/data";
import { getDictionary } from "@/lib/i18n";
import { cookies } from "next/headers";

export const revalidate = 60;

export default async function CheckoutPage() {
  const settings = await getStoreSettings();
  const lang = (await cookies()).get("clothfy-lang")?.value === "en" ? "en" : "bn";
  const dict = getDictionary(lang);

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
            <AppIcon name="back" className="h-4.5 w-4.5" />
            {dict.checkout.returnToShop}
          </Link>
          <p className="inline-flex items-center gap-1.5 font-bold text-slate-900">
            <AppIcon name="lock" className="h-4.5 w-4.5" />
            {dict.checkout.secureCheckout}
          </p>
          <span className="hidden text-xs font-semibold text-slate-500 sm:inline">{dict.checkout.encryptedFlow}</span>
        </div>
      </section>

      <section className="mx-auto grid max-w-6xl gap-6 px-4 py-8 lg:grid-cols-[1.2fr_0.8fr]">
        <div className="space-y-6">
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <h1 className="inline-flex items-center gap-2 text-2xl font-extrabold text-slate-900">
              <AppIcon name="truck" className="h-5 w-5 text-slate-700" />
              {dict.checkout.shippingDetails}
            </h1>
            <p className="mt-2 text-sm text-slate-600">
              {dict.checkout.shippingDescription}
            </p>
            <CheckoutForm storeName={settings?.store_name || "Clothify"} />
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <h2 className="inline-flex items-center gap-2 text-lg font-bold text-slate-900">
              <AppIcon name="wallet" className="h-5 w-5 text-slate-700" />
              {dict.checkout.paymentOptions}
            </h2>
            <p className="mt-2 text-sm text-slate-600">
              {dict.checkout.paymentDescription}
            </p>

            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              <div className="rounded-xl border border-slate-200 bg-slate-50 p-3">
                <p className="text-sm font-bold text-slate-900">{dict.checkout.cod}</p>
                <p className="mt-1 text-xs text-slate-600">{dict.checkout.codDescription}</p>
              </div>
              <div className="rounded-xl border border-slate-200 bg-slate-50 p-3">
                <p className="text-sm font-bold text-slate-900">{dict.checkout.mobileBanking}</p>
                <p className="mt-1 text-xs text-slate-600">{dict.checkout.mobileBankingDescription}</p>
              </div>
            </div>

            <div className="mt-4 space-y-3">
              <DeliveryCheck compact />

              <div>
                <p className="text-sm text-slate-500">{dict.checkout.merchantBkash}</p>
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
                  <p className="text-sm text-slate-600">{dict.checkout.qrMissing}</p>
                )}
              </div>

              <Link
                href="/payment"
                className="inline-flex items-center justify-center rounded-full border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-800 transition hover:bg-slate-50"
              >
                <AppIcon name="payment" className="h-4.5 w-4.5" />
                {dict.checkout.viewPaymentGuide}
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
