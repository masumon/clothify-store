import Link from "next/link";
import Header from "@/components/Header";
import AddToCartButton from "@/components/AddToCartButton";
import BottomNav from "@/components/BottomNav";
import WhatsAppOrderButton from "@/components/WhatsAppOrderButton";
import Footer from "@/components/Footer";
import ProductZoomViewer from "@/components/ProductZoomViewer";
import { getProductById, getStoreSettings } from "@/lib/data";

export const revalidate = 120;

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
          <ProductZoomViewer
            imageUrl={product.image_url}
            productName={product.name}
          />
        </div>

        <div>
          <div className="mb-4">
            <Link
              href="/"
              className="inline-flex items-center gap-1 rounded-full border border-slate-300 px-3 py-1.5 text-xs font-semibold text-slate-700 transition hover:bg-slate-50"
            >
              🏠 Back to Home
            </Link>
          </div>

          <p className="text-sm font-semibold uppercase tracking-wide text-slate-500">
            {product.category}
          </p>

          <div className="mt-3 flex flex-wrap gap-2">
            {product.is_featured ? (
              <span className="rounded-full bg-slate-900 px-3 py-1 text-xs font-bold text-white">
                Featured Product
              </span>
            ) : null}
            {product.campaign_badge ? (
              <span className="rounded-full bg-rose-100 px-3 py-1 text-xs font-bold text-rose-700">
                {product.campaign_badge}
              </span>
            ) : null}
            <span className={`rounded-full px-3 py-1 text-xs font-bold ${(product.stock_quantity ?? 20) <= 5 ? "bg-amber-100 text-amber-700" : "bg-emerald-100 text-emerald-700"}`}>
              {(product.stock_quantity ?? 20) <= 0
                ? "Out of stock"
                : (product.stock_quantity ?? 20) <= 5
                ? `Low stock: ${product.stock_quantity ?? 20}`
                : `In stock: ${product.stock_quantity ?? 20}`}
            </span>
          </div>

          <h1 className="mt-2 text-3xl font-bold text-slate-900">
            {product.name}
          </h1>

          <p className="mt-4 text-2xl font-bold text-pink-600">
            ৳{product.price}
          </p>

          <AddToCartButton product={product} />

          <div className="mt-4">
            <WhatsAppOrderButton
              phone={settings?.whatsapp_number || "8801811314262"}
              productName={product.name}
              price={product.price}
            />
          </div>
        </div>
      </section>

      <Footer
        storeName={settings?.store_name || "Clothify"}
        address={settings?.address || ""}
        phone={settings?.contact_phone || ""}
      />

      <BottomNav />
    </main>
  );
}
