import Header from "@/components/Header";
import ProductCard from "@/components/ProductCard";
import Footer from "@/components/Footer";
import SearchAndFilter from "@/components/SearchAndFilter";
import HomeHero from "@/components/HomeHero";
import HomeCategoryBar from "@/components/HomeCategoryBar";
import HomeHighlights from "@/components/HomeHighlights";
import { getCategories, getProducts, getStoreSettings } from "@/lib/data";

export const dynamic = "force-dynamic";

export default async function Home({
  searchParams,
}: {
  searchParams?: { search?: string; category?: string };
}) {
  const activeSearch = searchParams?.search || "";
  const activeCategory = searchParams?.category || "";

  const settings = await getStoreSettings();
  const products = await getProducts({
    search: activeSearch,
    category: activeCategory,
  });
  const categories = await getCategories();

  return (
    <main>
      <Header
        storeName={settings?.store_name || "Clothify"}
        slogan={settings?.slogan || "Find Your Fit"}
        logoUrl={settings?.logo_url || ""}
      />

      <section className="mx-auto max-w-6xl px-4 py-8">
        <HomeHero
          storeName={settings?.store_name || "Clothify"}
          slogan={settings?.slogan || "Find Your Fit"}
        />

        <HomeHighlights />

        <SearchAndFilter categories={categories} />

        <HomeCategoryBar
          categories={categories}
          activeCategory={activeCategory}
          activeSearch={activeSearch}
        />

        <div className="mb-6 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h3 className="text-2xl font-bold text-slate-900">
              Latest Products
            </h3>
            <p className="mt-1 text-sm text-slate-500">
              Explore your store collection with dynamic filters and search.
            </p>
          </div>

          <p className="text-sm font-medium text-slate-500">
            {products.length} item(s) found
          </p>
        </div>

        {products.length === 0 ? (
          <div className="rounded-2xl border border-slate-200 bg-white p-10 text-center shadow-sm">
            <h4 className="text-lg font-bold text-slate-900">
              No products found
            </h4>
            <p className="mt-2 text-sm text-slate-500">
              Try another search term or category.
            </p>
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
