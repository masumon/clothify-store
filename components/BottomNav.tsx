"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const items = [
  { href: "/", icon: "🏠", label: "Shop", external: false },
  { href: "/cart", icon: "🛒", label: "Cart", external: false },
  { href: "/fb", icon: "📣", label: "Landing", external: false },
  { href: "/checkout", icon: "✅", label: "Checkout", external: false },
  { href: "/payment", icon: "💳", label: "Payment", external: false },
  { href: "/settings", icon: "⚙️", label: "Settings", external: false },
  {
    href: "https://wa.me/8801811314262",
    icon: "💬",
    label: "Support",
    external: true,
  },
];

export default function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-slate-200 bg-white md:hidden">
      <div className="flex gap-1 overflow-x-auto px-1 py-1.5">
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
