import Header from "@/components/Header";
import ProductCard from "@/components/ProductCard";
import Footer from "@/components/Footer";
import SearchAndFilter from "@/components/SearchAndFilter";
import HomeHero from "@/components/HomeHero";
import HomeCategoryBar from "@/components/HomeCategoryBar";
import HomeHighlights from "@/components/HomeHighlights";
import SectionHeader from "@/components/SectionHeader";
import HomeQuickActions from "@/components/HomeQuickActions";
import MobileStickyBar from "@/components/MobileStickyBar";
import HomePromoStrip from "@/components/HomePromoStrip";
import FeaturedCollection from "@/components/FeaturedCollection";
import HomeSectionDivider from "@/components/HomeSectionDivider";
import BestSellerStrip from "@/components/BestSellerStrip";
import TrustBadges from "@/components/TrustBadges";
import EidCampaignSection from "@/components/EidCampaignSection";
import SitePreferencesBar from "@/components/SitePreferencesBar";
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
      />

      <section className="mx-auto max-w-6xl px-4 py-6 sm:py-8">
        <HomeHero
          storeName={settings?.store_name || "Clothify"}
          slogan={settings?.slogan || "Find Your Fit"}
        />

        <HomeQuickActions whatsapp={settings?.whatsapp_number || ""} />

        <SitePreferencesBar />

        <EidCampaignSection />

        <HomePromoStrip />

        <FeaturedCollection />

        <BestSellerStrip />

        <HomeSectionDivider />

        <TrustBadges />

        <HomeHighlights />

        <div className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
          <SearchAndFilter categories={categories} />
          <HomeCategoryBar
            categories={categories}
            activeCategory={activeCategory}
            activeSearch={activeSearch}
          />
        </div>

        <div id="products" className="mt-10">
          <SectionHeader
            title="Latest Products"
            subtitle="Explore your collection with better browsing, category shortcuts, and a polished shopping experience."
            rightText={`${products.length} item(s) found`}
          />

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
            <div className="grid gap-4 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3">
              {products.map((product: any) => (
                <ProductCard key={product.id} product={product} />
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
