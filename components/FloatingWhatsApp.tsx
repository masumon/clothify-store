"use client";

import { usePathname } from "next/navigation";

type Props = {
  phone?: string;
};

export default function FloatingWhatsApp({ phone = "8801811314262" }: Props) {
  const pathname = usePathname();

  const hiddenRoutes = ["/help", "/admin"];
  if (hiddenRoutes.some((r) => pathname.startsWith(r))) return null;

  const message = encodeURIComponent("ভাই, একটা product নিয়ে help লাগবে।");
  const link = `https://wa.me/${phone}?text=${message}`;

  return (
    <a
      href={link}
      target="_blank"
      rel="noreferrer"
      aria-label="WhatsApp Help"
      className={`fixed left-4 z-[82] inline-flex h-12 w-12 items-center justify-center rounded-full bg-emerald-600 text-xl text-white shadow-lg transition hover:bg-emerald-700 sm:left-5 md:bottom-6 md:left-6 ${
        pathname.startsWith("/checkout") ? "bottom-28" : "bottom-20"
      }`}
    >
      💬
    </a>
  );
}
