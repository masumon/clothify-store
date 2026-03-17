import { unstable_noStore as noStore } from "next/cache";
import AdminTopbar from "@/components/AdminTopbar";
import ProductUploadForm from "@/components/ProductUploadForm";
import AdminProductsManager from "@/components/AdminProductsManager";
import { getSupabaseAdminClient } from "@/lib/supabase-admin";
import { Product } from "@/types";

export const dynamic = "force-dynamic";

async function getProducts() {
  noStore();

  try {
    const supabase = getSupabaseAdminClient();

    const { data, error } = await supabase
      .from("products")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Admin products fetch error:", error.message);
      return [];
    }

    return (data || []) as Product[];
  } catch {
    return [];
  }
}

export default async function AdminProductsPage() {
  const products = await getProducts();
  const categories = Array.from(new Set(products.map((item) => item.category))).slice(0, 5);

  return (
    <section>
      <AdminTopbar />
      <h1 className="mb-2 text-3xl font-extrabold tracking-tight text-slate-900">👔 Products & Inventory</h1>
      <p className="mb-6 text-slate-600">
        Upload products with clean category + size structure for better browsing.
      </p>

      <div className="mb-6 grid gap-4 md:grid-cols-3">
        <div className="rounded-2xl border border-slate-200/80 bg-white/95 p-4 shadow-[0_10px_28px_-22px_rgba(2,6,23,0.6)]">
          <p className="text-sm font-medium text-slate-500">📦 Total Products</p>
          <p className="mt-1 text-2xl font-extrabold text-slate-900">{products.length}</p>
        </div>
        <div className="rounded-2xl border border-slate-200/80 bg-white/95 p-4 shadow-[0_10px_28px_-22px_rgba(2,6,23,0.6)]">
          <p className="text-sm font-medium text-slate-500">🗂️ Active Categories</p>
          <p className="mt-1 text-2xl font-extrabold text-slate-900">{categories.length}</p>
        </div>
        <div className="rounded-2xl border border-slate-200/80 bg-white/95 p-4 shadow-[0_10px_28px_-22px_rgba(2,6,23,0.6)]">
          <p className="text-sm font-medium text-slate-500">✅ Last Update</p>
          <p className="mt-1 text-lg font-bold text-slate-900">Catalog Ready</p>
        </div>
      </div>

      <div className="mb-6 rounded-2xl border border-slate-200/80 bg-white/95 p-5 shadow-[0_10px_28px_-22px_rgba(2,6,23,0.6)]">
        <h2 className="text-lg font-bold text-slate-900">🧠 Product Setup Tips</h2>
        <ul className="mt-3 space-y-2 text-sm text-slate-700">
          <li>1) Keep product name clear: style + fabric + gender.</li>
          <li>2) Keep category consistent: Panjabi, Shirt, Sharee, Kids, etc.</li>
          <li>3) Use clean square image for better card quality.</li>
          <li>4) Add available sizes only to reduce wrong orders.</li>
        </ul>
      </div>

      <ProductUploadForm />
      <AdminProductsManager products={products} />
    </section>
  );
}
