"use client";

import { useEffect, useState } from "react";

type Theme = "light" | "dark" | "system";
type Language = "en" | "bn";
type TextSize = "normal" | "large";
type Contrast = "normal" | "high";
type Motion = "normal" | "reduced";

const THEME_KEY = "clothfy-theme";
const LANGUAGE_KEY = "clothfy-lang";
const TEXT_SIZE_KEY = "clothify-text-size";
const CONTRAST_KEY = "clothify-contrast";
const MOTION_KEY = "clothify-motion";

function applyTheme(theme: Theme) {
  const body = document.body;
  const root = document.documentElement;
  const prefersDark =
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-color-scheme: dark)").matches;
  const resolvedTheme = theme === "system" ? (prefersDark ? "dark" : "light") : theme;

  root.setAttribute("data-theme", theme);
  root.classList.toggle("dark-theme", resolvedTheme === "dark");

  if (resolvedTheme === "dark") {
    body.classList.remove("bg-gray-100", "text-slate-900");
    body.classList.add("bg-slate-950", "text-slate-100");
  } else {
    body.classList.remove("bg-slate-950", "text-slate-100");
    body.classList.add("bg-gray-100", "text-slate-900");
  }
}

function emitPreferenceChange() {
  window.dispatchEvent(new Event("clothfy-preferences-change"));
}

function applyLanguage(language: Language) {
  document.documentElement.lang = language;
}

function applyTextSize(size: TextSize) {
  const root = document.documentElement;
  root.classList.toggle("text-size-large", size === "large");
}

function applyContrast(contrast: Contrast) {
  const root = document.documentElement;
  root.classList.toggle("high-contrast", contrast === "high");
}

function applyMotion(motion: Motion) {
  const root = document.documentElement;
  root.classList.toggle("reduce-motion", motion === "reduced");
}

