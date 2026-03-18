import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import MobileStickyBar from "@/components/MobileStickyBar";
import { cookies } from "next/headers";
import { getCategories, getStoreSettings } from "@/lib/data";

export const revalidate = 120;

const GROUPS = [
  {
    title: "Ethnic Wear",
    items: ["Panjabi", "Kabli Set", "Pajama"],
  },
  {
    title: "Western Wear",
    items: ["Casual Shirt", "Formal Shirt", "T-Shirt", "Polo Shirt"],
  },
  {
    title: "Bottom & Accessories",
    items: ["Jeans", "Chinos", "Formal Trousers", "Belt", "Wallet"],
  },
];

export default async function CategoriesPage() {
  const settings = await getStoreSettings();
  const categories = await getCategories();
  const cookieStore = await cookies();
  const isBn = cookieStore.get("clothfy-lang")?.value !== "en";

  return (
    <main className="pb-24 md:pb-0">
      <Header
        storeName={settings?.store_name || "Clothify"}
        slogan={settings?.slogan || "Find Your Fit"}
        logoUrl={settings?.logo_url || ""}
        whatsappNumber={settings?.whatsapp_number || "8801811314262"}
      />

      <section className="mx-auto max-w-5xl space-y-6 px-4 py-6 sm:py-8">
        <div className="rounded-3xl border border-slate-200 bg-white p-5 sm:p-7">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-slate-500">Categories</p>
          <h1 className="mt-2 text-2xl font-extrabold text-slate-900 sm:text-3xl">
            {isBn ? "ক্যাটাগরি অনুযায়ী কালেকশন" : "Collection by Category"}
          </h1>
          <p className="mt-2 text-sm text-slate-600">
            {isBn
              ? "৩ ট্যাপের মধ্যে product খুঁজে পাওয়ার জন্য curated category structure।"
              : "Curated category structure to find products in just a few taps."}
          </p>
        </div>

        {GROUPS.map((group) => (
          <div key={group.title} className="rounded-3xl border border-slate-200 bg-white p-5">
            <h2 className="text-lg font-bold text-slate-900">{group.title}</h2>
            <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-4">
              {group.items.map((item) => (
                <Link
                  key={item}
                  href={`/?category=${encodeURIComponent(item)}`}
                  className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm font-semibold text-slate-700 transition hover:border-teal-300 hover:bg-teal-50 hover:text-teal-900"
                >
                  {item}
                </Link>
              ))}
            </div>
          </div>
        ))}

        <div className="rounded-3xl border border-indigo-200 bg-indigo-50 p-4 text-sm text-indigo-900">
          {isBn ? "লাইভ ক্যাটাগরি" : "Available live categories"}:{" "}
          {categories.length > 0 ? categories.join(", ") : isBn ? "কোনো ক্যাটাগরি পাওয়া যায়নি" : "No category found"}
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
