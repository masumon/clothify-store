import Link from "next/link";
import Image from "next/image";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import MobileStickyBar from "@/components/MobileStickyBar";
import { getStoreSettings } from "@/lib/data";

export const revalidate = 120;

export default async function PaymentPage() {
  const settings = await getStoreSettings();

  return (
    <main className="pb-24 md:pb-0">
      <Header
        storeName={settings?.store_name || "Clothify"}
        slogan={settings?.slogan || "Find Your Fit"}
        logoUrl={settings?.logo_url || ""}
        whatsappNumber={settings?.whatsapp_number || "8801811314262"}
      />

      <section className="mx-auto max-w-5xl px-4 py-8">
        <div className="mx-auto w-full max-w-xl rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-8">
          <h1 className="text-center text-2xl font-bold text-slate-900 sm:text-3xl">
            bKash Merchant Payment
          </h1>

          <p className="mt-3 text-center text-sm text-slate-600 sm:text-base">
            bKash Merchant অপশন থেকে QR স্ক্যান করে অথবা নাম্বার দিয়ে পেমেন্ট করুন।
          </p>

          <div className="mt-6 text-center">
            <p className="mb-2 text-sm text-slate-500">Merchant bKash Number</p>

            <div className="rounded-xl bg-slate-100 py-3 text-xl font-bold text-black">
              {settings?.bkash_number || "bKash number not set"}
            </div>
          </div>

          {settings?.bkash_qr_url ? (
            <div className="mt-6 flex justify-center">
              <Image
                src={settings.bkash_qr_url}
                alt="bKash QR"
                width={192}
                height={192}
                className="w-48 rounded-2xl border border-slate-200 bg-white p-2 shadow-sm"
              />
            </div>
          ) : (
            <p className="mt-4 text-center text-sm text-slate-500">
              QR image not uploaded yet.
            </p>
          )}

          <div className="mt-6 space-y-2 text-sm text-slate-600">
            <p className="font-semibold text-slate-800">Payment Instructions (Merchant)</p>
            <p>1️⃣ bKash app খুলুন এবং <b>Payment</b> অপশনে যান</p>
            <p>2️⃣ QR scan করে merchant select করুন অথবা merchant নাম্বার দিন</p>
            <p>3️⃣ অর্ডারের ঠিক amount লিখে payment confirm করুন</p>
            <p>4️⃣ payment সম্পন্ন হলে <b>Transaction ID (TRX ID)</b> কপি করুন</p>
            <p>5️⃣ Checkout page-এ TRX ID বসিয়ে order complete করুন</p>
            <p className="pt-1 text-xs font-medium text-emerald-700">
              Tip: Send Money নয়, Merchant Payment ব্যবহার করুন।
            </p>
          </div>

          <div className="mt-8 flex flex-col gap-3">
            <Link
              href="/checkout"
              className="rounded-full bg-black py-3 text-center font-semibold text-white"
            >
              ✅ Go to Checkout
            </Link>

            <Link
              href="/"
              className="rounded-full border border-slate-300 py-3 text-center font-semibold"
            >
              🏠 Back to Home
            </Link>

            <div className="grid grid-cols-2 gap-3">
              <Link
                href="/fb"
                className="rounded-full border border-slate-300 py-2 text-center text-sm font-semibold text-slate-700"
              >
                📣 Landing
              </Link>
              <Link
                href="/settings"
                className="rounded-full border border-slate-300 py-2 text-center text-sm font-semibold text-slate-700"
              >
                ⚙️ Settings
              </Link>
            </div>

            <Link
              href="/cart"
              className="rounded-full border border-slate-300 py-2 text-center text-sm font-semibold text-slate-700"
            >
              🛒 Cart
            </Link>
          </div>
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
