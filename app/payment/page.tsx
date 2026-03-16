import Link from "next/link";
import Image from "next/image";
import { getStoreSettings } from "@/lib/data";

export const revalidate = 120;

export default async function PaymentPage() {
  const settings = await getStoreSettings();

  return (
    <main className="min-h-screen bg-slate-50 flex items-center justify-center px-4">
      <div className="max-w-xl w-full rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
        <h1 className="text-3xl font-bold text-slate-900 text-center">
          bKash Merchant Payment
        </h1>

        <p className="mt-3 text-slate-600 text-center">
          bKash Merchant অপশন থেকে QR স্ক্যান করে অথবা নাম্বার দিয়ে পেমেন্ট করুন।
        </p>

        <div className="mt-6 text-center">
          <p className="text-sm text-slate-500 mb-2">Merchant bKash Number</p>

          <div className="text-xl font-bold text-black bg-slate-100 rounded-xl py-3">
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

        <div className="mt-6 text-sm text-slate-600 space-y-2">
          <p className="font-semibold text-slate-800">Payment Instructions (Merchant)</p>
          <p>1️⃣ bKash app খুলুন এবং <b>Payment</b> অপশনে যান</p>
          <p>2️⃣ QR scan করে merchant select করুন অথবা merchant নাম্বার দিন</p>
          <p>3️⃣ অর্ডারের ঠিক amount লিখে payment confirm করুন</p>
          <p>4️⃣ payment সম্পন্ন হলে <b>Transaction ID (TRX ID)</b> কপি করুন</p>
          <p>5️⃣ Checkout page-এ TRX ID বসিয়ে order complete করুন</p>
          <p className="pt-1 text-xs text-emerald-700 font-medium">
            Tip: Send Money নয়, Merchant Payment ব্যবহার করুন।
          </p>
        </div>

        <div className="mt-8 flex flex-col gap-3">
          <Link
            href="/checkout"
            className="bg-black text-white text-center py-3 rounded-full font-semibold"
          >
            Go to Checkout
          </Link>

          <Link
            href="/"
            className="border border-slate-300 text-center py-3 rounded-full font-semibold"
          >
            Back to Home
          </Link>
        </div>
      </div>
    </main>
  );
}
