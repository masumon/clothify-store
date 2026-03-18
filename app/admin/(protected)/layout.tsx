"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useState } from "react";
import SumonixAIWidget from "@/components/SumonixAIWidget";

type AdminNavItem = {
  href: string;
  label: string;
  iconClass: string;
  badge?: string;
};

const adminNavItems: AdminNavItem[] = [
  { href: "/admin", iconClass: "fa-solid fa-gauge-high", label: "Dashboard" },
  { href: "/admin/products", iconClass: "fa-solid fa-shirt", label: "Products Catalog" },
  { href: "/admin/orders", iconClass: "fa-solid fa-box", label: "Orders", badge: "New" },
  { href: "/admin#customers", iconClass: "fa-solid fa-users", label: "Customers" },
  { href: "/admin#analytics", iconClass: "fa-solid fa-chart-pie", label: "Analytics" },
  { href: "/admin/settings", iconClass: "fa-solid fa-sliders", label: "Store Settings" },
  { href: "/admin#ai", iconClass: "fa-solid fa-robot", label: "SUMONIX AI" },
  { href: "/admin#pos", iconClass: "fa-solid fa-cash-register", label: "POS" },
];

function navItemClass(active: boolean) {
  return `group relative flex items-center gap-3 rounded-xl border px-3 py-2.5 text-sm font-semibold transition ${
    active
      ? "border-amber-300/50 bg-white/10 text-white"
      : "border-slate-800 bg-slate-950/30 text-slate-300 hover:border-slate-700 hover:bg-slate-900/70 hover:text-white"
  }`;
}

function SidebarContent({ pathname, onNavigate }: { pathname: string; onNavigate?: () => void }) {
  return (
    <>
      <div className="flex items-center gap-2.5">
        <div className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-amber-400/20 text-amber-300">
          <i className="fa-solid fa-chart-line" aria-hidden="true" />
        </div>
        <div>
          <h2 className="text-xl font-extrabold tracking-tight text-white">ABO Admin</h2>
          <p className="text-xs text-slate-400">Premium operations console</p>
        </div>
      </div>

      <Link
        href="/"
        onClick={onNavigate}
        className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-xl border border-amber-300/50 bg-amber-400/10 px-4 py-2 text-sm font-semibold text-amber-200 transition hover:bg-amber-400/20"
      >
        <i className="fa-solid fa-arrow-up-right-from-square" aria-hidden="true" />
        View Live Site
      </Link>

      <nav className="mt-5 space-y-2">
        {adminNavItems.map((item) => {
          const active = pathname === item.href || (item.href !== "/admin" && pathname.startsWith(item.href.split("#")[0]));
          return (
            <Link key={item.href} href={item.href} onClick={onNavigate} className={navItemClass(active)}>
              <i className={`${item.iconClass} w-4 text-center`} aria-hidden="true" />
              <span>{item.label}</span>
              {item.badge ? (
                <span className="ml-auto rounded-full bg-amber-400/20 px-2 py-0.5 text-[10px] font-bold uppercase text-amber-200">
                  {item.badge}
                </span>
              ) : null}
              {active ? <span className="absolute left-0 top-2 bottom-2 w-1 rounded-r-full bg-amber-300" /> : null}
            </Link>
          );
        })}
      </nav>
    </>
  );
}

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  return (
    <div className="admin-shell min-h-screen overflow-x-hidden text-slate-100">
      <SumonixAIWidget mode="admin" />
      <div className="grid min-h-screen lg:grid-cols-[280px_1fr]">
        <aside className="admin-sidebar hidden border-r border-slate-800/80 bg-slate-950/95 p-5 backdrop-blur lg:block">
          <SidebarContent pathname={pathname} />
        </aside>

        <div className="min-w-0">
          <div className="sticky top-0 z-40 border-b border-slate-800/70 bg-slate-950/92 px-3 py-3 backdrop-blur lg:hidden">
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <Image
                  src="/icons/icon-192.png"
                  alt="ABO Admin"
                  width={24}
                  height={24}
                  className="h-7 w-7 rounded-full border border-slate-700 object-cover"
                />
                <p className="text-sm font-bold text-white">ABO Admin</p>
              </div>

              <button
                type="button"
                onClick={() => setMobileSidebarOpen(true)}
                className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-slate-700 bg-slate-900 text-slate-200"
                aria-label="Open sidebar"
              >
                <i className="fa-solid fa-bars" aria-hidden="true" />
              </button>
            </div>
          </div>

          {mobileSidebarOpen ? (
            <div className="fixed inset-0 z-50 lg:hidden">
              <button
                type="button"
                onClick={() => setMobileSidebarOpen(false)}
                className="absolute inset-0 bg-black/50 backdrop-blur-[1px]"
                aria-label="Close sidebar overlay"
              />
              <aside className="relative h-full w-[84vw] max-w-[320px] border-r border-slate-800 bg-slate-950 p-5 shadow-2xl">
                <div className="mb-3 flex items-center justify-end">
                  <button
                    type="button"
                    onClick={() => setMobileSidebarOpen(false)}
                    className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-slate-700 bg-slate-900 text-slate-200"
                    aria-label="Close sidebar"
                  >
                    <i className="fa-solid fa-xmark" aria-hidden="true" />
                  </button>
                </div>
                <SidebarContent pathname={pathname} onNavigate={() => setMobileSidebarOpen(false)} />
              </aside>
            </div>
          ) : null}

          <main className="p-4 sm:p-5 md:p-7">{children}</main>
        </div>
      </div>
    </div>
  );
}