export default function SitePreferencesBar({ compact = false }: { compact?: boolean }) {
  const [theme, setTheme] = useState<Theme>("system");
  const [language, setLanguage] = useState<Language>("en");
  const [textSize, setTextSize] = useState<TextSize>("normal");
  const [contrast, setContrast] = useState<Contrast>("normal");
  const [motion, setMotion] = useState<Motion>("normal");
  const [toast, setToast] = useState("");

  useEffect(() => {
    const savedTheme = localStorage.getItem(THEME_KEY) || localStorage.getItem("clothify-theme");
    const savedLanguage = localStorage.getItem(LANGUAGE_KEY) || localStorage.getItem("clothify-language");
    const savedTextSize = localStorage.getItem(TEXT_SIZE_KEY);
    const savedContrast = localStorage.getItem(CONTRAST_KEY);
    const savedMotion = localStorage.getItem(MOTION_KEY);

    const resolvedTheme: Theme =
      savedTheme === "dark" || savedTheme === "light" || savedTheme === "system"
        ? savedTheme
        : "system";
    const resolvedLanguage: Language =
      savedLanguage === "bn" || savedLanguage === "en" ? savedLanguage : "en";
    const resolvedTextSize: TextSize =
      savedTextSize === "large" || savedTextSize === "normal"
        ? savedTextSize
        : "normal";
    const resolvedContrast: Contrast =
      savedContrast === "high" || savedContrast === "normal"
        ? savedContrast
        : "normal";
    const resolvedMotion: Motion =
      savedMotion === "reduced" || savedMotion === "normal"
        ? savedMotion
        : "normal";

    setTheme(resolvedTheme);
    setLanguage(resolvedLanguage);
    setTextSize(resolvedTextSize);
    setContrast(resolvedContrast);
    setMotion(resolvedMotion);
    applyTheme(resolvedTheme);
    applyLanguage(resolvedLanguage);
    applyTextSize(resolvedTextSize);
    applyContrast(resolvedContrast);
    applyMotion(resolvedMotion);

    emitPreferenceChange();
  }, []);

  useEffect(() => {
    const syncFromStorage = () => {
      const savedTheme = localStorage.getItem(THEME_KEY);
      const savedLanguage = localStorage.getItem(LANGUAGE_KEY);

      if (savedTheme === "dark" || savedTheme === "light" || savedTheme === "system") {
        setTheme(savedTheme);
        applyTheme(savedTheme);
      }

      if (savedLanguage === "en" || savedLanguage === "bn") {
        setLanguage(savedLanguage);
        applyLanguage(savedLanguage);
      }
    };

    window.addEventListener("clothfy-preferences-change", syncFromStorage);
    return () => window.removeEventListener("clothfy-preferences-change", syncFromStorage);
  }, []);

  useEffect(() => {
    if (theme !== "system") return;

    const media = window.matchMedia("(prefers-color-scheme: dark)");
    const onSystemThemeChange = () => applyTheme("system");

    media.addEventListener("change", onSystemThemeChange);
    return () => media.removeEventListener("change", onSystemThemeChange);
  }, [theme]);

  useEffect(() => {
    if (!toast) return;
    const id = window.setTimeout(() => setToast(""), 2200);
    return () => window.clearTimeout(id);
  }, [toast]);

  const toggleTheme = () => {
    const nextTheme: Theme =
      theme === "system" ? "light" : theme === "light" ? "dark" : "system";
    setTheme(nextTheme);
    localStorage.setItem(THEME_KEY, nextTheme);
    applyTheme(nextTheme);
    emitPreferenceChange();
  };

  const toggleLanguage = () => {
    const nextLanguage: Language = language === "en" ? "bn" : "en";
    setLanguage(nextLanguage);
    localStorage.setItem(LANGUAGE_KEY, nextLanguage);
    applyLanguage(nextLanguage);
    emitPreferenceChange();
  };

  const toggleTextSize = () => {
    const nextSize: TextSize = textSize === "normal" ? "large" : "normal";
    setTextSize(nextSize);
    localStorage.setItem(TEXT_SIZE_KEY, nextSize);
    applyTextSize(nextSize);
    emitPreferenceChange();
  };

  const toggleContrast = () => {
    const nextContrast: Contrast = contrast === "normal" ? "high" : "normal";
    setContrast(nextContrast);
    localStorage.setItem(CONTRAST_KEY, nextContrast);
    applyContrast(nextContrast);
    emitPreferenceChange();
  };

  const toggleMotion = () => {
    const nextMotion: Motion = motion === "normal" ? "reduced" : "normal";
    setMotion(nextMotion);
    localStorage.setItem(MOTION_KEY, nextMotion);
    applyMotion(nextMotion);
    emitPreferenceChange();
  };

  const resetAllPreferences = () => {
    const defaultTheme: Theme = "system";
    const defaultLanguage: Language = "en";
    const defaultTextSize: TextSize = "normal";
    const defaultContrast: Contrast = "normal";
    const defaultMotion: Motion = "normal";

    setTheme(defaultTheme);
    setLanguage(defaultLanguage);
    setTextSize(defaultTextSize);
    setContrast(defaultContrast);
    setMotion(defaultMotion);

    localStorage.setItem(THEME_KEY, defaultTheme);
    localStorage.setItem(LANGUAGE_KEY, defaultLanguage);
    localStorage.setItem(TEXT_SIZE_KEY, defaultTextSize);
    localStorage.setItem(CONTRAST_KEY, defaultContrast);
    localStorage.setItem(MOTION_KEY, defaultMotion);

    applyTheme(defaultTheme);
    applyLanguage(defaultLanguage);
    applyTextSize(defaultTextSize);
    applyContrast(defaultContrast);
    applyMotion(defaultMotion);
    emitPreferenceChange();

    setToast(language === "bn" ? "সব সেটিংস রিসেট হয়েছে" : "All preferences reset");
  };

  const isBn = language === "bn";
  const title = isBn ? "সাইট পছন্দ" : "Site Preferences";
  const subtitle = isBn
    ? "থিম ও ভাষা বেছে নিন। আপনার সেটিংস সংরক্ষণ হবে।"
    : "Choose your theme and language. Your preferences are saved.";
  const themeLabel = isBn ? "থিম" : "Theme";
  const languageLabel = isBn ? "ভাষা" : "Language";
  const themeValue =
    theme === "system"
      ? isBn
        ? "অটো"
        : "Auto"
      : theme === "light"
        ? isBn
          ? "লাইট"
          : "Light"
        : isBn
          ? "ডার্ক"
          : "Dark";
  const languageValue = language === "en" ? "English" : "বাংলা";
  const textSizeLabel = isBn ? "লেখার আকার" : "Text Size";
  const textSizeValue =
    textSize === "normal" ? (isBn ? "স্বাভাবিক" : "Normal") : isBn ? "বড়" : "Large";
  const contrastLabel = isBn ? "কনট্রাস্ট" : "Contrast";
  const contrastValue =
    contrast === "normal" ? (isBn ? "স্বাভাবিক" : "Normal") : isBn ? "হাই" : "High";
  const motionLabel = isBn ? "মোশন" : "Motion";
  const motionValue =
    motion === "normal" ? (isBn ? "স্বাভাবিক" : "Normal") : isBn ? "কম" : "Reduced";
  const resetLabel = isBn ? "সব সেটিংস রিসেট" : "Reset All Preferences";

  const applyPreset = (preset: "default" | "focus" | "readable") => {
    if (preset === "default") {
      const defaultTheme: Theme = "system";
      const defaultLanguage: Language = "bn";
      const defaultTextSize: TextSize = "normal";
      const defaultContrast: Contrast = "normal";
      const defaultMotion: Motion = "normal";

      setTheme(defaultTheme);
      setLanguage(defaultLanguage);
      setTextSize(defaultTextSize);
      setContrast(defaultContrast);
      setMotion(defaultMotion);

      localStorage.setItem(THEME_KEY, defaultTheme);
      localStorage.setItem(LANGUAGE_KEY, defaultLanguage);
      localStorage.setItem(TEXT_SIZE_KEY, defaultTextSize);
      localStorage.setItem(CONTRAST_KEY, defaultContrast);
      localStorage.setItem(MOTION_KEY, defaultMotion);

      applyTheme(defaultTheme);
      applyLanguage(defaultLanguage);
      applyTextSize(defaultTextSize);
      applyContrast(defaultContrast);
      applyMotion(defaultMotion);
      emitPreferenceChange();
      setToast(isBn ? "ডিফল্ট প্রিসেট চালু হয়েছে" : "Default preset activated");
      return;
    }

    if (preset === "focus") {
      const nextTheme: Theme = "dark";
      const nextLanguage: Language = language;
      const nextTextSize: TextSize = "normal";
      const nextContrast: Contrast = "high";
      const nextMotion: Motion = "reduced";

      setTheme(nextTheme);
      setLanguage(nextLanguage);
      setTextSize(nextTextSize);
      setContrast(nextContrast);
      setMotion(nextMotion);

      localStorage.setItem(THEME_KEY, nextTheme);
      localStorage.setItem(LANGUAGE_KEY, nextLanguage);
      localStorage.setItem(TEXT_SIZE_KEY, nextTextSize);
      localStorage.setItem(CONTRAST_KEY, nextContrast);
      localStorage.setItem(MOTION_KEY, nextMotion);

      applyTheme(nextTheme);
      applyLanguage(nextLanguage);
      applyTextSize(nextTextSize);
      applyContrast(nextContrast);
      applyMotion(nextMotion);
      emitPreferenceChange();
      setToast(isBn ? "ফোকাস মোড চালু হয়েছে" : "Focus mode activated");
      return;
    }

    const nextTheme: Theme = "light";
    const nextLanguage: Language = language;
    const nextTextSize: TextSize = "large";
    const nextContrast: Contrast = "high";
    const nextMotion: Motion = "reduced";

    setTheme(nextTheme);
    setLanguage(nextLanguage);
    setTextSize(nextTextSize);
    setContrast(nextContrast);
    setMotion(nextMotion);

    localStorage.setItem(THEME_KEY, nextTheme);
    localStorage.setItem(LANGUAGE_KEY, nextLanguage);
    localStorage.setItem(TEXT_SIZE_KEY, nextTextSize);
    localStorage.setItem(CONTRAST_KEY, nextContrast);
    localStorage.setItem(MOTION_KEY, nextMotion);

    applyTheme(nextTheme);
    applyLanguage(nextLanguage);
    applyTextSize(nextTextSize);
    applyContrast(nextContrast);
    applyMotion(nextMotion);
    emitPreferenceChange();
    setToast(isBn ? "রিডেবল মোড চালু হয়েছে" : "Readable mode activated");
  };

  return (
    <section className={`rounded-3xl border border-slate-200 bg-white p-4 shadow-sm ${compact ? "mb-4" : "mb-8"}`}>
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h3 className="text-lg font-bold text-slate-900">⚙️ {title}</h3>
          <p className="mt-1 text-sm text-slate-500">
            {subtitle}
          </p>
        </div>

        <div className="grid w-full gap-2 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-8">
          <button
            type="button"
            onClick={() => applyPreset("default")}
            className="rounded-xl border border-slate-300 bg-slate-50 px-3 py-2 text-xs font-semibold text-slate-700 transition hover:bg-slate-100"
          >
            🎯 {isBn ? "ডিফল্ট" : "Default"}
          </button>

          <button
            type="button"
            onClick={() => applyPreset("focus")}
            className="rounded-xl border border-indigo-300 bg-indigo-50 px-3 py-2 text-xs font-semibold text-indigo-800 transition hover:bg-indigo-100"
          >
            🌙 {isBn ? "ফোকাস" : "Focus"}
          </button>

          <button
            type="button"
            onClick={() => applyPreset("readable")}
            className="rounded-xl border border-amber-300 bg-amber-50 px-3 py-2 text-xs font-semibold text-amber-800 transition hover:bg-amber-100"
          >
            🔎 {isBn ? "রিডেবল" : "Readable"}
          </button>

          <button
            type="button"
            onClick={toggleTheme}
            className={`rounded-full border px-4 py-2 text-sm font-semibold transition ${
              theme === "dark"
                ? "border-slate-700 bg-slate-800 text-white hover:bg-slate-700"
                : "border-slate-300 bg-slate-50 text-slate-800 hover:bg-slate-100"
            }`}
          >
            {themeLabel}: {themeValue}
          </button>

          <button
            type="button"
            onClick={toggleLanguage}
            className="rounded-full border border-slate-300 bg-slate-50 px-4 py-2 text-sm font-semibold text-slate-800 transition hover:bg-slate-100"
          >
            🌐 {languageLabel}: {languageValue}
          </button>

          <button
            type="button"
            onClick={toggleTextSize}
            className={`rounded-full border px-4 py-2 text-sm font-semibold transition ${
              textSize === "large"
                ? "border-indigo-300 bg-indigo-100 text-indigo-900 hover:bg-indigo-200"
                : "border-slate-300 bg-slate-50 text-slate-800 hover:bg-slate-100"
            }`}
          >
            🔠 {textSizeLabel}: {textSizeValue}
          </button>

          <button
            type="button"
            onClick={toggleContrast}
            className={`rounded-full border px-4 py-2 text-sm font-semibold transition ${
              contrast === "high"
                ? "border-amber-300 bg-amber-100 text-amber-900 hover:bg-amber-200"
                : "border-slate-300 bg-slate-50 text-slate-800 hover:bg-slate-100"
            }`}
          >
            🌓 {contrastLabel}: {contrastValue}
          </button>

          <button
            type="button"
            onClick={toggleMotion}
            className={`rounded-full border px-4 py-2 text-sm font-semibold transition ${
              motion === "reduced"
                ? "border-cyan-300 bg-cyan-100 text-cyan-900 hover:bg-cyan-200"
                : "border-slate-300 bg-slate-50 text-slate-800 hover:bg-slate-100"
            }`}
          >
            🎞️ {motionLabel}: {motionValue}
          </button>

          <button
            type="button"
            onClick={resetAllPreferences}
            className="rounded-full border border-rose-300 bg-rose-50 px-4 py-2 text-sm font-semibold text-rose-800 transition hover:bg-rose-100"
          >
            ♻️ {resetLabel}
          </button>
        </div>
      </div>

      {toast ? (
        <div className="mt-3 rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-2 text-xs font-semibold text-emerald-800">
          {toast}
        </div>
      ) : null}
    </section>
  );
}
