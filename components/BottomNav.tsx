"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import type { ComponentProps } from "react";
import AppIcon from "@/components/AppIcon";
import { getDictionary } from "@/lib/i18n";
import {
  type Language,
  PREFERENCE_EVENT,
  readSitePreferences,
  type UiMode,
} from "@/lib/site-preferences";

export default function BottomNav() {
  const pathname = usePathname();
  const [lang, setLang] = useState<Language>("bn");
  const [uiMode, setUiMode] = useState<UiMode>("default");

  useEffect(() => {
    const sync = () => {
      const prefs = readSitePreferences();
      setLang(prefs.language);
      setUiMode(prefs.uiMode);
    };
    sync();
    window.addEventListener(PREFERENCE_EVENT, sync);
    return () => window.removeEventListener(PREFERENCE_EVENT, sync);
  }, []);

  const dict = getDictionary(lang);
  const items = useMemo(
    () => [
      { href: "/", icon: "home", label: dict.common.home, external: false },
      {
        href: "/categories",
        icon: "categories",
        label: dict.common.categories,
        external: false,
      },
      { href: "/offers", icon: "offers", label: dict.common.offers, external: false },
      { href: "/cart", icon: "cart", label: dict.common.cart, external: false },
      { href: "/profile", icon: "profile", label: dict.common.profile, external: false },
      { href: "/fb", icon: "landing", label: dict.common.landing, external: false },
    ],
    [dict.common.cart, dict.common.categories, dict.common.home, dict.common.landing, dict.common.offers, dict.common.profile]
  );

  return (
    <nav
      className={`fixed bottom-0 left-0 right-0 z-50 border-t md:hidden ${
        uiMode === "abo"
          ? "border-slate-900 bg-slate-900/95 text-white backdrop-blur"
          : "border-slate-200 bg-white"
      }`}
    >
      <div className="grid grid-cols-6 gap-1 px-1 py-1.5">
        {items.map((item) => {
          const active =
            !item.external &&
            (pathname === item.href ||
              (item.href !== "/" && pathname.startsWith(item.href)));

          const cls = `min-w-[74px] flex flex-col items-center gap-0.5 rounded-xl px-1 py-2 text-center transition ${
            uiMode === "abo"
              ? active
                ? "bg-white/10 text-amber-300"
                : "text-slate-400"
              : active
                ? "text-green-700"
                : "text-slate-400"
          }`;

          return item.external ? (
            <a
              key={item.href}
              href={item.href}
              target="_blank"
              rel="noreferrer"
              className={cls}
            >
              <AppIcon name={item.icon as ComponentProps<typeof AppIcon>["name"]} className="h-5 w-5" />
              <span className="text-[10px] font-semibold">{item.label}</span>
            </a>
          ) : (
            <Link key={item.href} href={item.href} className={cls}>
              <AppIcon name={item.icon as ComponentProps<typeof AppIcon>["name"]} className="h-5 w-5" />
              <span className="text-[10px] font-semibold">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
