import Header from "@/components/Header";
import Footer from "@/components/Footer";
import MobileStickyBar from "@/components/MobileStickyBar";
import ProductCard from "@/components/ProductCard";
import SectionHeader from "@/components/SectionHeader";
import { getProducts, getStoreSettings } from "@/lib/data";

export const revalidate = 60;

export default async function OffersPage() {
  const settings = await getStoreSettings();
  const products = await getProducts();
  const deals = products
    .filter((p: any) => (p.original_price && p.original_price > p.price) || p.campaign_badge)
    .slice(0, 12);

  return (
    <main className="pb-24 md:pb-0">
      <Header
        storeName={settings?.store_name || "Clothify"}
        slogan={settings?.slogan || "Find Your Fit"}
        logoUrl={settings?.logo_url || ""}
        whatsappNumber={settings?.whatsapp_number || "8801811314262"}
      />

      <section className="mx-auto max-w-6xl px-4 py-6 sm:py-8">
        <div className="relative overflow-hidden rounded-3xl border border-cyan-300/40 bg-gradient-to-br from-[#0b2f52] via-[#114c7a] to-[#0f766e] p-5 text-white shadow-lg shadow-slate-900/20 sm:p-7">
          <div className="absolute -right-10 -top-12 h-44 w-44 rounded-full bg-amber-300/20 blur-3xl" />
          <div className="absolute -left-12 bottom-0 h-40 w-40 rounded-full bg-cyan-300/20 blur-3xl" />
          <p className="relative text-xs font-bold uppercase tracking-[0.2em] text-amber-200">Offers & Deals</p>
          <h1 className="relative mt-2 text-2xl font-extrabold text-white sm:text-3xl">আজকের সেরা ছাড় • Best Value Picks</h1>
          <p className="relative mt-2 text-sm text-cyan-100">Student-friendly combo, flash discount, and trending deal items.</p>
        </div>

        <div className="mt-8">
          <SectionHeader
            icon="🏷️"
            title="Running Deals"
            subtitle="ছাড় শেষ হওয়ার আগেই add to cart করুন"
            rightText={`${deals.length} deal item`}
          />

          {deals.length === 0 ? (
            <div className="surface-card p-10 text-center">
              <h2 className="text-lg font-bold text-slate-900">No active deal right now</h2>
              <p className="mt-2 text-sm text-slate-500">নতুন অফার খুব শীঘ্রই আসছে।</p>
            </div>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {deals.map((product: any) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  whatsappNumber={settings?.whatsapp_number || "8801811314262"}
                />
              ))}
            </div>
          )}
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
