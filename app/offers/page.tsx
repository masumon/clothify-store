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
        <div className="rounded-3xl border border-amber-200 bg-gradient-to-br from-amber-50 to-orange-50 p-5 sm:p-7">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-amber-700">Offers & Deals</p>
          <h1 className="mt-2 text-2xl font-extrabold text-slate-900 sm:text-3xl">আজকের সেরা ছাড় • Best Value Picks</h1>
          <p className="mt-2 text-sm text-slate-600">Student-friendly combo, flash discount, and trending deal items.</p>
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
