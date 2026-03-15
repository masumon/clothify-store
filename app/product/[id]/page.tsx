import Link from "next/link";
import Header from "@/components/Header";
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
      <main>
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
      </main>
    );
  }

  return (
    <main>
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

          <div className="mt-6">
            <h3 className="text-sm font-semibold text-slate-700">Available Sizes</h3>
            <div className="mt-3 flex flex-wrap gap-2">
              {product.sizes?.map((size: string) => (
                <span
                  key={size}
                  className="rounded-full border border-slate-300 px-4 py-2 text-sm text-slate-700"
                >
                  {size}
                </span>
              ))}
            </div>
          </div>

          <div className="mt-8 flex gap-3">
            <Link
              href="/cart"
              className="rounded-lg bg-black px-5 py-3 text-sm font-medium text-white"
            >
              Add to Cart
            </Link>

            <a
              href={`https://wa.me/${settings?.whatsapp_number || "8801805996960"}`}
              target="_blank"
              className="rounded-lg bg-green-600 px-5 py-3 text-sm font-medium text-white"
            >
              Order via WhatsApp
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}
