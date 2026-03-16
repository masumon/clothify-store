import Link from "next/link";
import { getStoreSettings } from "@/lib/data";

export const dynamic = "force-dynamic";

export default async function PaymentPage() {
  const settings = await getStoreSettings();

  return (
    <main className="min-h-screen bg-slate-50 flex items-center justify-center px-4">
      <div className="max-w-xl w-full rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
        <h1 className="text-3xl font-bold text-slate-900 text-center">
          bKash Payment
        </h1>

        <p className="mt-3 text-slate-600 text-center">
          Complete your order payment using the bKash number from store settings.
        </p>

        <div className="mt-6 text-center">
          <p className="text-sm text-slate-500 mb-2">Send Money To</p>

          <div className="text-xl font-bold text-black bg-slate-100 rounded-xl py-3">
            {settings?.bkash_number || "bKash number not set"}
          </div>
        </div>

        {settings?.bkash_qr_url ? (
          <div className="mt-6 flex justify-center">
            <img
              src={settings.bkash_qr_url}
              alt="bKash QR"
              className="w-48 rounded-2xl border border-slate-200 bg-white p-2 shadow-sm"
            />
          </div>
        ) : (
          <p className="mt-4 text-center text-sm text-slate-500">
            QR image not uploaded yet.
          </p>
        )}

        <div className="mt-6 text-sm text-slate-600 space-y-2">
          <p>1️⃣ Open your bKash app</p>
          <p>2️⃣ Tap Send Money</p>
          <p>3️⃣ Enter the number shown above</p>
          <p>4️⃣ Send the exact order amount</p>
          <p>5️⃣ Copy your Transaction ID</p>
          <p>6️⃣ Enter the Transaction ID during checkout</p>
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
