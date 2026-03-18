"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import type { ComponentProps, FormEvent } from "react";
import AppIcon from "@/components/AppIcon";
import { getWishlistCount } from "@/lib/wishlist";
import { CART_UPDATED_EVENT, getCart } from "@/lib/cart";
import {
  type Language,
  PREFERENCE_EVENT,
  readSitePreferences,
  type UiMode,
  updateSitePreferences,
} from "@/lib/site-preferences";

type HeaderProps = {
  storeName?: string;
  slogan?: string;
  logoUrl?: string;
  whatsappNumber?: string;
  homeSearchOnly?: boolean;
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
  logoUrl = "",
  whatsappNumber = "8801811314262",
  homeSearchOnly = false,
}: HeaderProps) {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();

  const [menuOpen, setMenuOpen] = useState(false);
  const [moreOpen, setMoreOpen] = useState(false);
  const [uiLang, setUiLang] = useState<Language>("bn");
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [uiMode, setUiMode] = useState<UiMode>("default");
  const [wishlistCount, setWishlistCount] = useState(0);
  const [cartCount, setCartCount] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const syncPreferences = () => {
      const preferences = readSitePreferences();
      const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
      const shouldUseDark = preferences.theme === "dark" || (preferences.theme === "system" && prefersDark);
      setUiLang(preferences.language);
      setIsDarkMode(shouldUseDark);
      setUiMode(preferences.uiMode);
    };

    syncPreferences();
    window.addEventListener(PREFERENCE_EVENT, syncPreferences);
    return () => window.removeEventListener(PREFERENCE_EVENT, syncPreferences);
  }, []);

  useEffect(() => {
    const updateWishlist = () => setWishlistCount(getWishlistCount());
    updateWishlist();
    window.addEventListener("clothfy-wishlist-change", updateWishlist);
    return () => window.removeEventListener("clothfy-wishlist-change", updateWishlist);
  }, []);

  useEffect(() => {
    const updateCart = () => {
      const next = getCart().reduce((sum, item) => sum + Number(item.quantity || 0), 0);
      setCartCount(next);
    };

    updateCart();
    window.addEventListener(CART_UPDATED_EVENT, updateCart);
    window.addEventListener("storage", updateCart);
    return () => {
      window.removeEventListener(CART_UPDATED_EVENT, updateCart);
      window.removeEventListener("storage", updateCart);
    };
  }, []);

  useEffect(() => {
    setMenuOpen(false);
    setMoreOpen(false);
  }, [pathname]);

  useEffect(() => {
    const initialQuery = searchParams.get("search") || searchParams.get("q") || "";
    setSearchQuery(initialQuery);
  }, [searchParams]);

  const isBn = uiLang === "bn";

  const toggleLanguage = () => {
    const nextLang: Language = uiLang === "bn" ? "en" : "bn";
    setUiLang(nextLang);
    updateSitePreferences({ language: nextLang });
  };

  const toggleTheme = () => {
    const nextDark = !isDarkMode;
    setIsDarkMode(nextDark);
    updateSitePreferences({ theme: nextDark ? "dark" : "light" });
  };

  const handleSearch = (e: FormEvent) => {
    e.preventDefault();
    const q = searchQuery.trim();
    router.push(q ? `/search?search=${encodeURIComponent(q)}` : "/search");
  };

  const whatsappLink = `https://wa.me/${normalizeBangladeshWhatsAppNumber(whatsappNumber)}`;
  const cartTarget = cartCount > 0 ? "/checkout" : "/cart";
  const logoSrc = logoUrl || "/icons/icon-192.png";

  const headerShellClass = isDarkMode
    ? "sticky top-0 z-50 border-b border-slate-700/80 bg-slate-950/88 backdrop-blur-xl"
    : "sticky top-0 z-50 border-b border-white/80 bg-white/90 backdrop-blur-xl";

  const iconBtnClass = isDarkMode
    ? "inline-flex h-9 w-9 items-center justify-center rounded-full border border-slate-600 bg-slate-900/80 text-base text-slate-100 transition hover:scale-110 hover:bg-slate-800"
    : "inline-flex h-9 w-9 items-center justify-center rounded-full border border-slate-300 bg-white text-base text-slate-700 transition hover:scale-110 hover:bg-slate-100";

  const premiumDesktopLinks = [
    { href: "/", label: "Home" },
    { href: "/categories", label: "Shop" },
    { href: "/#new-arrival", label: "New Arrivals" },
    { href: "/help", label: "Contact" },
  ];

  const primaryNav = [
    {
      href: "/",
      label: isBn ? "হোম" : "Home",
      icon: "home",
      lightColor: "border-blue-200 bg-blue-50 text-blue-900 hover:bg-blue-100",
      darkColor: "border-blue-400/40 bg-blue-500/15 text-blue-100 hover:bg-blue-500/25",
    },
    {
      href: "/categories",
      label: isBn ? "ক্যাটাগরি" : "Categories",
      icon: "categories",
      lightColor: "border-cyan-200 bg-cyan-50 text-cyan-900 hover:bg-cyan-100",
      darkColor: "border-cyan-400/40 bg-cyan-500/15 text-cyan-100 hover:bg-cyan-500/25",
    },
    {
      href: "/offers",
      label: isBn ? "অফার" : "Offers",
      icon: "offers",
      lightColor: "border-amber-200 bg-amber-50 text-amber-900 hover:bg-amber-100",
      darkColor: "border-amber-400/45 bg-amber-500/20 text-amber-100 hover:bg-amber-500/30",
    },
    {
      href: cartTarget,
      label: isBn ? "কার্ট" : "Cart",
      icon: "cart",
      lightColor: "border-orange-200 bg-orange-50 text-orange-900 hover:bg-orange-100",
      darkColor: "border-orange-400/40 bg-orange-500/15 text-orange-100 hover:bg-orange-500/25",
    },
  ];

  const secondaryNav = [
    { href: "/checkout", label: isBn ? "চেকআউট" : "Checkout", icon: "payment" },
    { href: "/profile", label: isBn ? "প্রোফাইল" : "Profile", icon: "profile" },
    { href: "/help", label: isBn ? "সাপোর্ট" : "Support", icon: "support" },
    { href: "/size-guide", label: isBn ? "সাইজ গাইড" : "Size Guide", icon: "sizeGuide" },
    { href: "/settings", label: isBn ? "সেটিংস" : "Settings", icon: "settings" },
    { href: "/fb", label: isBn ? "ল্যান্ডিং" : "Landing", icon: "landing" },
    { href: "/admin", label: "Admin", icon: "admin" },
  ];

  if (uiMode === "abo") {
    return (
      <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/95 backdrop-blur-xl">
        <div className="bg-slate-950 px-3 py-1.5 text-center text-[11px] font-bold uppercase tracking-[0.16em] text-white">
          Free Shipping in Sylhet on Orders Over <span className="text-amber-300">৳2000</span>
        </div>

        <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-3 py-3 sm:px-4">
          <Link href="/" className="flex min-w-0 items-center gap-2.5">
            <div className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-900 shadow-sm">
              <AppIcon name="shirt" className="h-5 w-5" />
            </div>
            <div className="min-w-0">
              <h1 className="truncate text-lg font-black tracking-[0.08em] text-slate-900">ABO</h1>
              <p className="truncate text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-500">{storeName}</p>
            </div>
          </Link>

          <nav className="hidden items-center gap-5 lg:flex">
            {premiumDesktopLinks.map((item) => {
              const active = pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href));
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`text-sm font-semibold transition ${
                    active ? "text-slate-900" : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>

          <div className="hidden items-center gap-2 md:flex">
            <Link
              href="/search"
              className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-slate-300 bg-white text-slate-700 transition hover:bg-slate-100"
              aria-label="Search"
              title="Search"
            >
              <AppIcon name="search" className="h-4.5 w-4.5" />
            </Link>
            <button
              type="button"
              onClick={toggleLanguage}
              className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-slate-300 bg-white text-slate-700 transition hover:bg-slate-100"
              aria-label={uiLang === "bn" ? "Switch to English" : "বাংলায় পরিবর্তন করুন"}
              title={uiLang === "bn" ? "BN -> EN" : "EN -> BN"}
            >
              <AppIcon name="globe" className="h-4.5 w-4.5" />
            </button>
            <button
              type="button"
              onClick={toggleTheme}
              className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-slate-300 bg-white text-slate-700 transition hover:bg-slate-100"
              aria-label="Toggle dark mode"
              title="Toggle dark mode"
            >
              <AppIcon name={isDarkMode ? "sun" : "moon"} className="h-4.5 w-4.5" />
            </button>
            <Link
              href="/admin"
              className="inline-flex items-center gap-1.5 rounded-full border border-slate-900 bg-slate-900 px-3 py-2 text-xs font-bold uppercase tracking-[0.1em] text-white transition hover:bg-white hover:text-slate-900"
            >
              <AppIcon name="admin" className="h-4 w-4" />
              Admin
            </Link>
            <Link
              href={cartTarget}
              className="relative inline-flex h-9 w-9 items-center justify-center rounded-full border border-slate-300 bg-white text-slate-700 transition hover:bg-slate-100"
              aria-label="Cart"
              title="Cart"
            >
              <AppIcon name="cart" className="h-4.5 w-4.5" />
              {cartCount > 0 ? (
                <span className="absolute -right-1 -top-1 flex min-w-[18px] items-center justify-center rounded-full bg-amber-400 px-1 text-[10px] font-bold text-slate-900">
                  {cartCount > 99 ? "99+" : cartCount}
                </span>
              ) : null}
            </Link>
          </div>

          <button
            type="button"
            onClick={() => setMenuOpen(true)}
            className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-slate-300 bg-white text-slate-700 lg:hidden"
            aria-label="Open menu"
          >
            <AppIcon name="menu" className="h-5 w-5" />
          </button>
        </div>

        {menuOpen ? (
          <div className="fixed inset-0 z-[120] lg:hidden">
            <button
              type="button"
              onClick={() => setMenuOpen(false)}
              aria-label="Close overlay"
              className="absolute inset-0 bg-black/40 backdrop-blur-[1px]"
            />
            <aside className="relative h-full w-[84vw] max-w-[340px] overflow-y-auto border-r border-slate-200 bg-white p-4 shadow-2xl">
              <div className="mb-4 flex items-center justify-between gap-2">
                <p className="text-sm font-bold uppercase tracking-[0.12em] text-slate-900">ABO Menu</p>
                <button
                  type="button"
                  onClick={() => setMenuOpen(false)}
                  className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-slate-300 bg-white text-slate-700"
                  aria-label="Close menu"
                >
                  <AppIcon name="close" className="h-4.5 w-4.5" />
                </button>
              </div>

              <form onSubmit={handleSearch} className="mb-4 flex items-center gap-2 rounded-full border border-slate-300 bg-white px-2 py-1.5">
                <AppIcon name="search" className="ml-2 h-4.5 w-4.5 text-slate-500" />
                <input
                  type="search"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={isBn ? "পণ্য সার্চ করুন..." : "Search products..."}
                  className="w-full bg-transparent py-1.5 text-sm text-slate-800 outline-none"
                />
                <button type="submit" className="rounded-full bg-slate-900 px-3 py-1.5 text-xs font-bold text-white">
                  Go
                </button>
              </form>

              <nav className="space-y-2">
                {[...premiumDesktopLinks, { href: "/offers", label: "Offers" }, { href: "/profile", label: "Profile" }, { href: "/settings", label: "Settings" }, { href: "/admin", label: "Admin" }].map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setMenuOpen(false)}
                    className="block rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-100"
                  >
                    {item.label}
                  </Link>
                ))}
              </nav>

              <div className="mt-4 grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={toggleLanguage}
                  className="rounded-xl border border-slate-300 bg-white py-2 text-sm font-semibold text-slate-700"
                >
                  <AppIcon name="globe" className="h-4.5 w-4.5" />
                </button>
                <button
                  type="button"
                  onClick={toggleTheme}
                  className="rounded-xl border border-slate-300 bg-white py-2 text-sm font-semibold text-slate-700"
                >
                  <AppIcon name={isDarkMode ? "sun" : "moon"} className="h-4.5 w-4.5" />
                </button>
                <a
                  href={whatsappLink}
                  target="_blank"
                  rel="noreferrer"
                  className="rounded-xl border border-emerald-300 bg-emerald-50 py-2 text-center text-sm font-semibold text-emerald-700"
                >
                  <AppIcon name="whatsapp" className="h-4.5 w-4.5" />
                </a>
              </div>
            </aside>
          </div>
        ) : null}
      </header>
    );
  }

  if (homeSearchOnly) {
    return (
      <header className={headerShellClass}>
        <div className="mx-auto max-w-6xl px-4 py-3 sm:py-4">
          <div className="flex items-center justify-between gap-3">
            <Link href="/" className="flex min-w-0 items-center gap-3">
              <Image
                src={logoSrc}
                alt={storeName}
                width={44}
                height={44}
                className="h-11 w-11 shrink-0 rounded-full border border-slate-200 object-cover shadow-sm"
              />
              <div className="min-w-0">
                <h1 className={`truncate text-base font-extrabold tracking-tight ${isDarkMode ? "text-slate-100" : "text-slate-900"}`}>
                  {storeName}
                </h1>
                <p className={`truncate text-[11px] font-medium tracking-wide ${isDarkMode ? "text-slate-400" : "text-slate-500"}`}>
                  {slogan}
                </p>
              </div>
            </Link>

            <div className="flex items-center gap-1.5 sm:gap-2">
              <button
                type="button"
                onClick={toggleLanguage}
                className={iconBtnClass}
                aria-label={uiLang === "bn" ? "Switch to English" : "বাংলায় পরিবর্তন করুন"}
                title={uiLang === "bn" ? "BN -> EN" : "EN -> BN"}
              >
                <AppIcon name="globe" className="h-4.5 w-4.5" />
              </button>

              <button
                type="button"
                onClick={toggleTheme}
                className={iconBtnClass}
                aria-label="Toggle dark mode"
                title="Toggle dark mode"
              >
                <AppIcon name={isDarkMode ? "sun" : "moon"} className="h-4.5 w-4.5" />
              </button>

              <Link href={cartTarget} className={`relative ${iconBtnClass}`} aria-label="Cart" title="Cart">
                <AppIcon name="cart" className="h-4.5 w-4.5" />
                {cartCount > 0 ? (
                  <span className="absolute -right-1 -top-1 flex min-w-[18px] items-center justify-center rounded-full bg-amber-500 px-0.5 text-[9px] font-bold text-slate-900">
                    {cartCount > 99 ? "99+" : cartCount}
                  </span>
                ) : null}
              </Link>

              <a
                href={whatsappLink}
                target="_blank"
                rel="noreferrer"
                className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-emerald-600 bg-emerald-600 text-base text-white transition hover:scale-110 hover:bg-emerald-700"
                aria-label="WhatsApp"
                title="WhatsApp"
              >
                <AppIcon name="whatsapp" className="h-4.5 w-4.5" />
              </a>
            </div>
          </div>

          <div className="mt-3 hidden items-center justify-between gap-3 lg:flex">
            <nav className="flex items-center gap-2">
              {primaryNav.map((item) => {
                const active = pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href));
                const palette = isDarkMode ? item.darkColor : item.lightColor;

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    aria-label={item.label}
                    className={`group relative inline-flex h-11 w-11 items-center justify-center rounded-full border text-base transition duration-300 ${palette} ${
                      active ? "ring-2 ring-teal-300/70" : ""
                    } hover:-translate-y-0.5 hover:scale-110`}
                  >
                    <AppIcon name={item.icon as ComponentProps<typeof AppIcon>["name"]} className="h-4.5 w-4.5" />
                    <span className="pointer-events-none absolute -bottom-9 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-lg bg-slate-900 px-2.5 py-1 text-[10px] font-semibold text-white opacity-0 shadow-lg transition duration-300 group-hover:opacity-100">
                      {item.label}
                    </span>
                  </Link>
                );
              })}
            </nav>

            <div className="group relative">
              <button
                type="button"
                className={`inline-flex items-center gap-1 rounded-full border px-3 py-2 text-xs font-semibold transition ${
                  isDarkMode
                    ? "border-slate-600 bg-slate-900/80 text-slate-100 hover:bg-slate-800"
                    : "border-slate-300 bg-white text-slate-700 hover:bg-slate-100"
                }`}
              >
                <AppIcon name="menu" className="h-4 w-4" />
                More
              </button>

              <div
                className={`pointer-events-none invisible absolute right-0 z-40 mt-2 w-72 translate-y-2 overflow-hidden rounded-2xl border p-3 opacity-0 shadow-xl transition duration-300 group-hover:pointer-events-auto group-hover:visible group-hover:translate-y-0 group-hover:opacity-100 ${
                  isDarkMode ? "border-slate-700 bg-slate-900" : "border-slate-200 bg-white"
                }`}
              >
                <div className="grid grid-cols-3 gap-2">
                  {secondaryNav.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      className="group/item flex flex-col items-center justify-center gap-1 rounded-2xl border border-slate-300/70 bg-slate-50/80 px-2 py-2.5 text-center transition duration-300 hover:scale-105 hover:border-teal-300 hover:bg-teal-50 dark:border-slate-700 dark:bg-slate-800 dark:hover:border-teal-400/50 dark:hover:bg-slate-700"
                    >
                      <span className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-slate-300 bg-white text-base shadow-sm dark:border-slate-600 dark:bg-slate-900">
                        <AppIcon name={item.icon as ComponentProps<typeof AppIcon>["name"]} className="h-4.5 w-4.5" />
                      </span>
                      <span className={`text-[10px] font-semibold ${isDarkMode ? "text-slate-200" : "text-slate-700"}`}>
                        {item.label}
                      </span>
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="mt-3 grid grid-cols-4 gap-2 lg:hidden">
            {primaryNav.map((item) => {
              const active = pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href));
              const palette = isDarkMode ? item.darkColor : item.lightColor;

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex flex-col items-center justify-center gap-1 rounded-2xl border px-2 py-2.5 text-center text-[11px] font-semibold transition ${palette} ${
                    active ? "ring-2 ring-teal-400/70 ring-offset-1" : ""
                  }`}
                >
                  <AppIcon name={item.icon as ComponentProps<typeof AppIcon>["name"]} className="h-4.5 w-4.5" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </div>
        </div>
      </header>
    );
  }

  return (
    <header className={headerShellClass}>
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-3">
        <Link href="/" className="flex min-w-0 items-center gap-3">
          <Image
            src={logoSrc}
            alt={storeName}
            width={48}
            height={48}
            className="h-11 w-11 shrink-0 rounded-full border border-slate-200 object-cover shadow-sm"
          />

          <div className="min-w-0">
            <h1 className={`truncate text-lg font-extrabold tracking-tight ${isDarkMode ? "text-slate-100" : "text-slate-900"}`}>
              {storeName}
            </h1>
            <p className={`truncate text-xs font-medium tracking-wide ${isDarkMode ? "text-slate-400" : "text-slate-500"}`}>
              {slogan}
            </p>
          </div>
        </Link>

        <form
          onSubmit={handleSearch}
          className={`hidden max-w-md flex-1 items-center gap-2 rounded-full border px-2 py-1.5 lg:flex ${
            isDarkMode
              ? "border-slate-600 bg-slate-900/80"
              : "border-slate-200 bg-white shadow-[0_8px_24px_-18px_rgba(15,23,42,0.7)]"
          }`}
        >
          <AppIcon
            name="search"
            className={`ml-2 h-4.5 w-4.5 ${isDarkMode ? "text-cyan-200" : "text-cyan-700"}`}
          />
          <input
            type="search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={isBn ? "পণ্য সার্চ করুন..." : "Search products..."}
            className={`w-full bg-transparent py-1.5 text-sm outline-none ${
              isDarkMode ? "text-slate-100 placeholder:text-slate-400" : "text-slate-800 placeholder:text-slate-500"
            }`}
          />
          <button
            type="submit"
            className="rounded-full bg-gradient-to-r from-teal-700 to-cyan-700 px-3 py-1.5 text-xs font-bold text-white transition hover:brightness-110"
          >
            {isBn ? "সার্চ" : "Search"}
          </button>
        </form>

        <div className="hidden items-center gap-1.5 md:flex">
          <button
            type="button"
            onClick={toggleLanguage}
            className={iconBtnClass}
            aria-label={uiLang === "bn" ? "Switch to English" : "বাংলায় পরিবর্তন করুন"}
            title={uiLang === "bn" ? "BN -> EN" : "EN -> BN"}
          >
            <AppIcon name="globe" className="h-4.5 w-4.5" />
          </button>

          <button
            type="button"
            onClick={toggleTheme}
            className={iconBtnClass}
            aria-label="Toggle dark mode"
            title="Toggle dark mode"
          >
            <AppIcon name={isDarkMode ? "sun" : "moon"} className="h-4.5 w-4.5" />
          </button>

          <Link href="/wishlist" className={`relative ${iconBtnClass}`} aria-label="Wishlist" title="Wishlist">
            <AppIcon name="heart" className="h-4.5 w-4.5" />
            {wishlistCount > 0 ? (
              <span className="absolute -right-1 -top-1 flex min-w-[18px] items-center justify-center rounded-full bg-rose-500 px-0.5 text-[9px] font-bold text-white">
                {wishlistCount > 9 ? "9+" : wishlistCount}
              </span>
            ) : null}
          </Link>

          <Link href={cartTarget} className={`relative ${iconBtnClass}`} aria-label="Cart" title="Cart">
            <AppIcon name="cart" className="h-4.5 w-4.5" />
            {cartCount > 0 ? (
              <span className="absolute -right-1 -top-1 flex min-w-[18px] items-center justify-center rounded-full bg-amber-500 px-0.5 text-[9px] font-bold text-slate-900">
                {cartCount > 99 ? "99+" : cartCount}
              </span>
            ) : null}
          </Link>

          <a
            href={whatsappLink}
            target="_blank"
            rel="noreferrer"
            className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-emerald-600 bg-emerald-600 text-base text-white transition hover:scale-110 hover:bg-emerald-700"
            aria-label="WhatsApp"
            title="WhatsApp"
          >
            <AppIcon name="whatsapp" className="h-4.5 w-4.5" />
          </a>
        </div>

        <button
          type="button"
          onClick={() => setMenuOpen((prev) => !prev)}
          className={`inline-flex h-10 w-10 items-center justify-center rounded-xl border transition lg:hidden ${
            isDarkMode
              ? "border-slate-600 bg-slate-900/80 text-slate-100 hover:bg-slate-800"
              : "border-slate-300 bg-white/70 text-slate-700 hover:bg-slate-100"
          }`}
          aria-label="Open mobile menu"
        >
          <AppIcon name={menuOpen ? "close" : "menu"} className="h-5 w-5" />
        </button>
      </div>

      <div className="mx-auto hidden max-w-6xl items-center justify-between gap-3 px-4 pb-3 lg:flex">
        <nav className="flex items-center gap-2">
          {primaryNav.map((item) => {
            const active = pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href));
            const palette = isDarkMode ? item.darkColor : item.lightColor;

            return (
              <Link
                key={item.href}
                href={item.href}
                aria-label={item.label}
                className={`group relative inline-flex h-10 w-10 items-center justify-center rounded-full border text-base transition ${palette} ${
                  active ? "ring-2 ring-teal-300/70" : ""
                } hover:scale-110`}
              >
                <AppIcon name={item.icon as ComponentProps<typeof AppIcon>["name"]} className="h-4.5 w-4.5" />
                <span className="pointer-events-none absolute -bottom-9 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-lg bg-slate-900 px-2 py-1 text-[10px] font-semibold text-white opacity-0 shadow-lg transition group-hover:opacity-100">
                  {item.label}
                </span>
              </Link>
            );
          })}
        </nav>

        <div className="relative">
          <button
            type="button"
            onClick={() => setMoreOpen((prev) => !prev)}
            className={`inline-flex items-center gap-1 rounded-full border px-3 py-2 text-xs font-semibold transition ${
              isDarkMode
                ? "border-slate-600 bg-slate-900/80 text-slate-100 hover:bg-slate-800"
                : "border-slate-300 bg-white text-slate-700 hover:bg-slate-100"
            }`}
          >
            <AppIcon name="menu" className="h-4 w-4" />
            More
          </button>

          {moreOpen ? (
            <div
              className={`absolute right-0 z-40 mt-2 w-72 overflow-hidden rounded-2xl border p-3 shadow-xl ${
                isDarkMode ? "border-slate-700 bg-slate-900" : "border-slate-200 bg-white"
              }`}
            >
              <div className="grid grid-cols-3 gap-2">
                {secondaryNav.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="group flex flex-col items-center justify-center gap-1 rounded-2xl border border-slate-300/70 bg-slate-50/80 px-2 py-2.5 text-center transition hover:scale-105 hover:border-teal-300 hover:bg-teal-50 dark:border-slate-700 dark:bg-slate-800 dark:hover:border-teal-400/50 dark:hover:bg-slate-700"
                  >
                    <span className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-slate-300 bg-white text-base shadow-sm dark:border-slate-600 dark:bg-slate-900">
                      <AppIcon name={item.icon as ComponentProps<typeof AppIcon>["name"]} className="h-4.5 w-4.5" />
                    </span>
                    <span className={`text-[10px] font-semibold ${isDarkMode ? "text-slate-200" : "text-slate-700"}`}>
                      {item.label}
                    </span>
                  </Link>
                ))}
              </div>
            </div>
          ) : null}
        </div>
      </div>

      {menuOpen ? (
        <div
          className={`border-t px-4 pb-4 pt-3 backdrop-blur lg:hidden ${
            isDarkMode ? "border-slate-700/80 bg-slate-950/92" : "border-slate-200/80 bg-white/92"
          }`}
        >
          <form
            onSubmit={handleSearch}
            className={`mb-3 flex items-center gap-2 rounded-full border px-2 py-1.5 ${
              isDarkMode ? "border-slate-600 bg-slate-900/80" : "border-slate-300 bg-white"
            }`}
          >
            <AppIcon
              name="search"
              className={`ml-2 h-4.5 w-4.5 ${isDarkMode ? "text-cyan-200" : "text-cyan-700"}`}
            />
            <input
              type="search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={isBn ? "পণ্য সার্চ করুন..." : "Search products..."}
              className={`w-full bg-transparent py-1.5 text-sm outline-none ${
                isDarkMode ? "text-slate-100 placeholder:text-slate-400" : "text-slate-800 placeholder:text-slate-500"
              }`}
            />
            <button
              type="submit"
              className="rounded-full bg-gradient-to-r from-teal-700 to-cyan-700 px-3 py-1.5 text-xs font-bold text-white"
            >
              Go
            </button>
          </form>

          <nav className="mb-3 grid grid-cols-4 gap-2">
            {primaryNav.map((item) => {
              const active = pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href));
              const palette = isDarkMode ? item.darkColor : item.lightColor;

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex flex-col items-center justify-center gap-1 rounded-2xl border px-2 py-3 text-center text-xs font-semibold transition ${palette} ${
                    active ? "ring-2 ring-teal-400/70 ring-offset-1" : ""
                  }`}
                >
                  <AppIcon name={item.icon as ComponentProps<typeof AppIcon>["name"]} className="h-4.5 w-4.5" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>

          <div className="mb-3 grid grid-cols-3 gap-2">
            {secondaryNav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="group flex flex-col items-center justify-center gap-1 rounded-2xl border border-slate-300/70 bg-slate-50/80 px-2 py-2 text-center transition hover:scale-105 hover:border-teal-300 hover:bg-teal-50 dark:border-slate-700 dark:bg-slate-800 dark:hover:border-teal-400/50 dark:hover:bg-slate-700"
              >
                <span className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-slate-300 bg-white text-sm shadow-sm dark:border-slate-600 dark:bg-slate-900">
                  <AppIcon name={item.icon as ComponentProps<typeof AppIcon>["name"]} className="h-4 w-4" />
                </span>
                <span className={`text-[10px] font-semibold ${isDarkMode ? "text-slate-200" : "text-slate-700"}`}>
                  {item.label}
                </span>
              </Link>
            ))}
          </div>

          <div className="flex items-center justify-center gap-2">
            <button
              type="button"
              onClick={toggleLanguage}
              className={`inline-flex h-10 w-10 items-center justify-center rounded-full border text-base transition ${
                isDarkMode
                  ? "border-slate-600 bg-slate-900/80 text-slate-100 hover:bg-slate-800"
                  : "border-slate-300 bg-white text-slate-700 hover:bg-slate-50"
              }`}
              aria-label={uiLang === "bn" ? "Switch to English" : "বাংলায় পরিবর্তন করুন"}
            >
              <AppIcon name="globe" className="h-4.5 w-4.5" />
            </button>
            <button
              type="button"
              onClick={toggleTheme}
              className={`inline-flex h-10 w-10 items-center justify-center rounded-full border text-base transition ${
                isDarkMode
                  ? "border-slate-600 bg-slate-900/80 text-slate-100 hover:bg-slate-800"
                  : "border-slate-300 bg-white text-slate-700 hover:bg-slate-50"
              }`}
              aria-label="Toggle dark mode"
            >
              <AppIcon name={isDarkMode ? "sun" : "moon"} className="h-4.5 w-4.5" />
            </button>
            <Link href="/wishlist" className={`${iconBtnClass} h-10 w-10`} aria-label="Wishlist">
              <AppIcon name="heart" className="h-4.5 w-4.5" />
            </Link>
            <Link href={cartTarget} className={`${iconBtnClass} relative h-10 w-10`} aria-label="Cart">
              <AppIcon name="cart" className="h-4.5 w-4.5" />
              {cartCount > 0 ? (
                <span className="absolute -right-1 -top-1 rounded-full bg-amber-500 px-1 text-[9px] font-bold text-slate-900">
                  {cartCount > 99 ? "99+" : cartCount}
                </span>
              ) : null}
            </Link>
            <a
              href={whatsappLink}
              target="_blank"
              rel="noreferrer"
              className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-emerald-600 bg-emerald-600 text-white transition hover:bg-emerald-700"
              aria-label="WhatsApp"
            >
              <AppIcon name="whatsapp" className="h-4.5 w-4.5" />
            </a>
          </div>
        </div>
      ) : null}
    </header>
  );
}
