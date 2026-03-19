"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import type { ComponentProps } from "react";
import AppIcon from "@/components/AppIcon";
import SumonixAIWidget from "@/components/SumonixAIWidget";
import { getDictionary } from "@/lib/i18n";
import {
  type Language,
  PREFERENCE_EVENT,
  readSitePreferences,
} from "@/lib/site-preferences";

type AdminNavItem = {
  href: string;
  label: string;
  icon: ComponentProps<typeof AppIcon>["name"];
  badge?: string;
};

function navItemClass(active: boolean) {
  return `group relative flex items-center gap-3 rounded-2xl border px-3.5 py-3 text-sm font-semibold transition ${
    active
      ? "border-amber-300/40 bg-white/10 text-white shadow-[0_14px_32px_-28px_rgba(251,191,36,0.45)]"
      : "border-slate-800/80 bg-slate-950/20 text-slate-300 hover:border-slate-700 hover:bg-slate-900/70 hover:text-white"
  }`;
}

function SidebarContent({
  pathname,
  onNavigate,
  items,
  premiumConsoleLabel,
  liveSiteLabel,
}: {
  pathname: string;
  onNavigate?: () => void;
  items: AdminNavItem[];
  premiumConsoleLabel: string;
  liveSiteLabel: string;
}) {
  return (
    <>
      <div className="flex items-center gap-3">
        <Image
          src="/icons/icon-192.png"
          alt="Clothify Admin"
          width={44}
          height={44}
          className="h-11 w-11 rounded-2xl border border-white/10 object-cover shadow-[0_16px_30px_-22px_rgba(0,0,0,0.8)]"
        />
        <div>
          <h2 className="text-lg font-black tracking-tight text-white">Clothify Admin</h2>
          <p className="text-xs text-slate-400">{premiumConsoleLabel}</p>
        </div>
      </div>

      <div className="mt-6 rounded-[26px] border border-white/10 bg-white/5 p-4">
        <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-slate-400">Workspace</p>
        <p className="mt-2 text-sm leading-6 text-slate-300">
          Orders, catalog, analytics, and storefront controls stay in one responsive admin surface.
        </p>
        <Link
          href="/"
          onClick={onNavigate}
          className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-2xl border border-amber-300/40 bg-amber-300/10 px-4 py-2.5 text-sm font-semibold text-amber-100 transition hover:bg-amber-300/20"
        >
          <AppIcon name="external" className="h-4.5 w-4.5" />
          {liveSiteLabel}
        </Link>
      </div>

      <nav className="mt-6 space-y-2">
        {items.map((item) => {
          const active = pathname === item.href || (item.href !== "/admin" && pathname.startsWith(item.href.split("#")[0]));
          return (
            <Link key={item.href} href={item.href} onClick={onNavigate} className={navItemClass(active)}>
              <span className="inline-flex h-10 w-10 items-center justify-center rounded-2xl border border-white/10 bg-white/5 text-slate-100">
                <AppIcon name={item.icon} className="h-4.5 w-4.5" />
              </span>
              <span className="flex-1">{item.label}</span>
              {item.badge ? (
                <span className="rounded-full bg-amber-300/15 px-2 py-0.5 text-[10px] font-bold uppercase tracking-[0.12em] text-amber-200">
                  {item.badge}
                </span>
              ) : null}
              {active ? <span className="absolute left-0 top-3 bottom-3 w-1 rounded-r-full bg-amber-300" /> : null}
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
  const [lang, setLang] = useState<Language>("bn");

  useEffect(() => {
    const syncLanguage = () => setLang(readSitePreferences().language);
    syncLanguage();
    window.addEventListener(PREFERENCE_EVENT, syncLanguage);
    return () => window.removeEventListener(PREFERENCE_EVENT, syncLanguage);
  }, []);

  const dict = getDictionary(lang);
  const adminNavItems: AdminNavItem[] = [
    { href: "/admin", icon: "dashboard", label: dict.admin.dashboard },
    { href: "/admin/products", icon: "shirt", label: dict.admin.productsCatalog },
    { href: "/admin/orders", icon: "package", label: dict.admin.orders, badge: "New" },
    { href: "/admin#customers", icon: "users", label: dict.admin.customers },
    { href: "/admin#analytics", icon: "pieChart", label: dict.admin.analytics },
    { href: "/admin/settings", icon: "sliders", label: dict.admin.storeSettings },
    { href: "/admin#ai", icon: "bot", label: dict.admin.sumonixZone },
    { href: "/admin#pos", icon: "pos", label: dict.admin.pos },
  ];

  return (
    <div className="admin-shell min-h-screen overflow-x-hidden text-slate-900">
      <SumonixAIWidget mode="admin" />
      <div className="grid min-h-screen lg:grid-cols-[300px_1fr]">
        <aside className="admin-sidebar hidden p-5 lg:sticky lg:top-0 lg:block lg:h-screen lg:overflow-y-auto">
          <SidebarContent
            pathname={pathname}
            items={adminNavItems}
            premiumConsoleLabel={dict.admin.premiumConsole}
            liveSiteLabel={dict.admin.viewLiveSite}
          />
        </aside>

        <div className="min-w-0">
          <div className="sticky top-0 z-40 border-b border-slate-200/80 bg-white/85 px-4 py-3 shadow-[0_14px_30px_-30px_rgba(2,6,23,0.8)] backdrop-blur lg:hidden">
            <div className="flex items-center justify-between gap-3">
              <div className="flex min-w-0 items-center gap-3">
                <Image
                  src="/icons/icon-192.png"
                  alt="Clothify Admin"
                  width={28}
                  height={28}
                  className="h-9 w-9 rounded-2xl border border-slate-200 object-cover"
                />
                <div className="min-w-0">
                  <p className="truncate text-sm font-black text-slate-900">Clothify Admin</p>
                  <p className="truncate text-[11px] text-slate-500">{dict.admin.dashboardOverview}</p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setMobileSidebarOpen(true)}
                className="inline-flex h-10 w-10 items-center justify-center rounded-2xl border border-slate-200 bg-white text-slate-700 shadow-sm"
                aria-label="Open sidebar"
              >
                <AppIcon name="menu" className="h-5 w-5" />
              </button>
            </div>
          </div>

          {mobileSidebarOpen ? (
            <div className="fixed inset-0 z-50 lg:hidden">
              <button
                type="button"
                onClick={() => setMobileSidebarOpen(false)}
                className="absolute inset-0 bg-slate-950/55 backdrop-blur-[2px]"
                aria-label="Close sidebar overlay"
              />
              <aside className="admin-sidebar relative h-full w-[86vw] max-w-[340px] overflow-y-auto p-5 shadow-2xl">
                <div className="mb-4 flex items-center justify-end">
                  <button
                    type="button"
                    onClick={() => setMobileSidebarOpen(false)}
                    className="inline-flex h-10 w-10 items-center justify-center rounded-2xl border border-white/10 bg-white/5 text-slate-200"
                    aria-label="Close sidebar"
                  >
                    <AppIcon name="close" className="h-5 w-5" />
                  </button>
                </div>
                <SidebarContent
                  pathname={pathname}
                  onNavigate={() => setMobileSidebarOpen(false)}
                  items={adminNavItems}
                  premiumConsoleLabel={dict.admin.premiumConsole}
                  liveSiteLabel={dict.admin.viewLiveSite}
                />
              </aside>
            </div>
          ) : null}

          <main className="mx-auto w-full max-w-7xl p-4 sm:p-5 lg:p-8">{children}</main>
        </div>
      </div>
    </div>
  );
}
