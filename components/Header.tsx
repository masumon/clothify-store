"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { getWishlistCount } from "@/lib/wishlist";

type HeaderProps = {
  storeName?: string;
  slogan?: string;
  logoUrl?: string;
  whatsappNumber?: string;
};

function normalizeBangladeshWhatsAppNumber(phone: string) {
  const digits = phone.replace(/\D/g, "");

  if (!digits) return "8801811314262";
  if (digits.startsWith("880")) return digits;
  if (digits.startsWith("0")) return `88${digits}`;
  return digits;
}

export default function Header({
  storeName = "Clothify",
  slogan = "Find Your Fit",
  logoUrl,
  whatsappNumber = "8801811314262",
}: HeaderProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);
  const [uiLang, setUiLang] = useState<"en" | "bn">("bn");
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [wishlistCount, setWishlistCount] = useState(0);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const syncPreferences = () => {
      const savedLang = localStorage.getItem("clothfy-lang") || localStorage.getItem("clothify-language");
      const savedTheme = localStorage.getItem("clothfy-theme") || localStorage.getItem("clothify-theme") || "system";

      if (savedLang === "en" || savedLang === "bn") {
        setUiLang(savedLang);
        document.documentElement.lang = savedLang;
      } else if (savedLang === "EN" || savedLang === "BN") {
        const normalized = savedLang.toLowerCase() as "en" | "bn";
        setUiLang(normalized);
        document.documentElement.lang = normalized;
        localStorage.setItem("clothfy-lang", normalized);
        localStorage.setItem("clothify-language", normalized);
      }

      const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
      const shouldUseDark = savedTheme === "dark" || (savedTheme === "system" && prefersDark);
      setIsDarkMode(shouldUseDark);
      document.documentElement.classList.toggle("dark-theme", shouldUseDark);
    };

    syncPreferences();
    window.addEventListener("clothfy-preferences-change", syncPreferences);
    return () => window.removeEventListener("clothfy-preferences-change", syncPreferences);
  }, []);

  useEffect(() => {
    const updateCount = () => setWishlistCount(getWishlistCount());
    updateCount();
    window.addEventListener("clothfy-wishlist-change", updateCount);
    return () => window.removeEventListener("clothfy-wishlist-change", updateCount);
  }, []);

  const toggleLanguage = () => {
    const nextLang: "en" | "bn" = uiLang === "bn" ? "en" : "bn";
    setUiLang(nextLang);
    localStorage.setItem("clothfy-lang", nextLang);
    localStorage.setItem("clothify-language", nextLang);
    document.documentElement.lang = nextLang;
    window.dispatchEvent(new Event("clothfy-preferences-change"));
  };

  const toggleTheme = () => {
    const nextDark = !isDarkMode;
    setIsDarkMode(nextDark);
    localStorage.setItem("clothfy-theme", nextDark ? "dark" : "light");
    localStorage.setItem("clothify-theme", nextDark ? "dark" : "light");
    document.documentElement.classList.toggle("dark-theme", nextDark);
    window.dispatchEvent(new Event("clothfy-preferences-change"));
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const q = searchQuery.trim();
    if (!q) return;
    router.push(`/?search=${encodeURIComponent(q)}`);
    setSearchOpen(false);
    setSearchQuery("");
  };

  const whatsappLink = `https://wa.me/${normalizeBangladeshWhatsAppNumber(whatsappNumber)}`;

  const isBn = uiLang === "bn";

  const navItems = [
    {
      href: "/",
      label: isBn ? "শপ" : "Shop",
      icon: "🛍️",
      color: "border-blue-200 bg-blue-50 text-blue-900 hover:bg-blue-100",
    },
    {
      href: "/cart",
      label: isBn ? "কার্ট" : "Cart",
      icon: "🛒",
      color: "border-orange-200 bg-orange-50 text-orange-900 hover:bg-orange-100",
    },
    {
      href: "/checkout",
      label: isBn ? "চেকআউট" : "Checkout",
      icon: "✅",
      color: "border-green-200 bg-green-50 text-green-900 hover:bg-green-100",
    },
    {
      href: "/admin/login",
      label: isBn ? "অ্যাডমিন" : "Admin",
      icon: "🔒",
      color: "border-slate-300 bg-slate-100 text-slate-800 hover:bg-slate-200",
    },
    {
      href: "/settings",
      label: isBn ? "সেটিংস" : "Settings",
      icon: "⚙️",
      color: "border-purple-200 bg-purple-50 text-purple-900 hover:bg-purple-100",
    },
  ];

  const mobileMenuItems = navItems;
  const iconBtnClass = "inline-flex h-9 w-9 items-center justify-center rounded-full border border-slate-300 bg-white text-base text-slate-700 transition hover:bg-slate-100";

  return (
    <header className="sticky top-0 z-50 border-b border-white/70 bg-white/80 backdrop-blur-xl">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        <Link href="/" className="flex items-center gap-3">
          {logoUrl ? (
            <Image
              src={logoUrl}
              alt={storeName}
              width={48}
              height={48}
              className="h-12 w-12 rounded-2xl border border-slate-200 object-cover"
            />
          ) : (
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-teal-600 to-cyan-700 text-lg font-bold text-white shadow-lg shadow-teal-900/20">
              C
            </div>
          )}

          <div>
            <h1 className="text-lg font-extrabold tracking-tight text-slate-900">
              {storeName}
            </h1>
            <p className="text-xs font-medium tracking-wide text-slate-500">
              {slogan}
            </p>
          </div>
        </Link>

        <div className="hidden items-center gap-1.5 md:flex lg:gap-2">
          {/* Search */}
          {searchOpen ? (
            <form onSubmit={handleSearch} className="flex items-center gap-1.5">
              <input
                type="search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={isBn ? "পণ্য খুঁজুন..." : "Search products..."}
                // eslint-disable-next-line jsx-a11y/no-autofocus
                autoFocus
                className="w-40 rounded-full border border-slate-300 bg-white px-4 py-2 text-xs outline-none transition focus:border-teal-400 focus:ring-2 focus:ring-teal-100"
              />
              <button
                type="button"
                onClick={() => { setSearchOpen(false); setSearchQuery(""); }}
                className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-slate-300 bg-white text-xs text-slate-600 transition hover:bg-slate-100"
              >
                ✕
              </button>
            </form>
          ) : (
            <button
              type="button"
              onClick={() => setSearchOpen(true)}
              className={iconBtnClass}
              aria-label="Search products"
              title="Search"
            >
              🔍
            </button>
          )}

          <button
            type="button"
            onClick={toggleLanguage}
            className={iconBtnClass}
            aria-label="Toggle language"
            title={uiLang === "bn" ? "Switch to English" : "বাংলায় পরিবর্তন করুন"}
          >
            🌐
          </button>

          <button
            type="button"
            onClick={toggleTheme}
            className={iconBtnClass}
            aria-label="Toggle dark mode"
            title="Toggle dark mode"
          >
            <span className="text-base leading-none">{isDarkMode ? "☀️" : "🌙"}</span>
          </button>

          {/* Wishlist */}
          <Link
            href="/wishlist"
            className={`relative ${iconBtnClass}`}
            aria-label="Wishlist"
            title="Wishlist"
          >
            🤍
            {wishlistCount > 0 && (
              <span className="absolute -right-1 -top-1 flex min-w-[18px] items-center justify-center rounded-full bg-rose-500 px-0.5 text-[9px] font-bold text-white">
                {wishlistCount > 9 ? "9+" : wishlistCount}
              </span>
            )}
          </Link>

          <Link
            href="/cart"
            className={iconBtnClass}
            aria-label="Go to cart"
            title="Cart"
          >
            🛒
          </Link>

          <a
            href={whatsappLink}
            target="_blank"
            rel="noreferrer"
            className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-emerald-600 bg-emerald-600 text-base text-white transition hover:bg-emerald-700"
            aria-label="WhatsApp"
            title="WhatsApp"
          >
            <span className="text-sm leading-none">💬</span>
          </a>
        </div>

        <nav className="hidden items-center gap-1.5 lg:flex lg:gap-2">
          {navItems.map((item) => {
            const active =
              pathname === item.href ||
              (item.href !== "/" && pathname.startsWith(item.href));

            return (
              <Link
                key={item.href}
                href={item.href}
                title={item.label}
                aria-label={item.label}
                className={`inline-flex h-9 w-9 items-center justify-center rounded-full border text-base transition ${item.color} ${
                  active ? "ring-2 ring-teal-300/60" : ""
                }`}
              >
                <span className="text-base leading-none">{item.icon}</span>
              </Link>
            );
          })}
        </nav>

        <button
          type="button"
          onClick={() => setMenuOpen((prev) => !prev)}
          className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-slate-300 bg-white/70 text-slate-700 transition hover:bg-slate-100 lg:hidden"
          aria-label="Open mobile menu"
        >
          <span className="text-lg leading-none">{menuOpen ? "✕" : "☰"}</span>
        </button>
      </div>

      {menuOpen && (
        <div className="border-t border-slate-200/80 bg-white/90 px-4 pb-4 pt-3 backdrop-blur lg:hidden">
          <div className="mb-3 flex items-center gap-2">
            <button
              type="button"
              onClick={toggleLanguage}
              className="rounded-full border border-slate-300 bg-white px-3 py-2 text-xs font-bold text-slate-700"
            >
              {uiLang === "bn" ? "BN" : "EN"}
            </button>
            <button
              type="button"
              onClick={toggleTheme}
              className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-slate-300 bg-white text-slate-700"
              aria-label="Toggle dark mode"
            >
              <span className="text-base leading-none">{isDarkMode ? "☀️" : "🌙"}</span>
            </button>
            <a
              href={whatsappLink}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 rounded-full bg-emerald-600 px-3 py-2 text-xs font-bold text-white"
            >
              <span className="text-sm leading-none">💬</span>
              {isBn ? "হোয়াটসঅ্যাপ" : "WhatsApp"}
            </a>
          </div>
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
                    active ? "ring-2 ring-teal-300/60" : ""
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
