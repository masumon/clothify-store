import Link from "next/link";
import SumonixAIWidget from "@/components/SumonixAIWidget";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="admin-shell min-h-screen bg-[#121212] text-slate-100">
      <SumonixAIWidget mode="admin" />
      <div className="grid min-h-screen md:grid-cols-[270px_1fr]">
        <aside className="admin-sidebar border-r border-slate-700/60 bg-slate-950/80 p-6 backdrop-blur">
          <h2 className="text-2xl font-extrabold tracking-tight text-white">
            Clothfy Admin
          </h2>
          <p className="mt-1 text-sm text-slate-300">Data-driven POS and operations control</p>

          <nav className="mt-6 space-y-2">
            <Link
              href="/admin"
              className="block rounded-xl border border-slate-700 px-4 py-3 font-semibold text-slate-100 transition hover:bg-slate-800"
            >
              📊 Dashboard
            </Link>
            <Link
              href="/admin#pos"
              className="block rounded-xl border border-slate-700 px-4 py-3 font-semibold text-slate-100 transition hover:bg-slate-800"
            >
              🧾 POS
            </Link>
            <Link
              href="/admin/orders"
              className="block rounded-xl border border-slate-700 px-4 py-3 font-semibold text-slate-100 transition hover:bg-slate-800"
            >
              📦 Orders
            </Link>
            <Link
              href="/admin/products"
              className="block rounded-xl border border-slate-700 px-4 py-3 font-semibold text-slate-100 transition hover:bg-slate-800"
            >
              🗂️ Inventory
            </Link>
            <Link
              href="/admin/products"
              className="block rounded-xl border border-slate-700 px-4 py-3 font-semibold text-slate-100 transition hover:bg-slate-800"
            >
              👔 Products
            </Link>
            <Link
              href="/admin/orders"
              className="block rounded-xl border border-slate-700 px-4 py-3 font-semibold text-slate-100 transition hover:bg-slate-800"
            >
              👥 Customers
            </Link>
            <Link
              href="/admin/settings"
              className="block rounded-xl border border-slate-700 px-4 py-3 font-semibold text-slate-100 transition hover:bg-slate-800"
            >
              ⚙️ Settings
            </Link>
            <Link
              href="/admin#ai"
              className="block rounded-xl border border-slate-700 px-4 py-3 font-semibold text-slate-100 transition hover:bg-slate-800"
            >
              🤖 AI Assistant
            </Link>
          </nav>

          <div className="mt-8 rounded-2xl border border-slate-700 bg-slate-900/70 p-4">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-300">
              Quick Access
            </p>
            <Link
              href="/"
              className="mt-3 inline-flex w-full items-center justify-center rounded-full bg-emerald-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-emerald-500"
            >
              Back To Website
            </Link>
          </div>
        </aside>

        <main className="p-6 md:p-8">{children}</main>
      </div>
    </div>
  );
}
