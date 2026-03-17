"use client";

import { useMemo, useState } from "react";
import ProductCard from "@/components/ProductCard";
import type { Product } from "@/types";

type Props = {
  products: Product[];
  whatsappNumber: string;
};

type SortKey = "popular" | "newest" | "price-low" | "price-high" | "discount-high";

export default function SearchResultsClient({ products, whatsappNumber }: Props) {
  const [sortBy, setSortBy] = useState<SortKey>("popular");
  const [maxPrice, setMaxPrice] = useState<number | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  const [visibleCount, setVisibleCount] = useState(12);
  const [minStockOnly, setMinStockOnly] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedSize, setSelectedSize] = useState("All");
  const [selectedColor, setSelectedColor] = useState("All");
  const [selectedFabric, setSelectedFabric] = useState("All");

  const categoryOptions = useMemo(() => {
    return ["All", ...Array.from(new Set(products.map((p) => p.category).filter(Boolean)))];
  }, [products]);

  const sizeOptions = useMemo(() => {
    const sizes = products.flatMap((p) => p.sizes || []);
    return ["All", ...Array.from(new Set(sizes.filter(Boolean)))];
  }, [products]);

  const inferColor = (name: string) => {
    const n = name.toLowerCase();
    if (n.includes("black")) return "Black";
    if (n.includes("white")) return "White";
    if (n.includes("blue") || n.includes("navy")) return "Blue";
    if (n.includes("green") || n.includes("olive")) return "Green";
    if (n.includes("brown") || n.includes("mocha")) return "Brown";
    if (n.includes("gray") || n.includes("grey")) return "Gray";
    return "Mixed";
  };

  const inferFabric = (name: string, category: string) => {
    const n = `${name} ${category}`.toLowerCase();
    if (n.includes("denim") || n.includes("jeans")) return "Denim";
    if (n.includes("linen")) return "Linen";
    if (n.includes("cotton") || n.includes("panjabi") || n.includes("shirt")) return "Cotton";
    if (n.includes("poly")) return "Poly";
    return "Blend";
  };

  const colorOptions = useMemo(() => {
    return ["All", ...Array.from(new Set(products.map((p) => inferColor(p.name)).filter(Boolean)))];
  }, [products]);

  const fabricOptions = useMemo(() => {
    return ["All", ...Array.from(new Set(products.map((p) => inferFabric(p.name, p.category)).filter(Boolean)))];
  }, [products]);

  const sortedFiltered = useMemo(() => {
    let list = [...products];

    if (maxPrice !== null) {
      list = list.filter((p) => Number(p.price) <= maxPrice);
    }

    if (minStockOnly) {
      list = list.filter((p) => (p.stock_quantity ?? 20) > 0);
    }

    if (selectedCategory !== "All") {
      list = list.filter((p) => p.category === selectedCategory);
    }

    if (selectedSize !== "All") {
      list = list.filter((p) => (p.sizes || []).includes(selectedSize));
    }

    if (selectedColor !== "All") {
      list = list.filter((p) => inferColor(p.name) === selectedColor);
    }

    if (selectedFabric !== "All") {
      list = list.filter((p) => inferFabric(p.name, p.category) === selectedFabric);
    }

    list.sort((a, b) => {
      if (sortBy === "newest") {
        return new Date(b.created_at || 0).getTime() - new Date(a.created_at || 0).getTime();
      }
      if (sortBy === "price-low") return Number(a.price) - Number(b.price);
      if (sortBy === "price-high") return Number(b.price) - Number(a.price);
      if (sortBy === "discount-high") {
        const aDiscount = a.original_price && a.original_price > a.price
          ? ((a.original_price - a.price) / a.original_price) * 100
          : 0;
        const bDiscount = b.original_price && b.original_price > b.price
          ? ((b.original_price - b.price) / b.original_price) * 100
          : 0;
        return bDiscount - aDiscount;
      }

      // Popular fallback: featured first, then campaign-tagged.
      const aScore = (a.is_featured ? 2 : 0) + (a.campaign_badge ? 1 : 0);
      const bScore = (b.is_featured ? 2 : 0) + (b.campaign_badge ? 1 : 0);
      return bScore - aScore;
    });

    return list;
  }, [
    products,
    sortBy,
    maxPrice,
    minStockOnly,
    selectedCategory,
    selectedSize,
    selectedColor,
    selectedFabric,
  ]);

  const visible = sortedFiltered.slice(0, visibleCount);

  return (
    <div className="mt-6 space-y-4">
      <div className="flex flex-wrap items-center gap-2">
        <button
          type="button"
          onClick={() => setShowFilters((s) => !s)}
          className="rounded-full border border-slate-300 bg-white px-4 py-2 text-xs font-bold text-slate-700"
        >
          ⚙️ Filters {showFilters ? "▲" : "▼"}
        </button>

        <div className="flex flex-wrap items-center gap-2">
          {[
            { key: "popular", label: "Popular" },
            { key: "newest", label: "Newest" },
            { key: "price-low", label: "Price ↑" },
            { key: "price-high", label: "Price ↓" },
            { key: "discount-high", label: "Discount" },
          ].map((item) => (
            <button
              key={item.key}
              type="button"
              onClick={() => setSortBy(item.key as SortKey)}
              className={`rounded-full border px-3 py-1.5 text-xs font-semibold transition ${
                sortBy === item.key
                  ? "border-teal-600 bg-teal-50 text-teal-800"
                  : "border-slate-300 bg-white text-slate-600"
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        {maxPrice !== null && (
          <button
            type="button"
            onClick={() => setMaxPrice(null)}
            className="rounded-full border border-amber-300 bg-amber-50 px-3 py-1 text-[11px] font-semibold text-amber-800"
          >
            Price ≤ ৳{maxPrice} ✕
          </button>
        )}
        {minStockOnly && (
          <button
            type="button"
            onClick={() => setMinStockOnly(false)}
            className="rounded-full border border-emerald-300 bg-emerald-50 px-3 py-1 text-[11px] font-semibold text-emerald-800"
          >
            In stock only ✕
          </button>
        )}
        {selectedCategory !== "All" && (
          <button
            type="button"
            onClick={() => setSelectedCategory("All")}
            className="rounded-full border border-sky-300 bg-sky-50 px-3 py-1 text-[11px] font-semibold text-sky-800"
          >
            {selectedCategory} ✕
          </button>
        )}
        {selectedSize !== "All" && (
          <button
            type="button"
            onClick={() => setSelectedSize("All")}
            className="rounded-full border border-indigo-300 bg-indigo-50 px-3 py-1 text-[11px] font-semibold text-indigo-800"
          >
            Size {selectedSize} ✕
          </button>
        )}
        {selectedColor !== "All" && (
          <button
            type="button"
            onClick={() => setSelectedColor("All")}
            className="rounded-full border border-violet-300 bg-violet-50 px-3 py-1 text-[11px] font-semibold text-violet-800"
          >
            {selectedColor} ✕
          </button>
        )}
        {selectedFabric !== "All" && (
          <button
            type="button"
            onClick={() => setSelectedFabric("All")}
            className="rounded-full border border-rose-300 bg-rose-50 px-3 py-1 text-[11px] font-semibold text-rose-800"
          >
            {selectedFabric} ✕
          </button>
        )}
      </div>

      {showFilters && (
        <div className="fixed inset-0 z-50 flex items-end bg-black/40 md:static md:block md:bg-transparent">
          <div className="w-full rounded-t-3xl border border-slate-200 bg-white p-4 md:rounded-2xl">
            <div className="mb-3 flex items-center justify-between">
              <p className="text-xs font-bold uppercase tracking-wider text-slate-500">Quick Filters</p>
              <button
                type="button"
                onClick={() => setShowFilters(false)}
                className="rounded-full border border-slate-300 px-3 py-1 text-xs font-semibold text-slate-600"
              >
                Close
              </button>
            </div>

            <div className="mt-2 flex flex-wrap gap-2">
              {[null, 999, 1499, 1999, 2999].map((p, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setMaxPrice(p)}
                  className={`rounded-full border px-3 py-1.5 text-xs font-semibold ${
                    maxPrice === p
                      ? "border-amber-600 bg-amber-50 text-amber-800"
                      : "border-slate-300 bg-slate-50 text-slate-700"
                  }`}
                >
                  {p === null ? "All" : `≤ ৳${p}`}
                </button>
              ))}
            </div>

            <div className="mt-3">
              <button
                type="button"
                onClick={() => setMinStockOnly((v) => !v)}
                className={`rounded-full border px-3 py-1.5 text-xs font-semibold ${
                  minStockOnly
                    ? "border-emerald-600 bg-emerald-50 text-emerald-800"
                    : "border-slate-300 bg-slate-50 text-slate-700"
                }`}
              >
                ✅ In-stock only
              </button>
            </div>

            <div className="mt-3 grid gap-2 sm:grid-cols-2">
              <select
                aria-label="Category filter"
                title="Category filter"
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="rounded-xl border border-slate-300 px-3 py-2 text-sm"
              >
                {categoryOptions.map((c) => (
                  <option key={c} value={c}>
                    Category: {c}
                  </option>
                ))}
              </select>

              <select
                aria-label="Size filter"
                title="Size filter"
                value={selectedSize}
                onChange={(e) => setSelectedSize(e.target.value)}
                className="rounded-xl border border-slate-300 px-3 py-2 text-sm"
              >
                {sizeOptions.map((s) => (
                  <option key={s} value={s}>
                    Size: {s}
                  </option>
                ))}
              </select>

              <select
                aria-label="Color filter"
                title="Color filter"
                value={selectedColor}
                onChange={(e) => setSelectedColor(e.target.value)}
                className="rounded-xl border border-slate-300 px-3 py-2 text-sm"
              >
                {colorOptions.map((c) => (
                  <option key={c} value={c}>
                    Color: {c}
                  </option>
                ))}
              </select>

              <select
                aria-label="Fabric filter"
                title="Fabric filter"
                value={selectedFabric}
                onChange={(e) => setSelectedFabric(e.target.value)}
                className="rounded-xl border border-slate-300 px-3 py-2 text-sm"
              >
                {fabricOptions.map((f) => (
                  <option key={f} value={f}>
                    Fabric: {f}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      )}

      <div className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700">
        Results: {sortedFiltered.length} item(s)
      </div>

      {visible.length === 0 ? (
        <div className="surface-card p-10 text-center">
          <h3 className="text-lg font-bold text-slate-900">No product found</h3>
          <p className="mt-2 text-sm text-slate-500">Filter change করে আবার চেষ্টা করুন।</p>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {visible.map((product) => (
            <ProductCard key={product.id} product={product} whatsappNumber={whatsappNumber} />
          ))}
        </div>
      )}

      {visibleCount < sortedFiltered.length && (
        <div className="text-center">
          <button
            type="button"
            onClick={() => setVisibleCount((c) => c + 12)}
            className="rounded-full border border-slate-300 bg-white px-5 py-2.5 text-sm font-bold text-slate-700"
          >
            Load More
          </button>
        </div>
      )}
    </div>
  );
}
