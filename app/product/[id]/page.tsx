import Link from "next/link";
import Header from "@/components/Header";
import AddToCartButton from "@/components/AddToCartButton";
import BottomNav from "@/components/BottomNav";
import { getProductById, getStoreSettings } from "@/lib/data";

export default async function ProductDetailsPage({
  params,
}: {
  params: { id: string };
}) {
  const settings = await getStoreSettings();
  const product = await getProductById(params.id);

  if (!product) {
    return (
      <main className="pb-20">
        <Header
          storeName={settings?.store_name || "Clothify"}
          slogan={settings?.slogan || "Find Your Fit"}
          logoUrl={settings?.logo_url || ""}
        />

        <section className="mx-auto max-w-4xl px-4 py-10 text-center">
          <h2 className="text-2xl font-bold text-slate-900">Product not found</h2>
          <Link
            href="/"
            className="mt-4 inline-block rounded-lg bg-black px-5 py-3 text-white"
          >
            Back to Shop
          </Link>
        </section>

        <BottomNav />
      </main>
    );
  }

  return (
    <main className="pb-20">
      <Header
        storeName={settings?.store_name || "Clothify"}
        slogan={settings?.slogan || "Find Your Fit"}
        logoUrl={settings?.logo_url || ""}
      />

      <section className="mx-auto grid max-w-6xl gap-8 px-4 py-10 md:grid-cols-2">
        <div>
          <img
            src={product.image_url}
            alt={product.name}
            className="w-full rounded-2xl border border-slate-200 object-cover"
          />
        </div>

        <div>
          <p className="text-sm font-semibold uppercase tracking-wide text-slate-500">
            {product.category}
          </p>

          <h1 className="mt-2 text-3xl font-bold text-slate-900">
            {product.name}
          </h1>

          <p className="mt-4 text-2xl font-bold text-pink-600">
            ৳{product.price}
          </p>

          <AddToCartButton product={product} />

          <div className="mt-4">
            <a
              href={`https://wa.me/${settings?.whatsapp_number || "8801805996960"}`}
              target="_blank"
              className="inline-block rounded-lg bg-green-600 px-5 py-3 text-sm font-medium text-white"
            >
              Order via WhatsApp
            </a>
          </div>
        </div>
      </section>

      <BottomNav />
    </main>
  );
}
