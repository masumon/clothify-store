import Link from "next/link";
import { getStoreSettings } from "@/lib/data";

export const dynamic = "force-dynamic";

export default async function PaymentPage() {
  const settings = await getStoreSettings();

  return (
    <main className="min-h-screen bg-slate-50">
      <section className="mx-auto max-w-3xl px-4 py-10">
        <div className="mb-6">
          <Link
            href="/"
            className="inline-flex rounded-full border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700"
          >
            ← Back to Home
          </Link>
        </div>

        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
          <h1 className="text-3xl font-bold text-slate-900">
            Payment Instructions
          </h1>

          <p className="mt-3 text-sm leading-6 text-slate-600 sm:text-base">
            Complete your order payment using bKash, then enter your transaction
            ID during checkout.
          </p>

          <div className="mt-8 rounded-2xl bg-slate-50 p-5">
            <h2 className="text-lg font-semibold text-slate-900">
              bKash Number
            </h2>

            <div className="mt-4 rounded-2xl bg-white p-4 text-center text-xl font-bold text-slate-900 shadow-sm">
              {settings?.bkash_number || "bKash number not set"}
            </div>

            {settings?.bkash_qr_url ? (
              <div className="mt-6 flex justify-center">
                <img
                  src={settings.bkash_qr_url}
                  alt="bKash QR"
                  className="w-56 rounded-2xl border border-slate-200 bg-white p-2 shadow-sm"
                />
              </div>
            ) : (
              <p className="mt-4 text-center text-sm text-slate-500">
                QR image not uploaded yet.
              </p>
            )}
          </div>

          <div className="mt-8 rounded-2xl border border-slate-200 p-5">
            <h3 className="text-lg font-semibold text-slate-900">
              How to pay
            </h3>

            <div className="mt-4 space-y-2 text-sm leading-6 text-slate-600">
              <p>1. Open your bKash app</p>
              <p>2. Tap Send Money</p>
              <p>3. Enter the bKash number shown above</p>
              <p>4. Send the exact order amount</p>
              <p>5. Copy your transaction ID</p>
              <p>6. Go to checkout and submit the transaction ID</p>
            </div>
          </div>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link
              href="/checkout"
              className="inline-flex items-center justify-center rounded-full bg-black px-6 py-3 text-sm font-bold text-white"
            >
              Go to Checkout
            </Link>

            <Link
              href="/"
              className="inline-flex items-center justify-center rounded-full border border-slate-300 bg-white px-6 py-3 text-sm font-bold text-slate-700"
            >
              Continue Shopping
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
