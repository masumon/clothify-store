import Link from "next/link";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-cyan-50/30 to-emerald-50/20">
      <div className="grid min-h-screen md:grid-cols-[270px_1fr]">
        <aside className="border-r border-slate-200/80 bg-white/90 p-6 backdrop-blur">
          <h2 className="text-2xl font-extrabold tracking-tight text-slate-900">
            Admin Panel
          </h2>
          <p className="mt-1 text-sm text-slate-500">Manage products, orders, settings</p>

          <nav className="mt-6 space-y-2">
            <Link
              href="/admin"
              className="block rounded-xl border border-slate-200 px-4 py-3 font-semibold text-slate-700 transition hover:bg-slate-100"
            >
              Overview
            </Link>
            <Link
              href="/admin/orders"
              className="block rounded-xl border border-slate-200 px-4 py-3 font-semibold text-slate-700 transition hover:bg-slate-100"
            >
              Orders
            </Link>
            <Link
              href="/admin/products"
              className="block rounded-xl border border-slate-200 px-4 py-3 font-semibold text-slate-700 transition hover:bg-slate-100"
            >
              Products
            </Link>
            <Link
              href="/admin/settings"
              className="block rounded-xl border border-slate-200 px-4 py-3 font-semibold text-slate-700 transition hover:bg-slate-100"
            >
              Settings
            </Link>
          </nav>

          <div className="mt-8 rounded-2xl border border-slate-200 bg-slate-50 p-4">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
              Quick Access
            </p>
            <Link
              href="/"
              className="mt-3 inline-flex w-full items-center justify-center rounded-full bg-teal-700 px-4 py-2 text-sm font-semibold text-white transition hover:bg-teal-800"
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
