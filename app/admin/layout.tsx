import Link from "next/link";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-slate-100">
      <div className="grid min-h-screen md:grid-cols-[240px_1fr]">
        <aside className="border-r border-slate-200 bg-white p-6">
          <h2 className="text-2xl font-bold text-slate-900">Admin Panel</h2>

          <nav className="mt-6 space-y-2">
            <Link
              href="/admin/orders"
              className="block rounded-lg px-4 py-3 text-slate-700 hover:bg-slate-100"
            >
              Orders
            </Link>
            <Link
              href="/admin/products"
              className="block rounded-lg px-4 py-3 text-slate-700 hover:bg-slate-100"
            >
              Products
            </Link>
            <Link
              href="/admin/settings"
              className="block rounded-lg px-4 py-3 text-slate-700 hover:bg-slate-100"
            >
              Settings
            </Link>
          </nav>
        </aside>

        <main className="p-6">{children}</main>
      </div>
    </div>
  );
}
