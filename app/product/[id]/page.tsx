import Link from "next/link";
import Header from "@/components/Header";
import AddToCartButton from "@/components/AddToCartButton";
import BottomNav from "@/components/BottomNav";
import WhatsAppOrderButton from "@/components/WhatsAppOrderButton";
import Footer from "@/components/Footer";
import ProductZoomViewer from "@/components/ProductZoomViewer";
import DeliveryCheck from "@/components/DeliveryCheck";
import ReviewUploadForm from "@/components/ReviewUploadForm";
import { getProductById, getStoreSettings } from "@/lib/data";

export const revalidate = 120;

type ProductDetailsPageProps = {
  params: Promise<{ id: string }>;
};

export default async function ProductDetailsPage({ params }: ProductDetailsPageProps) {
  const resolvedParams = await params;
  const settings = await getStoreSettings();
  const product = await getProductById(resolvedParams.id);

  if (!product) {
    return (
      <main className="pb-20">
        <Header
          storeName={settings?.store_name || "Clothify"}
          slogan={settings?.slogan || "Find Your Fit"}
          logoUrl={settings?.logo_url || ""}
          whatsappNumber={settings?.whatsapp_number || "8801811314262"}
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
        whatsappNumber={settings?.whatsapp_number || "8801811314262"}
      />

      <section className="mx-auto grid max-w-6xl gap-8 px-4 py-10 md:grid-cols-2">
        <div className="md:col-span-2 -mb-2 flex flex-wrap items-center gap-2 text-xs font-semibold text-slate-500">
          <Link href="/" className="hover:text-slate-700">Home</Link>
          <span>›</span>
          <Link href="/categories" className="hover:text-slate-700">Categories</Link>
          <span>›</span>
          <span className="rounded-full bg-slate-100 px-2 py-1 text-slate-700">{product.name}</span>
        </div>

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

          <div className="mt-4 grid grid-cols-2 gap-2 text-[11px] font-semibold sm:flex sm:flex-wrap">
            <span className="rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-emerald-800">✅ COD Available</span>
            <span className="rounded-full border border-fuchsia-200 bg-fuchsia-50 px-3 py-1 text-fuchsia-800">💳 bKash</span>
            <span className="rounded-full border border-orange-200 bg-orange-50 px-3 py-1 text-orange-800">💳 Nagad</span>
            <span className="rounded-full border border-cyan-200 bg-cyan-50 px-3 py-1 text-cyan-800">🔁 7 Days Exchange</span>
          </div>

          <div className="mt-4 rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-700">
            <p><b>Fabric:</b> Premium breathable cotton blend</p>
            <p className="mt-1"><b>Fit:</b> Smart regular fit, daily + event ready</p>
            <p className="mt-1"><b>Delivery:</b> 2-5 days (location based)</p>
          </div>

          <div className="mt-4">
            <DeliveryCheck compact />
          </div>

          <div id="purchase-actions">
            <AddToCartButton product={product} />
          </div>

          <div className="mt-4">
            <WhatsAppOrderButton
              phone={settings?.whatsapp_number || "8801811314262"}
              productName={product.name}
              price={product.price}
            />
          </div>

          <p className="mt-3 text-xs font-medium text-slate-500">
            Need size help? Ask on WhatsApp before placing order.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 pb-10">
        <div className="grid gap-4 md:grid-cols-2">
          <div className="rounded-3xl border border-slate-200 bg-white p-5">
            <h3 className="text-lg font-bold text-slate-900">Exchange & Return</h3>
            <p className="mt-2 text-sm text-slate-600">
              Product পাওয়ার 7 দিনের মধ্যে exchange request করা যাবে। Damage/used item applicable না।
            </p>
            <Link
              href="/size-guide"
              className="mt-3 inline-flex rounded-full border border-slate-300 bg-slate-50 px-4 py-2 text-sm font-semibold text-slate-700"
            >
              📏 View Size Guide & Policy
            </Link>
          </div>

          <ReviewUploadForm productId={product.id} />
        </div>
      </section>

      <Footer
        storeName={settings?.store_name || "Clothify"}
        address={settings?.address || ""}
        phone={settings?.contact_phone || ""}
      />

      <div className="fixed bottom-16 left-0 right-0 z-40 border-t border-slate-200 bg-white/95 p-2 backdrop-blur md:hidden">
        <div className="grid grid-cols-3 gap-2">
          <a
            href="#purchase-actions"
            className="rounded-xl border border-slate-300 bg-white px-2 py-2 text-center text-xs font-bold text-slate-700"
          >
            🛒 Add
          </a>
          <Link
            href="/checkout"
            className="rounded-xl bg-teal-700 px-2 py-2 text-center text-xs font-bold text-white"
          >
            ✅ Buy Now
          </Link>
          <a
            href={`https://wa.me/${settings?.whatsapp_number || "8801811314262"}?text=${encodeURIComponent(`ভাই, ${product.name} নিয়ে help লাগবে`)}`}
            target="_blank"
            rel="noreferrer"
            className="rounded-xl bg-emerald-600 px-2 py-2 text-center text-xs font-bold text-white"
          >
            💬 Ask
          </a>
        </div>
      </div>

      <BottomNav />
    </main>
  );
}
