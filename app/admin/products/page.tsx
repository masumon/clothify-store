import { supabase } from "@/lib/supabase";

async function getProducts() {
  const { data } = await supabase.from("products").select("*");
  return data || [];
}

export default async function AdminProductsPage() {
  const products = await getProducts();

  return (
    <section>
      <h1 className="text-3xl font-bold mb-6">Products</h1>

      <div className="grid gap-6 md:grid-cols-3">
        {products.map((product:any)=>(
          <div key={product.id} className="border p-4 rounded-xl">
            <img src={product.image_url} className="rounded-lg"/>
            <h3 className="mt-3 font-bold">{product.name}</h3>
            <p>৳{product.price}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
