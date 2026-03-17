import Header from "@/components/Header";
import Footer from "@/components/Footer";
import MobileStickyBar from "@/components/MobileStickyBar";
import Link from "next/link";

export const revalidate = 120;

export default function ProfileOrdersPage() {
  return (
    <main className="pb-24 md:pb-0">
      <Header storeName="Clothify" slogan="Find Your Fit" logoUrl="" whatsappNumber="8801811314262" />

      <section className="mx-auto max-w-3xl space-y-6 px-4 py-6 sm:py-8">
        <div className="rounded-3xl border border-slate-200 bg-white p-6">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-slate-500">Orders</p>
          <h1 className="mt-2 text-2xl font-extrabold text-slate-900">My Orders & Tracking</h1>
          <p className="mt-2 text-sm text-slate-600">Order status জানতে WhatsApp support ব্যবহার করুন।</p>
        </div>

        <div className="rounded-3xl border border-slate-200 bg-white p-6">
          <div className="grid gap-3 sm:grid-cols-2">
            <Link
              href="/order-success"
              className="rounded-2xl border border-slate-300 bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-700"
            >
              📄 Last Invoice / Confirmation
            </Link>
            <a
              href="https://wa.me/8801811314262?text=%E0%A6%86%E0%A6%AE%E0%A6%BE%E0%A6%B0%20order%20status%20%E0%A6%9C%E0%A6%BE%E0%A6%A8%E0%A6%A4%E0%A7%87%20%E0%A6%9A%E0%A6%BE%E0%A6%87"
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-2xl bg-emerald-600 px-4 py-3 text-center text-sm font-bold text-white"
            >
              💬 Track with WhatsApp
            </a>
          </div>
        </div>
      </section>

      <Footer storeName="Clothify" address="" phone="" />
      <MobileStickyBar />
    </main>
  );
}
