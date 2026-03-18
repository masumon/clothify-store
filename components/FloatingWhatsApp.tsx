"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { PREFERENCE_EVENT, readSitePreferences, type UiMode } from "@/lib/site-preferences";

type Props = {
  phone?: string;
};

export default function FloatingWhatsApp({ phone = "8801811314262" }: Props) {
  const pathname = usePathname();
  const [uiMode, setUiMode] = useState<UiMode>("default");

  useEffect(() => {
    const sync = () => setUiMode(readSitePreferences().uiMode);
    sync();
    window.addEventListener(PREFERENCE_EVENT, sync);
    return () => window.removeEventListener(PREFERENCE_EVENT, sync);
  }, []);

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
      className={`fixed z-[82] inline-flex h-12 w-12 items-center justify-center rounded-full text-xl text-white shadow-lg transition ${
        uiMode === "abo"
          ? "right-4 bg-slate-900 hover:bg-amber-400 hover:text-slate-900 sm:right-5 md:right-6"
          : "left-4 bg-emerald-600 hover:bg-emerald-700 sm:left-5 md:left-6"
      } ${
        pathname.startsWith("/checkout") ? "bottom-28" : "bottom-20"
      }`}
    >
      💬
    </a>
  );
}
