"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import type { FormEvent } from "react";
import {
  type Language,
  PREFERENCE_EVENT,
  readSitePreferences,
} from "@/lib/site-preferences";

type Props = {
  categories: string[];
};

export default function SearchAndFilter({ categories }: Props) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [search, setSearch] = useState(searchParams.get("search") || "");
  const [category, setCategory] = useState(searchParams.get("category") || "All");
  const [lang, setLang] = useState<Language>("bn");

  useEffect(() => {
    const sync = () => setLang(readSitePreferences().language);
    sync();
    window.addEventListener(PREFERENCE_EVENT, sync);
    return () => window.removeEventListener(PREFERENCE_EVENT, sync);
  }, []);

  const applyFilters = () => {
    const params = new URLSearchParams();

    if (search.trim()) {
      params.set("search", search.trim());
    }

    if (category && category !== "All") {
      params.set("category", category);
    }

    const query = params.toString();
    router.push(query ? `/?${query}` : "/");
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    applyFilters();
  };

  const isBn = lang === "bn";

  return (
    <form
      className="mb-5 rounded-3xl border border-cyan-200/70 bg-gradient-to-r from-white/95 via-cyan-50/70 to-white/95 p-3 shadow-[0_12px_30px_-24px_rgba(2,6,23,0.55)] backdrop-blur sm:mb-6 sm:p-4"
      onSubmit={handleSubmit}
    >
      <div className="mb-2 flex flex-wrap items-center justify-between gap-2 sm:mb-3">
        <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-slate-500 sm:text-xs sm:tracking-[0.18em]">
          {isBn ? "দ্রুত প্রোডাক্ট খুঁজুন" : "Find Products Fast"}
        </p>
        <p className="hidden text-xs font-medium text-slate-500 sm:block">
          {isBn ? "সার্চ + ক্যাটাগরি ফিল্টার" : "Search + Category Filter"}
        </p>
      </div>

      <div className="space-y-2.5">
        <div className="relative">
          <span className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-xs text-cyan-700 sm:text-sm">🔎</span>
          <input
            type="text"
            placeholder={isBn ? "পণ্য খুঁজুন..." : "Search products..."}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-xl border border-slate-300/90 bg-white pl-9 pr-3 py-2.5 text-sm text-slate-800 outline-none transition focus:border-teal-400 focus:ring-2 focus:ring-teal-100 sm:pl-10 sm:py-3"
          />
        </div>

        <div className="grid grid-cols-[1fr_98px] gap-2 sm:grid-cols-[1fr_120px] md:grid-cols-[1fr_140px]">
          <select
            aria-label="Product Category"
            title="Product Category"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full rounded-xl border border-slate-300/90 bg-white px-3 py-2.5 text-sm text-slate-800 outline-none transition focus:border-teal-400 focus:ring-2 focus:ring-teal-100 sm:px-4 sm:py-3"
          >
            <option value="All">{isBn ? "সব ক্যাটাগরি" : "All Categories"}</option>
            {categories.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>

          <button
            type="submit"
            className="rounded-xl bg-gradient-to-r from-teal-700 via-cyan-700 to-sky-700 px-3 py-2.5 text-sm font-semibold text-white transition duration-300 hover:-translate-y-0.5 hover:brightness-110 sm:px-5 sm:py-3"
          >
            {isBn ? "Apply" : "Apply"}
          </button>
        </div>
      </div>
    </form>
  );
}
