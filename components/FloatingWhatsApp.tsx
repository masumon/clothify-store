"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import AppIcon from "@/components/AppIcon";
import {
  FLOATING_PANEL_EVENT,
  isLowPriorityFloatingHiddenPath,
} from "@/lib/floating-ui";
import { PREFERENCE_EVENT, readSitePreferences, type UiMode } from "@/lib/site-preferences";

type Props = {
  phone?: string;
};

export default function FloatingWhatsApp({ phone = "8801811314262" }: Props) {
  const pathname = usePathname();
  const [uiMode, setUiMode] = useState<UiMode>("default");
  const [sumonixOpen, setSumonixOpen] = useState(false);

  useEffect(() => {
    const sync = () => setUiMode(readSitePreferences().uiMode);
    sync();
    window.addEventListener(PREFERENCE_EVENT, sync);
    return () => window.removeEventListener(PREFERENCE_EVENT, sync);
  }, []);

  useEffect(() => {
    const syncPanelState = (event: Event) => {
      const detail = (event as CustomEvent<{ sumonixOpen?: boolean }>).detail;
      setSumonixOpen(Boolean(detail?.sumonixOpen));
    };
    window.addEventListener(FLOATING_PANEL_EVENT, syncPanelState as EventListener);
    return () => window.removeEventListener(FLOATING_PANEL_EVENT, syncPanelState as EventListener);
  }, []);

  if (pathname.startsWith("/admin") || isLowPriorityFloatingHiddenPath(pathname) || sumonixOpen) {
    return null;
  }

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
      <AppIcon name="whatsapp" className="h-5 w-5" />
    </a>
  );
}
