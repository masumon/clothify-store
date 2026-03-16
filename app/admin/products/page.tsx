import { unstable_noStore as noStore } from "next/cache";
import Image from "next/image";
import AdminTopbar from "@/components/AdminTopbar";
import ProductUploadForm from "@/components/ProductUploadForm";
import DeleteProductButton from "@/components/DeleteProductButton";
import EditProductForm from "@/components/EditProductForm";
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
      <h1 className="mb-2 text-3xl font-extrabold tracking-tight text-slate-900">Products</h1>
      <p className="mb-6 text-slate-600">
        Upload products with clean category + size structure for better browsing.
      </p>

      <div className="mb-6 grid gap-4 md:grid-cols-3">
        <div className="rounded-2xl border border-slate-200/80 bg-white/95 p-4 shadow-[0_10px_28px_-22px_rgba(2,6,23,0.6)]">
          <p className="text-sm font-medium text-slate-500">Total Products</p>
          <p className="mt-1 text-2xl font-extrabold text-slate-900">{products.length}</p>
        </div>
        <div className="rounded-2xl border border-slate-200/80 bg-white/95 p-4 shadow-[0_10px_28px_-22px_rgba(2,6,23,0.6)]">
          <p className="text-sm font-medium text-slate-500">Active Categories</p>
          <p className="mt-1 text-2xl font-extrabold text-slate-900">{categories.length}</p>
        </div>
        <div className="rounded-2xl border border-slate-200/80 bg-white/95 p-4 shadow-[0_10px_28px_-22px_rgba(2,6,23,0.6)]">
          <p className="text-sm font-medium text-slate-500">Last Update</p>
          <p className="mt-1 text-lg font-bold text-slate-900">Catalog Ready</p>
        </div>
      </div>

      <div className="mb-6 rounded-2xl border border-slate-200/80 bg-white/95 p-5 shadow-[0_10px_28px_-22px_rgba(2,6,23,0.6)]">
        <h2 className="text-lg font-bold text-slate-900">Product Setup Tips</h2>
        <ul className="mt-3 space-y-2 text-sm text-slate-700">
          <li>1) Keep product name clear: style + fabric + gender.</li>
          <li>2) Keep category consistent: Panjabi, Shirt, Sharee, Kids, etc.</li>
          <li>3) Use clean square image for better card quality.</li>
          <li>4) Add available sizes only to reduce wrong orders.</li>
        </ul>
      </div>

      <ProductUploadForm />

      <div className="grid gap-6 md:grid-cols-3">
        {products.length === 0 ? (
          <div className="rounded-xl border border-slate-200 bg-white p-6">
            <p className="text-slate-600">No products found.</p>
          </div>
        ) : (
          products.map((product) => (
            <div
              key={product.id}
              className="rounded-2xl border border-slate-200/80 bg-white/95 p-4 shadow-[0_10px_28px_-22px_rgba(2,6,23,0.6)]"
            >
              <Image
                src={product.image_url}
                alt={product.name}
                width={400}
                height={256}
                className="h-64 w-full rounded-xl object-cover"
              />

              <h3 className="mt-3 font-bold text-slate-900">{product.name}</h3>
              <p className="mt-1 text-sm text-slate-500">{product.category}</p>
              <p className="mt-1 font-semibold text-teal-700">৳{product.price}</p>
              <p className="mt-1 text-sm text-slate-600">
                Sizes: {product.sizes?.length ? product.sizes.join(", ") : "N/A"}
              </p>

              <EditProductForm product={product} />
              <DeleteProductButton productId={product.id} />
            </div>
          ))
        )}
      </div>
    </section>
  );
}
