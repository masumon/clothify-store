import Link from "next/link";
import SumonixAIWidget from "@/components/SumonixAIWidget";

const adminNavItems = [
  { href: "/admin", icon: "📊", label: "Dashboard" },
  { href: "/admin/orders", icon: "📦", label: "Orders" },
  { href: "/admin/products", icon: "🗂️", label: "Products" },
  { href: "/admin/settings", icon: "⚙️", label: "Settings" },
  { href: "/admin#ai", icon: "🤖", label: "AI Assistant" },
];

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="admin-shell min-h-screen overflow-x-hidden bg-[#121212] text-slate-100">
      <SumonixAIWidget mode="admin" />
      <div className="grid min-h-screen md:grid-cols-[270px_1fr]">
        <aside className="admin-sidebar hidden border-r border-slate-700/60 bg-slate-950/80 p-6 backdrop-blur md:block">
          <h2 className="text-2xl font-extrabold tracking-tight text-white">
            Clothfy Admin
          </h2>
          <p className="mt-1 text-sm text-slate-300">Data-driven POS and operations control</p>

          <nav className="mt-6 space-y-2">
            {adminNavItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="block rounded-xl border border-slate-700 px-4 py-3 font-semibold text-slate-100 transition hover:bg-slate-800"
              >
                {item.icon} {item.label}
              </Link>
            ))}
            <Link
              href="/admin#pos"
              className="block rounded-xl border border-slate-700 px-4 py-3 font-semibold text-slate-100 transition hover:bg-slate-800"
            >
              🧾 POS
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

        <div className="min-w-0">
          <div className="sticky top-0 z-40 border-b border-slate-700/70 bg-slate-950/90 px-3 py-3 backdrop-blur md:hidden">
            <div className="flex items-center justify-between gap-3">
              <p className="text-sm font-bold text-white">Clothfy Admin</p>
              <Link
                href="/"
                className="rounded-full border border-slate-600 px-3 py-1 text-xs font-semibold text-slate-200"
              >
                Website
              </Link>
            </div>
            <nav className="mt-3 overflow-x-auto pb-1">
              <div className="flex min-w-max gap-2">
                {[...adminNavItems, { href: "/admin#pos", icon: "🧾", label: "POS" }].map((item) => (
                  <Link
                    key={`mobile-${item.href}`}
                    href={item.href}
                    className="rounded-full border border-slate-700 bg-slate-900/70 px-3 py-1.5 text-xs font-semibold text-slate-100"
                  >
                    {item.icon} {item.label}
                  </Link>
                ))}
              </div>
            </nav>
          </div>

          <main className="p-4 sm:p-5 md:p-8">{children}</main>
        </div>
      </div>
    </div>
  );
}
