import { unstable_noStore as noStore } from "next/cache";
import AppIcon from "@/components/AppIcon";
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

    const { data, error } = await supabase.from("products").select("*").order("created_at", { ascending: false });

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

      <div className="mb-6">
        <div className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs font-bold uppercase tracking-[0.16em] text-slate-500 shadow-sm">
          <AppIcon name="shirt" className="h-4 w-4" />
          Products
        </div>
        <h1 className="mt-3 text-3xl font-black tracking-tight text-slate-900">Products and inventory</h1>
        <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">
          Upload, organize, and publish catalog items with a cleaner structure for desktop and mobile shoppers.
        </p>
      </div>

      <div className="mb-6 grid gap-4 md:grid-cols-3">
        <div className="rounded-[24px] border border-slate-200/80 bg-white/95 p-4 shadow-[0_14px_32px_-26px_rgba(2,6,23,0.48)]">
          <p className="text-sm font-medium text-slate-500">Total Products</p>
          <p className="mt-1 text-2xl font-extrabold text-slate-900">{products.length}</p>
        </div>
        <div className="rounded-[24px] border border-slate-200/80 bg-white/95 p-4 shadow-[0_14px_32px_-26px_rgba(2,6,23,0.48)]">
          <p className="text-sm font-medium text-slate-500">Active Categories</p>
          <p className="mt-1 text-2xl font-extrabold text-slate-900">{categories.length}</p>
        </div>
        <div className="rounded-[24px] border border-slate-200/80 bg-white/95 p-4 shadow-[0_14px_32px_-26px_rgba(2,6,23,0.48)]">
          <p className="text-sm font-medium text-slate-500">Catalog Status</p>
          <p className="mt-1 text-lg font-bold text-slate-900">Ready to update</p>
        </div>
      </div>

      <div className="mb-6 rounded-[24px] border border-slate-200/80 bg-white/95 p-5 shadow-[0_14px_32px_-26px_rgba(2,6,23,0.48)]">
        <h2 className="text-lg font-bold text-slate-900">Product Setup Tips</h2>
        <ul className="mt-3 space-y-2 text-sm text-slate-700">
          <li>1) Keep product name clear: style + fabric + fit.</li>
          <li>2) Keep category naming consistent for better filtering.</li>
          <li>3) Use clean square images for stronger product cards.</li>
          <li>4) Add only available sizes to reduce wrong orders.</li>
        </ul>
      </div>

      <ProductUploadForm />
      <AdminProductsManager products={products} />
    </section>
  );
}
