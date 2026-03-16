"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

type HeaderProps = {
  storeName?: string;
  slogan?: string;
  logoUrl?: string;
};

export default function Header({
  storeName = "Clothify",
  slogan = "Find Your Fit",
  logoUrl,
}: HeaderProps) {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);

  const navItems = [
    {
      href: "/",
      label: "Shop",
      icon: "🛍️",
      color: "border-blue-200 bg-blue-50 text-blue-900 hover:bg-blue-100",
    },
    {
      href: "/cart",
      label: "Cart",
      icon: "🛒",
      color: "border-orange-200 bg-orange-50 text-orange-900 hover:bg-orange-100",
    },
    {
      href: "/checkout",
      label: "Checkout",
      icon: "✅",
      color: "border-green-200 bg-green-50 text-green-900 hover:bg-green-100",
    },
    {
      href: "/admin",
      label: "Admin",
      icon: "🔒",
      color: "border-slate-300 bg-slate-100 text-slate-800 hover:bg-slate-200",
    },
  ];

  const mobileMenuItems = [
    ...navItems,
    {
      href: "/settings",
      label: "Settings",
      icon: "⚙️",
      color: "border-purple-200 bg-purple-50 text-purple-900 hover:bg-purple-100",
    },
  ];

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200 bg-white">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        <Link href="/" className="flex items-center gap-3">
          {logoUrl ? (
            <Image
              src={logoUrl}
              alt={storeName}
              width={48}
              height={48}
              className="h-12 w-12 rounded-full border border-slate-200 object-cover"
            />
          ) : (
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-black text-white font-bold">
              C
            </div>
          )}

          <div>
            <h1 className="text-lg font-bold text-slate-900">{storeName}</h1>
            <p className="text-sm text-slate-500">{slogan}</p>
          </div>
        </Link>

        <nav className="hidden items-center gap-2 md:flex">
          {navItems.map((item) => {
            const active =
              pathname === item.href ||
              (item.href !== "/" && pathname.startsWith(item.href));

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`inline-flex items-center gap-1.5 rounded-full border px-4 py-2 text-sm font-semibold transition ${item.color} ${
                  active ? "ring-2 ring-slate-300" : ""
                }`}
              >
                <span className="text-base leading-none">{item.icon}</span>
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        <button
          type="button"
          onClick={() => setMenuOpen((prev) => !prev)}
          className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-slate-300 text-slate-700 transition hover:bg-slate-100 md:hidden"
          aria-label="Open mobile menu"
        >
          <span className="text-lg leading-none">{menuOpen ? "✕" : "☰"}</span>
        </button>
      </div>

      {menuOpen && (
        <div className="border-t border-slate-200 bg-white px-4 pb-4 pt-3 md:hidden">
          <nav className="grid grid-cols-2 gap-2">
            {mobileMenuItems.map((item) => {
              const active =
                pathname === item.href ||
                (item.href !== "/" && pathname.startsWith(item.href));

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMenuOpen(false)}
                  className={`inline-flex items-center gap-1.5 rounded-xl border px-3 py-2.5 text-sm font-semibold transition ${item.color} ${
                    active ? "ring-2 ring-slate-300" : ""
                  }`}
                >
                  <span className="text-base leading-none">{item.icon}</span>
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>
      )}
    </header>
  );
}
