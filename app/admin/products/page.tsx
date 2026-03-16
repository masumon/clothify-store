import { unstable_noStore as noStore } from "next/cache";
import { createClient } from "@supabase/supabase-js";
import AdminTopbar from "@/components/AdminTopbar";
import ProductUploadForm from "@/components/ProductUploadForm";
import DeleteProductButton from "@/components/DeleteProductButton";
import EditProductForm from "@/components/EditProductForm";

export const dynamic = "force-dynamic";

async function getProducts() {
  noStore();

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  const { data, error } = await supabase
    .from("products")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Admin products fetch error:", error.message);
    return [];
  }

  return data || [];
}

export default async function AdminProductsPage() {
  const products = await getProducts();

  return (
    <section>
      <AdminTopbar />
      <h1 className="mb-6 text-3xl font-bold text-slate-900">Products</h1>

      <ProductUploadForm />

      <div className="grid gap-6 md:grid-cols-3">
        {products.length === 0 ? (
          <div className="rounded-xl border border-slate-200 bg-white p-6">
            <p className="text-slate-600">No products found.</p>
          </div>
        ) : (
          products.map((product: any) => (
            <div
              key={product.id}
              className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm"
            >
              <img
                src={product.image_url}
                alt={product.name}
                className="h-64 w-full rounded-lg object-cover"
              />

              <h3 className="mt-3 font-bold text-slate-900">{product.name}</h3>
              <p className="mt-1 text-sm text-slate-500">{product.category}</p>
              <p className="mt-1 font-semibold text-slate-900">৳{product.price}</p>
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
