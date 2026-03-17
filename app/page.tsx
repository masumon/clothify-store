import Header from "@/components/Header";
import Footer from "@/components/Footer";
import MobileStickyBar from "@/components/MobileStickyBar";
import UpazilaHomepageV2 from "@/components/UpazilaHomepageV2";
import { getCategories, getProducts, getStoreSettings } from "@/lib/data";

export const revalidate = 60;

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
    <main className="pb-24 md:pb-0">
      <Header
        storeName={settings?.store_name || "Clothify"}
        slogan={settings?.slogan || "Find Your Fit"}
        logoUrl={settings?.logo_url || ""}
        whatsappNumber={settings?.whatsapp_number || "8801811314262"}
      />

      <section className="mx-auto max-w-6xl px-4 py-6 sm:py-8">
        <UpazilaHomepageV2
          products={products}
          categories={categories}
          activeCategory={activeCategory}
          activeSearch={activeSearch}
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