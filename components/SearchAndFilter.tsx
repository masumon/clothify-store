"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import type { FormEvent } from "react";

type Props = {
  categories: string[];
};

export default function SearchAndFilter({ categories }: Props) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [search, setSearch] = useState(searchParams.get("search") || "");
  const [category, setCategory] = useState(searchParams.get("category") || "All");

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

  return (
    <form
      className="mb-8 rounded-2xl border border-slate-200/80 bg-white/90 p-4 shadow-[0_10px_32px_-28px_rgba(2,6,23,0.6)] backdrop-blur"
      onSubmit={handleSubmit}
    >
      <div className="grid gap-4 md:grid-cols-[1fr_220px_140px]">
        <input
          type="text"
          placeholder="🔍 Search products..."
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
          <option value="All">All Categories</option>
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
          ✨ Apply
        </button>
      </div>
    </form>
  );
}
