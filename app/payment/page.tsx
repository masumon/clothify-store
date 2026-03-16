import { getStoreSettings } from "@/lib/data";

export const dynamic = "force-dynamic";

export default async function PaymentPage() {

  const settings = await getStoreSettings();

  return (
    <main className="mx-auto max-w-3xl px-4 py-10">

      <h1 className="text-3xl font-bold text-slate-900">
        Payment Instructions
      </h1>

      <p className="mt-2 text-slate-500">
        Complete your order payment using bKash.
      </p>

      <div className="mt-8 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">

        <h2 className="text-xl font-semibold text-slate-900">
          bKash Payment
        </h2>

        <p className="mt-3 text-sm text-slate-600">
          Send money to the following bKash number.
        </p>

        <div className="mt-4 rounded-xl bg-slate-100 p-4 text-center text-lg font-bold">
          {settings?.bkash_number || "bKash number not set"}
        </div>

        {settings?.bkash_qr_url && (
          <div className="mt-6 flex justify-center">
            <img
              src={settings.bkash_qr_url}
              alt="bKash QR"
              className="w-48 rounded-xl border"
            />
          </div>
        )}

        <div className="mt-6 space-y-2 text-sm text-slate-600">
          <p>1. Open your bKash app</p>
          <p>2. Tap Send Money</p>
          <p>3. Enter the bKash number</p>
          <p>4. Send the exact order amount</p>
          <p>5. Copy the transaction ID</p>
          <p>6. Enter the transaction ID in checkout</p>
        </div>

      </div>

    </main>
  );
}
