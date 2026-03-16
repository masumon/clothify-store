"use client";

import Link from "next/link";

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
  return (
    <header className="sticky top-0 z-50 border-b border-slate-200 bg-white">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        <Link href="/" className="flex items-center gap-3">
          {logoUrl ? (
            <img
              src={logoUrl}
              alt={storeName}
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

        <nav className="hidden items-center gap-4 text-sm font-medium text-slate-700 md:flex">
          <Link href="/">Shop</Link>
          <Link href="/cart">Cart</Link>
          <Link href="/checkout">Checkout</Link>
          <Link href="/profile">Profile</Link>
          <Link href="/admin">Admin</Link>
        </nav>
      </div>
    </header>
  );
}
