import Header from "@/components/Header";
import Footer from "@/components/Footer";
import MobileStickyBar from "@/components/MobileStickyBar";
import SearchAndFilter from "@/components/SearchAndFilter";
import SearchResultsClient from "@/components/SearchResultsClient";
import { getCategories, getProducts, getStoreSettings } from "@/lib/data";
import { getDictionary } from "@/lib/i18n";
import { cookies } from "next/headers";

export const revalidate = 60;

type SearchPageProps = {
  searchParams?: Promise<{ search?: string | string[] | undefined; q?: string | string[] | undefined; category?: string | string[] | undefined }>;
};

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const resolvedSearchParams = searchParams ? await searchParams : undefined;
  const rawQuery = resolvedSearchParams?.search ?? resolvedSearchParams?.q;
  const rawCategory = resolvedSearchParams?.category;
  const q = (Array.isArray(rawQuery) ? rawQuery[0] : rawQuery) || "";
  const category = (Array.isArray(rawCategory) ? rawCategory[0] : rawCategory) || "";
  const lang = (await cookies()).get("clothfy-lang")?.value === "en" ? "en" : "bn";
  const dict = getDictionary(lang);

  const settings = await getStoreSettings();
  const categories = await getCategories();
  const products = await getProducts({ search: q, category });

  return (
    <main className="pb-24 md:pb-0">
      <Header
        storeName={settings?.store_name || "Clothify"}
        slogan={settings?.slogan || "Find Your Fit"}
        logoUrl={settings?.logo_url || ""}
        whatsappNumber={settings?.whatsapp_number || "8801811314262"}
      />

      <section className="mx-auto max-w-6xl px-4 py-6 sm:py-8">
        <div className="mb-4 flex flex-wrap items-center gap-2 text-xs font-semibold text-slate-500">
          <span>{dict.search.home}</span>
          <span>›</span>
          <span>{dict.search.search}</span>
          {q ? (
            <>
              <span>›</span>
              <span className="rounded-full bg-slate-100 px-2 py-1 text-slate-700">{q}</span>
            </>
          ) : null}
        </div>

        <div className="surface-card p-4 sm:p-5">
          <h1 className="text-xl font-extrabold text-slate-900">{dict.search.searchFilter}</h1>
          <p className="mt-1 text-sm text-slate-600">{dict.search.searchPageDescription}</p>
          <div className="mt-3">
            <SearchAndFilter categories={categories} />
          </div>
        </div>

        <SearchResultsClient
          products={products}
          whatsappNumber={settings?.whatsapp_number || "8801811314262"}
        />
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
