"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import {
  type Language,
  PREFERENCE_EVENT,
  readSitePreferences,
} from "@/lib/site-preferences";

export default function BottomNav() {
  const pathname = usePathname();
  const [lang, setLang] = useState<Language>("bn");

  useEffect(() => {
    const sync = () => setLang(readSitePreferences().language);
    sync();
    window.addEventListener(PREFERENCE_EVENT, sync);
    return () => window.removeEventListener(PREFERENCE_EVENT, sync);
  }, []);

  const items = useMemo(
    () => [
      { href: "/", icon: "🏠", label: lang === "bn" ? "হোম" : "Home", external: false },
      {
        href: "/categories",
        icon: "🧭",
        label: lang === "bn" ? "ক্যাটাগরি" : "Categories",
        external: false,
      },
      { href: "/offers", icon: "🏷️", label: lang === "bn" ? "অফার" : "Offers", external: false },
      { href: "/cart", icon: "🛒", label: lang === "bn" ? "কার্ট" : "Cart", external: false },
      { href: "/profile", icon: "👤", label: lang === "bn" ? "প্রোফাইল" : "Profile", external: false },
      { href: "/help", icon: "💬", label: lang === "bn" ? "হেল্প" : "Help", external: false },
    ],
    [lang]
  );

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-slate-200 bg-white md:hidden">
      <div className="grid grid-cols-6 gap-1 px-1 py-1.5">
        {items.map((item) => {
          const active =
            !item.external &&
            (pathname === item.href ||
              (item.href !== "/" && pathname.startsWith(item.href)));

          const cls = `min-w-[74px] flex flex-col items-center gap-0.5 rounded-xl px-1 py-2 text-center transition ${
            active ? "text-green-700" : "text-slate-400"
          }`;

          return item.external ? (
            <a
              key={item.href}
              href={item.href}
              target="_blank"
              rel="noreferrer"
              className={cls}
            >
              <span className="text-xl leading-none">{item.icon}</span>
              <span className="text-[10px] font-semibold">{item.label}</span>
            </a>
          ) : (
            <Link key={item.href} href={item.href} className={cls}>
              <span className="text-xl leading-none">{item.icon}</span>
              <span className="text-[10px] font-semibold">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
