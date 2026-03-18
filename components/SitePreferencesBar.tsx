"use client";

import { useEffect, useState } from "react";
import { getSavedCurrency, saveCurrency, type Currency } from "@/lib/currency";
import {
  type Contrast,
  type Language,
  type Motion,
  PREFERENCE_EVENT,
  readSitePreferences,
  saveAndApplySitePreferences,
  type SitePreferences,
  type TextSize,
  type Theme,
  updateSitePreferences,
} from "@/lib/site-preferences";

export default function SitePreferencesBar({ compact = false }: { compact?: boolean }) {
  const [preferences, setPreferences] = useState<SitePreferences>(readSitePreferences());
  const [currency, setCurrency] = useState<Currency>("BDT");
  const [toast, setToast] = useState("");

  useEffect(() => {
    const sync = () => {
      setPreferences(readSitePreferences());
      setCurrency(getSavedCurrency());
    };

    sync();
    window.addEventListener(PREFERENCE_EVENT, sync);
    return () => window.removeEventListener(PREFERENCE_EVENT, sync);
  }, []);

  useEffect(() => {
    if (!toast) return;
    const id = window.setTimeout(() => setToast(""), 2200);
    return () => window.clearTimeout(id);
  }, [toast]);

  const setPreference = (partial: Partial<SitePreferences>) => {
    setPreferences(updateSitePreferences(partial));
  };

  const toggleTheme = () => {
    const nextTheme: Theme =
      preferences.theme === "system"
        ? "light"
        : preferences.theme === "light"
          ? "dark"
          : "system";
    setPreference({ theme: nextTheme });
  };

  const toggleLanguage = () => {
    const nextLanguage: Language = preferences.language === "en" ? "bn" : "en";
    setPreference({ language: nextLanguage });
  };

  const toggleTextSize = () => {
    const nextSize: TextSize = preferences.textSize === "normal" ? "large" : "normal";
    setPreference({ textSize: nextSize });
  };

  const toggleContrast = () => {
    const nextContrast: Contrast = preferences.contrast === "normal" ? "high" : "normal";
    setPreference({ contrast: nextContrast });
  };

  const toggleMotion = () => {
    const nextMotion: Motion = preferences.motion === "normal" ? "reduced" : "normal";
    setPreference({ motion: nextMotion });
  };

  const toggleCurrency = () => {
    const next: Currency = currency === "BDT" ? "USD" : "BDT";
    setCurrency(next);
    saveCurrency(next);
  };

  const resetAllPreferences = () => {
    const defaults: SitePreferences = {
      theme: "system",
      language: "bn",
      uiMode: "default",
      textSize: "normal",
      contrast: "normal",
      motion: "normal",
    };
    setPreferences(defaults);
    saveAndApplySitePreferences(defaults);
    setToast(defaults.language === "bn" ? "সব সেটিংস রিসেট হয়েছে" : "All preferences reset");
  };

  const isBn = preferences.language === "bn";
  const themeValue =
    preferences.theme === "system"
      ? isBn
        ? "অটো"
        : "Auto"
      : preferences.theme === "light"
        ? isBn
          ? "লাইট"
          : "Light"
        : isBn
          ? "ডার্ক"
          : "Dark";
  const languageValue = preferences.language === "en" ? "English" : "বাংলা";
  const textSizeValue =
    preferences.textSize === "normal" ? (isBn ? "স্বাভাবিক" : "Normal") : isBn ? "বড়" : "Large";
  const contrastValue =
    preferences.contrast === "normal" ? (isBn ? "স্বাভাবিক" : "Normal") : isBn ? "হাই" : "High";
  const motionValue =
    preferences.motion === "normal" ? (isBn ? "স্বাভাবিক" : "Normal") : isBn ? "কম" : "Reduced";
  const currencyValue = currency === "USD" ? "$ USD" : "৳ BDT";

  const applyPreset = (preset: "default" | "focus" | "readable") => {
    if (preset === "default") {
      resetAllPreferences();
      return;
    }

    if (preset === "focus") {
      const next: SitePreferences = {
        ...preferences,
        theme: "dark",
        textSize: "normal",
        contrast: "high",
        motion: "reduced",
      };
      setPreferences(next);
      saveAndApplySitePreferences(next);
      setToast(isBn ? "ফোকাস মোড চালু হয়েছে" : "Focus mode activated");
      return;
    }

    const next: SitePreferences = {
      ...preferences,
      theme: "light",
      textSize: "large",
      contrast: "high",
      motion: "reduced",
    };
    setPreferences(next);
    saveAndApplySitePreferences(next);
    setToast(isBn ? "রিডেবল মোড চালু হয়েছে" : "Readable mode activated");
  };

  return (
    <section
      className={`rounded-3xl border border-slate-200 bg-white p-4 shadow-sm ${compact ? "mb-4" : "mb-8"}`}
    >
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h3 className="text-lg font-bold text-slate-900">⚙️ {isBn ? "সাইট পছন্দ" : "Site Preferences"}</h3>
          <p className="mt-1 text-sm text-slate-500">
            {isBn
              ? "থিম ও ভাষা বেছে নিন। আপনার সেটিংস সংরক্ষণ হবে।"
              : "Choose your theme and language. Your preferences are saved."}
          </p>
        </div>

        <div className="grid w-full grid-cols-5 gap-2 sm:grid-cols-10">
          <button
            type="button"
            onClick={() => applyPreset("default")}
            className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-slate-300 bg-slate-50 text-base transition hover:bg-slate-100"
            aria-label={isBn ? "ডিফল্ট প্রিসেট" : "Default preset"}
            title={isBn ? "ডিফল্ট প্রিসেট" : "Default preset"}
          >
            🎯
          </button>

          <button
            type="button"
            onClick={() => applyPreset("focus")}
            className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-indigo-300 bg-indigo-50 text-base text-indigo-800 transition hover:bg-indigo-100"
            aria-label={isBn ? "ফোকাস প্রিসেট" : "Focus preset"}
            title={isBn ? "ফোকাস প্রিসেট" : "Focus preset"}
          >
            🌙
          </button>

          <button
            type="button"
            onClick={() => applyPreset("readable")}
            className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-amber-300 bg-amber-50 text-base text-amber-800 transition hover:bg-amber-100"
            aria-label={isBn ? "রিডেবল প্রিসেট" : "Readable preset"}
            title={isBn ? "রিডেবল প্রিসেট" : "Readable preset"}
          >
            🔎
          </button>

          <button
            type="button"
            onClick={toggleTheme}
            className={`inline-flex h-10 w-10 items-center justify-center rounded-xl border text-base transition ${
              preferences.theme === "dark"
                ? "border-slate-700 bg-slate-800 text-white hover:bg-slate-700"
                : "border-slate-300 bg-slate-50 text-slate-800 hover:bg-slate-100"
            }`}
            aria-label={`${isBn ? "থিম" : "Theme"}: ${themeValue}`}
            title={`${isBn ? "থিম" : "Theme"}: ${themeValue}`}
          >
            {preferences.theme === "dark" ? "🌙" : preferences.theme === "light" ? "☀️" : "🌓"}
          </button>

          <button
            type="button"
            onClick={toggleLanguage}
            className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-slate-300 bg-slate-50 text-base text-slate-800 transition hover:bg-slate-100"
            aria-label={`${isBn ? "ভাষা" : "Language"}: ${languageValue}`}
            title={`${isBn ? "ভাষা" : "Language"}: ${languageValue}`}
          >
            🌐
          </button>

          <button
            type="button"
            onClick={toggleCurrency}
            className={`inline-flex h-10 w-10 items-center justify-center rounded-xl border text-base transition ${
              currency === "USD"
                ? "border-emerald-300 bg-emerald-100 text-emerald-900 hover:bg-emerald-200"
                : "border-slate-300 bg-slate-50 text-slate-800 hover:bg-slate-100"
            }`}
            aria-label={`${isBn ? "মুদ্রা" : "Currency"}: ${currencyValue}`}
            title={`${isBn ? "মুদ্রা" : "Currency"}: ${currencyValue}`}
          >
            💱
          </button>

          <button
            type="button"
            onClick={toggleTextSize}
            className={`inline-flex h-10 w-10 items-center justify-center rounded-xl border text-base transition ${
              preferences.textSize === "large"
                ? "border-indigo-300 bg-indigo-100 text-indigo-900 hover:bg-indigo-200"
                : "border-slate-300 bg-slate-50 text-slate-800 hover:bg-slate-100"
            }`}
            aria-label={`${isBn ? "লেখার আকার" : "Text Size"}: ${textSizeValue}`}
            title={`${isBn ? "লেখার আকার" : "Text Size"}: ${textSizeValue}`}
          >
            🔠
          </button>

          <button
            type="button"
            onClick={toggleContrast}
            className={`inline-flex h-10 w-10 items-center justify-center rounded-xl border text-base transition ${
              preferences.contrast === "high"
                ? "border-amber-300 bg-amber-100 text-amber-900 hover:bg-amber-200"
                : "border-slate-300 bg-slate-50 text-slate-800 hover:bg-slate-100"
            }`}
            aria-label={`${isBn ? "কনট্রাস্ট" : "Contrast"}: ${contrastValue}`}
            title={`${isBn ? "কনট্রাস্ট" : "Contrast"}: ${contrastValue}`}
          >
            🌓
          </button>

          <button
            type="button"
            onClick={toggleMotion}
            className={`inline-flex h-10 w-10 items-center justify-center rounded-xl border text-base transition ${
              preferences.motion === "reduced"
                ? "border-cyan-300 bg-cyan-100 text-cyan-900 hover:bg-cyan-200"
                : "border-slate-300 bg-slate-50 text-slate-800 hover:bg-slate-100"
            }`}
            aria-label={`${isBn ? "মোশন" : "Motion"}: ${motionValue}`}
            title={`${isBn ? "মোশন" : "Motion"}: ${motionValue}`}
          >
            🎞️
          </button>

          <button
            type="button"
            onClick={resetAllPreferences}
            className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-rose-300 bg-rose-50 text-base text-rose-800 transition hover:bg-rose-100"
            aria-label={isBn ? "সব সেটিংস রিসেট" : "Reset All Preferences"}
            title={isBn ? "সব সেটিংস রিসেট" : "Reset All Preferences"}
          >
            ♻️
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
