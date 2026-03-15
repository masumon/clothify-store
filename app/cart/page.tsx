import Header from "@/components/Header";
import BottomNav from "@/components/BottomNav";
import { getStoreSettings } from "@/lib/data";

export default async function CartPage() {
  const settings = await getStoreSettings();

  return (
    <main className="pb-20">
      <Header
        storeName={settings?.store_name || "Clothify"}
        slogan={settings?.slogan || "Find Your Fit"}
        logoUrl={settings?.logo_url || ""}
      />

      <section className="mx-auto max-w-5xl px-4 py-10">
        <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
          <h1 className="text-2xl font-bold text-slate-900">Your Cart</h1>
          <p className="mt-3 text-slate-600">
            Cart system UI ready. Next step-এ আমরা এটাকে localStorage/cart logic
            দিয়ে fully functional করব।
          </p>

          <div className="mt-6 rounded-xl bg-slate-50 p-4">
            <p className="text-sm text-slate-700">Sample Item: Cotton T-Shirt</p>
            <p className="mt-1 text-sm text-slate-500">Size: M</p>
            <p className="mt-1 font-semibold text-slate-900">৳650</p>
          </div>
        </div>
      </section>

      <BottomNav />
    </main>
  );
}
