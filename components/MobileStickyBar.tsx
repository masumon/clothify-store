"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function MobileStickyBar() {
  const pathname = usePathname();

  const items = [
    { href: "/", label: "Shop" },
    { href: "/cart", label: "Cart" },
    { href: "/checkout", label: "Checkout" },
    { href: "/payment", label: "Payment" },
    { href: "/settings", label: "Settings" },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 border-t border-slate-200 bg-white/95 backdrop-blur md:hidden">
      <div className="grid grid-cols-5">
        {items.map((item) => {
          const active =
            pathname === item.href ||
            (item.href !== "/" && pathname.startsWith(item.href));

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`px-2 py-3 text-center text-[11px] font-semibold transition ${
                active ? "text-black" : "text-slate-500"
              }`}
            >
              {item.label}
            </Link>
          );
        })}
      </div>
    </div>
  );
}
