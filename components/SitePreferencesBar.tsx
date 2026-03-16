"use client";

import { useEffect, useState } from "react";

type Theme = "light" | "dark";
type Language = "en" | "bn";

const THEME_KEY = "clothify-theme";
const LANGUAGE_KEY = "clothify-language";

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

export default function SitePreferencesBar() {
  const [theme, setTheme] = useState<Theme>("light");
  const [language, setLanguage] = useState<Language>("en");

  useEffect(() => {
    const savedTheme = localStorage.getItem(THEME_KEY);
    const savedLanguage = localStorage.getItem(LANGUAGE_KEY);

    const resolvedTheme: Theme =
      savedTheme === "dark" || savedTheme === "light" ? savedTheme : "light";
    const resolvedLanguage: Language =
      savedLanguage === "bn" || savedLanguage === "en" ? savedLanguage : "en";

    setTheme(resolvedTheme);
    setLanguage(resolvedLanguage);
    applyTheme(resolvedTheme);
    applyLanguage(resolvedLanguage);
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

  const isBn = language === "bn";
  const title = isBn ? "সাইট পছন্দ" : "Site Preferences";
  const subtitle = isBn
    ? "থিম ও ভাষা বেছে নিন। আপনার সেটিংস সংরক্ষণ হবে।"
    : "Choose your theme and language. Your preferences are saved.";
  const themeLabel = isBn ? "থিম" : "Theme";
  const languageLabel = isBn ? "ভাষা" : "Language";
  const themeValue = theme === "light" ? (isBn ? "লাইট" : "Light") : isBn ? "ডার্ক" : "Dark";
  const languageValue = language === "en" ? "English" : "বাংলা";

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
            className="rounded-full border border-slate-300 bg-slate-50 px-4 py-2 text-sm font-semibold text-slate-800 transition hover:bg-slate-100"
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
        </div>
      </div>
    </section>
  );
}
