"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const items = [
  { href: "/", icon: "🏠", label: "হোম", external: false },
  { href: "/cart", icon: "🛒", label: "কার্ট", external: false },
  { href: "/checkout", icon: "✅", label: "অর্ডার", external: false },
  { href: "/settings", icon: "⚙️", label: "সেটিং", external: false },
  { href: "https://wa.me/8801811314262", icon: "💬", label: "সাপোর্ট", external: true },
];

export default function MobileStickyBar() {
  const pathname = usePathname();

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 border-t border-slate-200 bg-white/95 backdrop-blur md:hidden">
      <div className="grid grid-cols-5">
        {items.map((item) => {
          const active =
            !item.external &&
            (pathname === item.href ||
              (item.href !== "/" && pathname.startsWith(item.href)));

          const cls = `flex flex-col items-center gap-0.5 px-1 py-2.5 text-center transition ${
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
    </div>
  );
}
