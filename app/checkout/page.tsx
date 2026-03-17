import Header from "@/components/Header";
import Image from "next/image";
import Link from "next/link";
import BottomNav from "@/components/BottomNav";
import CheckoutForm from "@/components/CheckoutForm";
import DeliveryCheck from "@/components/DeliveryCheck";
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

      <section className="mx-auto grid max-w-6xl gap-8 px-4 py-10 md:grid-cols-2">
        <div className="md:col-span-2 -mb-4 flex flex-wrap items-center gap-2 text-xs font-semibold text-slate-500">
          <span>Home</span>
          <span>›</span>
          <span>Cart</span>
          <span>›</span>
          <span className="rounded-full bg-slate-100 px-2 py-1 text-slate-700">Checkout</span>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="mb-4 grid grid-cols-3 gap-2 text-center text-xs font-semibold">
            <div className="rounded-full bg-teal-100 px-2 py-1 text-teal-800">1. Address</div>
            <div className="rounded-full bg-teal-100 px-2 py-1 text-teal-800">2. Payment</div>
            <div className="rounded-full bg-slate-100 px-2 py-1 text-slate-600">3. Review</div>
          </div>

          <div className="flex items-center justify-between gap-3">
            <h1 className="text-2xl font-bold text-slate-900">Checkout</h1>
            <Link
              href="/"
              className="inline-flex items-center gap-1 rounded-full border border-slate-300 px-3 py-1.5 text-xs font-semibold text-slate-700 transition hover:bg-slate-50"
            >
              🏠 Back to Home
            </Link>
          </div>
          <CheckoutForm storeName={settings?.store_name || "Clothify"} />
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-xl font-bold text-slate-900">Payment Details</h2>
          <p className="mt-2 text-sm text-slate-600">
            bKash / Nagad / <b>Cash on Delivery</b> বেছে নিতে পারবেন।
            Home delivery নিলে courier service-ও select করতে পারবেন।
          </p>

          <div className="mt-4 grid grid-cols-2 gap-2 text-[11px] font-semibold sm:grid-cols-4">
            <span className="rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-emerald-800">✅ COD</span>
            <span className="rounded-full border border-fuchsia-200 bg-fuchsia-50 px-3 py-1 text-fuchsia-800">💳 bKash</span>
            <span className="rounded-full border border-orange-200 bg-orange-50 px-3 py-1 text-orange-800">💳 Nagad</span>
            <span className="rounded-full border border-cyan-200 bg-cyan-50 px-3 py-1 text-cyan-800">🔐 Secure</span>
          </div>

          <div className="mt-5 space-y-3">
            <DeliveryCheck compact />

            <div>
              <p className="text-sm text-slate-500">Merchant bKash Number</p>
              <p className="text-lg font-semibold text-slate-900">
                {settings?.bkash_number || "Not set"}
              </p>
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
      </section>

      <BottomNav />
    </main>
  );
}
