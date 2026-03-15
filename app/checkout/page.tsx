import Header from "@/components/Header";
import BottomNav from "@/components/BottomNav";
import { getStoreSettings } from "@/lib/data";

export default async function CheckoutPage() {
  const settings = await getStoreSettings();

  return (
    <main className="pb-20">
      <Header
        storeName={settings?.store_name || "Clothify"}
        slogan={settings?.slogan || "Find Your Fit"}
        logoUrl={settings?.logo_url || ""}
      />

      <section className="mx-auto grid max-w-6xl gap-8 px-4 py-10 md:grid-cols-2">
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h1 className="text-2xl font-bold text-slate-900">Checkout</h1>

          <form className="mt-6 space-y-4">
            <input
              type="text"
              placeholder="Full Name"
              className="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none"
            />
            <input
              type="text"
              placeholder="Phone Number"
              className="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none"
            />
            <textarea
              placeholder="Address"
              className="min-h-[120px] w-full rounded-lg border border-slate-300 px-4 py-3 outline-none"
            />
            <select className="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none">
              <option>Home Delivery</option>
              <option>Store Pickup</option>
            </select>
            <input
              type="text"
              placeholder="bKash Transaction ID"
              className="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none"
            />

            <button
              type="button"
              className="w-full rounded-lg bg-black px-5 py-3 font-medium text-white"
            >
              Place Order
            </button>
          </form>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-xl font-bold text-slate-900">Payment Details</h2>

          <div className="mt-5 space-y-3">
            <div>
              <p className="text-sm text-slate-500">bKash Number</p>
              <p className="text-lg font-semibold text-slate-900">
                {settings?.bkash_number || "Not set"}
              </p>
            </div>

            <div>
              <p className="mb-3 text-sm text-slate-500">bKash QR</p>
              {settings?.bkash_qr_url ? (
                <img
                  src={settings.bkash_qr_url}
                  alt="bKash QR"
                  className="w-full max-w-xs rounded-xl border border-slate-200"
                />
              ) : (
                <p className="text-sm text-slate-600">QR not uploaded yet.</p>
              )}
            </div>
          </div>
        </div>
      </section>

      <BottomNav />
    </main>
  );
}
