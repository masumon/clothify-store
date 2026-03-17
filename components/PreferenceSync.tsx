"use client";

import { useEffect } from "react";

type Theme = "light" | "dark" | "system";
type Language = "en" | "bn";
type TextSize = "normal" | "large";
type Contrast = "normal" | "high";
type Motion = "normal" | "reduced";

function resolveTheme(theme: Theme): "light" | "dark" {
  if (theme === "system") {
    return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
  }
  return theme;
}

function syncPreferencesToDom() {
  const root = document.documentElement;

  const rawLang = localStorage.getItem("clothfy-lang") || localStorage.getItem("clothify-language") || root.lang || "bn";
  const lang: Language = rawLang === "en" ? "en" : "bn";
  localStorage.setItem("clothfy-lang", lang);
  localStorage.setItem("clothify-language", lang);
  root.lang = lang;

  const rawTheme = localStorage.getItem("clothfy-theme") || localStorage.getItem("clothify-theme") || "system";
  const theme: Theme = rawTheme === "light" || rawTheme === "dark" || rawTheme === "system" ? rawTheme : "system";
  const resolvedTheme = resolveTheme(theme);
  localStorage.setItem("clothfy-theme", theme);
  localStorage.setItem("clothify-theme", theme);
  root.setAttribute("data-theme", theme);
  root.classList.toggle("dark-theme", resolvedTheme === "dark");

  const textSize: TextSize = localStorage.getItem("clothify-text-size") === "large" ? "large" : "normal";
  root.classList.toggle("text-size-large", textSize === "large");

  const contrast: Contrast = localStorage.getItem("clothify-contrast") === "high" ? "high" : "normal";
  root.classList.toggle("high-contrast", contrast === "high");

  const motion: Motion = localStorage.getItem("clothify-motion") === "reduced" ? "reduced" : "normal";
  root.classList.toggle("reduce-motion", motion === "reduced");
}

export default function PreferenceSync() {
  useEffect(() => {
    syncPreferencesToDom();

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

    window.addEventListener("clothfy-preferences-change", onPreferenceEvent);
    window.addEventListener("storage", onStorage);
    media.addEventListener("change", onSystemThemeChange);

    return () => {
      window.removeEventListener("clothfy-preferences-change", onPreferenceEvent);
      window.removeEventListener("storage", onStorage);
      media.removeEventListener("change", onSystemThemeChange);
    };
  }, []);

  return null;
}
