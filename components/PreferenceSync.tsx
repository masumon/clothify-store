"use client";

import { useEffect } from "react";
import {
  applySitePreferencesToDom,
  PREFERENCE_EVENT,
  readSitePreferences,
} from "@/lib/site-preferences";

export default function PreferenceSync() {
  useEffect(() => {
    const syncPreferencesToDom = () => {
      applySitePreferencesToDom(readSitePreferences());
    };

    const onPreferenceEvent = () => syncPreferencesToDom();
    const onStorage = (event: StorageEvent) => {
      if (!event.key || event.key.startsWith("clothfy-") || event.key.startsWith("clothify-")) {
        syncPreferencesToDom();
      }
    };

    const media = window.matchMedia("(prefers-color-scheme: dark)");
    const onSystemThemeChange = () => {
      const theme = localStorage.getItem("clothfy-theme") || localStorage.getItem("clothify-theme") || "system";
      if (theme === "system") {
        syncPreferencesToDom();
      }
    };

    syncPreferencesToDom();
    window.addEventListener(PREFERENCE_EVENT, onPreferenceEvent);
    window.addEventListener("storage", onStorage);
    media.addEventListener("change", onSystemThemeChange);

    return () => {
      window.removeEventListener(PREFERENCE_EVENT, onPreferenceEvent);
      window.removeEventListener("storage", onStorage);
      media.removeEventListener("change", onSystemThemeChange);
    };
  }, []);

  return null;
}
