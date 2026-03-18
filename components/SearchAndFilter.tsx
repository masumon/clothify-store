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
      className="mb-6 rounded-3xl border border-slate-200/80 bg-white/90 p-4 shadow-[0_12px_30px_-24px_rgba(2,6,23,0.55)] backdrop-blur sm:p-5"
      onSubmit={handleSubmit}
    >
      <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
        <p className="text-xs font-bold uppercase tracking-[0.18em] text-slate-500">
          {isBn ? "দ্রুত প্রোডাক্ট খুঁজুন" : "Find Products Fast"}
        </p>
        <p className="text-xs font-medium text-slate-500">
          {isBn ? "সার্চ + ক্যাটাগরি ফিল্টার" : "Search + Category Filter"}
        </p>
      </div>

      <div className="grid gap-3 md:grid-cols-[1fr_220px_140px]">
        <input
          type="text"
          placeholder={isBn ? "🔍 পণ্য খুঁজুন..." : "🔍 Search products..."}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full rounded-xl border border-slate-300/90 bg-white px-4 py-3 text-slate-800 outline-none transition focus:border-teal-400 focus:ring-2 focus:ring-teal-100"
        />

        <select
          aria-label="Product Category"
          title="Product Category"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="w-full rounded-xl border border-slate-300/90 bg-white px-4 py-3 text-slate-800 outline-none transition focus:border-teal-400 focus:ring-2 focus:ring-teal-100"
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
          className="rounded-xl bg-teal-700 px-5 py-3 font-semibold text-white transition duration-300 hover:-translate-y-0.5 hover:bg-teal-800"
        >
          {isBn ? "✨ Apply করুন" : "✨ Apply"}
        </button>
      </div>
    </form>
  );
}
