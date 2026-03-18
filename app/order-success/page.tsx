import Link from "next/link";
import InvoiceAutoDownload from "@/components/InvoiceAutoDownload";
import { getStoreSettings } from "@/lib/data";

export default async function OrderSuccessPage() {
  const settings = await getStoreSettings();

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-100 px-4">
      <div className="max-w-lg rounded-2xl border border-slate-200 bg-white p-5 text-center shadow-sm sm:p-10">
        <h1 className="text-2xl font-bold text-slate-900 sm:text-3xl">Order Placed Successfully</h1>
        <p className="mt-4 text-sm text-slate-600 sm:text-base">
          Thank you for shopping with Clothify. Your order has been received and
          is waiting for confirmation.
        </p>

        <InvoiceAutoDownload
          storeName={settings?.store_name || "Clothify"}
          logoUrl={settings?.logo_url || ""}
          storeAddress={settings?.address || ""}
          storePhone={settings?.contact_phone || ""}
        />

        <div className="mt-6 space-y-3">
          <Link
            href="/"
            className="block rounded-lg bg-black px-5 py-3 text-white"
          >
            Back to Home
          </Link>

          <Link
            href="/admin/orders"
            className="block rounded-lg bg-slate-200 px-5 py-3 text-slate-800"
          >
            View Orders
          </Link>
        </div>
      </div>
    </main>
  );
}
