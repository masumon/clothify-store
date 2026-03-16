"use client";

import { useEffect, useState } from "react";

type Theme = "light" | "dark";
type Language = "en" | "bn";
type TextSize = "normal" | "large";
type Contrast = "normal" | "high";

const THEME_KEY = "clothify-theme";
const LANGUAGE_KEY = "clothify-language";
const TEXT_SIZE_KEY = "clothify-text-size";
const CONTRAST_KEY = "clothify-contrast";

function applyTheme(theme: Theme) {
  const body = document.body;
  const root = document.documentElement;

  root.setAttribute("data-theme", theme);

  if (theme === "dark") {
    body.classList.remove("bg-gray-100", "text-slate-900");
    body.classList.add("bg-slate-950", "text-slate-100");
  } else {
    body.classList.remove("bg-slate-950", "text-slate-100");
    body.classList.add("bg-gray-100", "text-slate-900");
  }
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

export default function SitePreferencesBar() {
  const [theme, setTheme] = useState<Theme>("light");
  const [language, setLanguage] = useState<Language>("en");
  const [textSize, setTextSize] = useState<TextSize>("normal");
  const [contrast, setContrast] = useState<Contrast>("normal");

  useEffect(() => {
    const savedTheme = localStorage.getItem(THEME_KEY);
    const savedLanguage = localStorage.getItem(LANGUAGE_KEY);
    const savedTextSize = localStorage.getItem(TEXT_SIZE_KEY);
    const savedContrast = localStorage.getItem(CONTRAST_KEY);

    const resolvedTheme: Theme =
      savedTheme === "dark" || savedTheme === "light" ? savedTheme : "light";
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

    setTheme(resolvedTheme);
    setLanguage(resolvedLanguage);
    setTextSize(resolvedTextSize);
    setContrast(resolvedContrast);
    applyTheme(resolvedTheme);
    applyLanguage(resolvedLanguage);
    applyTextSize(resolvedTextSize);
    applyContrast(resolvedContrast);
  }, []);

  const toggleTheme = () => {
    const nextTheme: Theme = theme === "light" ? "dark" : "light";
    setTheme(nextTheme);
    localStorage.setItem(THEME_KEY, nextTheme);
    applyTheme(nextTheme);
  };

  const toggleLanguage = () => {
    const nextLanguage: Language = language === "en" ? "bn" : "en";
    setLanguage(nextLanguage);
    localStorage.setItem(LANGUAGE_KEY, nextLanguage);
    applyLanguage(nextLanguage);
  };

  const toggleTextSize = () => {
    const nextSize: TextSize = textSize === "normal" ? "large" : "normal";
    setTextSize(nextSize);
    localStorage.setItem(TEXT_SIZE_KEY, nextSize);
    applyTextSize(nextSize);
  };

  const toggleContrast = () => {
    const nextContrast: Contrast = contrast === "normal" ? "high" : "normal";
    setContrast(nextContrast);
    localStorage.setItem(CONTRAST_KEY, nextContrast);
    applyContrast(nextContrast);
  };

  const isBn = language === "bn";
  const title = isBn ? "সাইট পছন্দ" : "Site Preferences";
  const subtitle = isBn
    ? "থিম ও ভাষা বেছে নিন। আপনার সেটিংস সংরক্ষণ হবে।"
    : "Choose your theme and language. Your preferences are saved.";
  const themeLabel = isBn ? "থিম" : "Theme";
  const languageLabel = isBn ? "ভাষা" : "Language";
  const themeValue = theme === "light" ? (isBn ? "লাইট" : "Light") : isBn ? "ডার্ক" : "Dark";
  const languageValue = language === "en" ? "English" : "বাংলা";
  const textSizeLabel = isBn ? "লেখার আকার" : "Text Size";
  const textSizeValue =
    textSize === "normal" ? (isBn ? "স্বাভাবিক" : "Normal") : isBn ? "বড়" : "Large";
  const contrastLabel = isBn ? "কনট্রাস্ট" : "Contrast";
  const contrastValue =
    contrast === "normal" ? (isBn ? "স্বাভাবিক" : "Normal") : isBn ? "হাই" : "High";

  return (
    <section className="mb-8 rounded-3xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h3 className="text-lg font-bold text-slate-900">{title}</h3>
          <p className="mt-1 text-sm text-slate-500">
            {subtitle}
          </p>
        </div>

        <div className="flex flex-wrap gap-3">
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
            {languageLabel}: {languageValue}
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
            {textSizeLabel}: {textSizeValue}
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
            {contrastLabel}: {contrastValue}
          </button>
        </div>
      </div>
    </section>
  );
}
