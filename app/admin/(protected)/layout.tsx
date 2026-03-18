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
  return `group relative flex items-center gap-3 rounded-xl border px-3 py-2.5 text-sm font-semibold transition ${
    active
      ? "border-amber-300/50 bg-white/10 text-white"
      : "border-slate-800 bg-slate-950/30 text-slate-300 hover:border-slate-700 hover:bg-slate-900/70 hover:text-white"
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
      <div className="flex items-center gap-2.5">
        <div className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-amber-400/20 text-amber-300">
          <AppIcon name="chart" className="h-5 w-5" />
        </div>
        <div>
          <h2 className="text-xl font-extrabold tracking-tight text-white">ABO Admin</h2>
          <p className="text-xs text-slate-400">{premiumConsoleLabel}</p>
        </div>
      </div>

      <Link
        href="/"
        onClick={onNavigate}
        className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-xl border border-amber-300/50 bg-amber-400/10 px-4 py-2 text-sm font-semibold text-amber-200 transition hover:bg-amber-400/20"
      >
        <AppIcon name="external" className="h-4.5 w-4.5" />
        {liveSiteLabel}
      </Link>

      <nav className="mt-5 space-y-2">
        {items.map((item) => {
          const active = pathname === item.href || (item.href !== "/admin" && pathname.startsWith(item.href.split("#")[0]));
          return (
            <Link key={item.href} href={item.href} onClick={onNavigate} className={navItemClass(active)}>
              <AppIcon name={item.icon} className="h-4.5 w-4.5" />
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
    <div className="admin-shell min-h-screen overflow-x-hidden text-slate-100">
      <SumonixAIWidget mode="admin" />
      <div className="grid min-h-screen lg:grid-cols-[280px_1fr]">
        <aside className="admin-sidebar hidden border-r border-slate-800/80 bg-slate-950/95 p-5 backdrop-blur lg:block">
          <SidebarContent
            pathname={pathname}
            items={adminNavItems}
            premiumConsoleLabel={dict.admin.premiumConsole}
            liveSiteLabel={dict.admin.viewLiveSite}
          />
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
                <AppIcon name="menu" className="h-5 w-5" />
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

          <main className="p-4 sm:p-5 md:p-7">{children}</main>
        </div>
      </div>
    </div>
  );
}
