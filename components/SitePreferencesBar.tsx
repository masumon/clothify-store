"use client";

import { useState } from "react";

export default function SitePreferencesBar() {
  const [theme, setTheme] = useState<"Light" | "Dark">("Light");
  const [language, setLanguage] = useState<"English" | "Bangla">("English");

  return (
    <section className="mb-8 rounded-3xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h3 className="text-lg font-bold text-slate-900">
            Site Preferences
          </h3>
          <p className="mt-1 text-sm text-slate-500">
            Theme and language toggle foundation for your premium ecommerce experience.
          </p>
        </div>

        <div className="flex flex-wrap gap-3">
          <button
            type="button"
            onClick={() => setTheme(theme === "Light" ? "Dark" : "Light")}
            className="rounded-full border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
          >
            Theme: {theme}
          </button>

          <button
            type="button"
            onClick={() =>
              setLanguage(language === "English" ? "Bangla" : "English")
            }
            className="rounded-full border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
          >
            Language: {language}
          </button>
        </div>
      </div>
    </section>
  );
}
