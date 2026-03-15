import Header from "@/components/Header";
import ProductCard from "@/components/ProductCard";
import Footer from "@/components/Footer";
import { getProducts, getStoreSettings } from "@/lib/data";

export default async function Home() {
  const settings = await getStoreSettings();
  const products = await getProducts();

  return (
    <main>
      <Header
        storeName={settings?.store_name || "Clothify"}
        slogan={settings?.slogan || "Find Your Fit"}
        logoUrl={settings?.logo_url || ""}
      />

      <section className="mx-auto max-w-6xl px-4 py-8">
        <div className="mb-8 rounded-3xl bg-black px-6 py-10 text-center text-white">
          <h2 className="text-3xl font-bold">
            {settings?.store_name || "Clothify"}
          </h2>
          <p className="mt-2 text-base text-slate-300">
            {settings?.slogan || "Find Your Fit"}
          </p>
        </div>

        <div className="mb-6">
          <h3 className="text-2xl font-bold text-slate-900">Latest Products</h3>
        </div>

        {products.length === 0 ? (
          <div className="rounded-2xl bg-white p-8 text-center shadow border border-slate-200">
            <p className="text-slate-600">No products found.</p>
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {products.map((product: any) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </section>

      <Footer
        storeName={settings?.store_name || "Clothify"}
        address={settings?.address || ""}
        phone={settings?.contact_phone || ""}
      />
    </main>
  );
}
