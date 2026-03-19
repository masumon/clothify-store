"use client";

import Image from "next/image";
import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import AppIcon from "@/components/AppIcon";
import EditProductForm from "@/components/EditProductForm";
import DeleteProductButton from "@/components/DeleteProductButton";
import type { Product } from "@/types";

type Props = {
  products: Product[];
};

export default function AdminProductsManager({ products }: Props) {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [busy, setBusy] = useState(false);

  const categories = useMemo(() => {
    return ["All", ...Array.from(new Set(products.map((item) => item.category)))];
  }, [products]);

  const filtered = useMemo(() => {
    return products.filter((item) => {
      const matchesSearch = item.name.toLowerCase().includes(search.toLowerCase().trim());
      const matchesCategory = category === "All" || item.category === category;
      return matchesSearch && matchesCategory;
    });
  }, [products, search, category]);

  const allVisibleSelected = filtered.length > 0 && filtered.every((item) => selectedIds.includes(item.id));

  const toggleSelect = (id: string) => {
    setSelectedIds((prev) => (prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]));
  };

  const toggleSelectAllVisible = () => {
    if (allVisibleSelected) {
      const visibleSet = new Set(filtered.map((item) => item.id));
      setSelectedIds((prev) => prev.filter((id) => !visibleSet.has(id)));
      return;
    }

    setSelectedIds((prev) => Array.from(new Set([...prev, ...filtered.map((item) => item.id)])));
  };

  const runBulkDelete = async () => {
    if (selectedIds.length === 0) {
      alert("Please select products first");
      return;
    }

    if (!window.confirm(`Delete ${selectedIds.length} selected products?`)) {
      return;
    }

    try {
      setBusy(true);
      const results = await Promise.all(
        selectedIds.map((id) =>
          fetch(`/api/admin/products/${id}`, {
            method: "DELETE",
          })
        )
      );

      const failed = results.filter((response) => !response.ok).length;
      if (failed > 0) {
        alert(`Bulk delete partially completed. Failed: ${failed}, Success: ${results.length - failed}`);
      } else {
        alert("Bulk delete completed");
      }
      setSelectedIds([]);
      router.refresh();
    } catch {
      alert("Bulk delete failed");
    } finally {
      setBusy(false);
    }
  };

  const runBulkPublishState = async (isPublished: boolean) => {
    if (selectedIds.length === 0) {
      alert("Please select products first");
      return;
    }

    try {
      setBusy(true);
      const response = await fetch("/api/admin/products", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ids: selectedIds,
          is_published: isPublished,
        }),
      });

      const result = await response.json();
      if (!response.ok) {
        throw new Error(result.error || "Bulk update failed");
      }

      alert(isPublished ? "Selected products published" : "Selected products moved to draft");
      router.refresh();
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "Bulk update failed";
      alert(message);
    } finally {
      setBusy(false);
    }
  };

  const togglePublish = async (id: string, nextValue: boolean) => {
    try {
      setBusy(true);
      const response = await fetch("/api/admin/products", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id, is_published: nextValue }),
      });

      const result = await response.json();
      if (!response.ok) {
        throw new Error(result.error || "Failed to update product visibility");
      }

      router.refresh();
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "Failed to update product visibility";
      alert(message);
    } finally {
      setBusy(false);
    }
  };

  return (
    <div>
      <div className="mb-5 rounded-[24px] border border-slate-200/80 bg-white/95 p-4 shadow-[0_16px_34px_-28px_rgba(2,6,23,0.45)]">
        <div className="grid gap-3 lg:grid-cols-[1fr_240px]">
          <label className="relative block">
            <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
              <AppIcon name="search" className="h-4.5 w-4.5" />
            </span>
            <input
              type="text"
              placeholder="Search product by name"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-2xl border border-slate-300 py-3 pl-11 pr-4 outline-none transition focus:border-teal-400 focus:ring-2 focus:ring-teal-100"
            />
          </label>

          <select
            aria-label="Filter by category"
            title="Filter by category"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full rounded-2xl border border-slate-300 px-4 py-3 outline-none transition focus:border-teal-400 focus:ring-2 focus:ring-teal-100"
          >
            {categories.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
        </div>

        <div className="mt-3 flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={toggleSelectAllVisible}
            className="inline-flex items-center gap-2 rounded-full border border-slate-300 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700"
          >
            <AppIcon name={allVisibleSelected ? "close" : "packageOpen"} className="h-4 w-4" />
            {allVisibleSelected ? "Unselect Visible" : "Select Visible"}
          </button>

          <button
            type="button"
            disabled={busy}
            onClick={() => runBulkPublishState(true)}
            className="inline-flex items-center gap-2 rounded-full bg-teal-700 px-3 py-1.5 text-xs font-semibold text-white disabled:opacity-60"
          >
            <AppIcon name="external" className="h-4 w-4" />
            Bulk Publish
          </button>

          <button
            type="button"
            disabled={busy}
            onClick={() => runBulkPublishState(false)}
            className="inline-flex items-center gap-2 rounded-full bg-amber-600 px-3 py-1.5 text-xs font-semibold text-white disabled:opacity-60"
          >
            <AppIcon name="settings" className="h-4 w-4" />
            Bulk Draft
          </button>

          <button
            type="button"
            disabled={busy}
            onClick={runBulkDelete}
            className="inline-flex items-center gap-2 rounded-full bg-rose-600 px-3 py-1.5 text-xs font-semibold text-white disabled:opacity-60"
          >
            <AppIcon name="close" className="h-4 w-4" />
            Bulk Delete
          </button>

          <p className="ml-0 w-full text-xs font-semibold text-slate-500 sm:ml-auto sm:w-auto">
            Selected: {selectedIds.length} | Showing: {filtered.length}
          </p>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {filtered.length === 0 ? (
          <div className="rounded-[24px] border border-slate-200 bg-white p-6">
            <p className="text-slate-600">No products match your filters.</p>
          </div>
        ) : (
          filtered.map((product) => {
            const isPublished = product.is_published !== false;

            return (
              <div
                key={product.id}
                className="rounded-[24px] border border-slate-200/80 bg-white/95 p-4 shadow-[0_16px_34px_-28px_rgba(2,6,23,0.45)]"
              >
                <div className="mb-3 flex items-center justify-between gap-2">
                  <label className="inline-flex items-center gap-2 text-xs font-semibold text-slate-600">
                    <input
                      type="checkbox"
                      checked={selectedIds.includes(product.id)}
                      onChange={() => toggleSelect(product.id)}
                    />
                    Select
                  </label>
                  <span
                    className={`rounded-full px-2 py-1 text-xs font-bold ${
                      isPublished ? "bg-emerald-100 text-emerald-700" : "bg-amber-100 text-amber-700"
                    }`}
                  >
                    {isPublished ? "Published" : "Draft"}
                  </span>
                </div>

                <Image
                  src={product.image_url || "/hero-modern-fashion.svg"}
                  alt={product.name}
                  width={400}
                  height={256}
                  className="h-64 w-full rounded-[20px] object-cover"
                />

                <h3 className="mt-4 font-bold text-slate-900">{product.name}</h3>
                <p className="mt-1 text-sm text-slate-500">{product.category}</p>
                <p className="mt-1 font-semibold text-teal-700">৳{product.price}</p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {product.is_featured ? (
                    <span className="rounded-full bg-slate-900 px-2 py-1 text-[11px] font-bold text-white">Featured</span>
                  ) : null}
                  {product.campaign_badge ? (
                    <span className="rounded-full bg-rose-100 px-2 py-1 text-[11px] font-bold text-rose-700">
                      {product.campaign_badge}
                    </span>
                  ) : null}
                  {(product.stock_quantity ?? 20) <= 5 ? (
                    <span className="rounded-full bg-amber-100 px-2 py-1 text-[11px] font-bold text-amber-700">
                      Low Stock: {product.stock_quantity ?? 20}
                    </span>
                  ) : (
                    <span className="rounded-full bg-emerald-100 px-2 py-1 text-[11px] font-bold text-emerald-700">
                      Stock: {product.stock_quantity ?? 20}
                    </span>
                  )}
                </div>
                <p className="mt-2 text-sm text-slate-600">Sizes: {product.sizes?.length ? product.sizes.join(", ") : "N/A"}</p>

                <button
                  type="button"
                  disabled={busy}
                  onClick={() => togglePublish(product.id, !isPublished)}
                  className={`mt-4 inline-flex w-full items-center justify-center gap-2 rounded-2xl px-4 py-2.5 text-sm font-semibold text-white transition disabled:opacity-60 ${
                    isPublished ? "bg-amber-600 hover:bg-amber-700" : "bg-teal-700 hover:bg-teal-800"
                  }`}
                >
                  <AppIcon name={isPublished ? "settings" : "external"} className="h-4 w-4" />
                  {isPublished ? "Move to Draft" : "Publish Product"}
                </button>

                <EditProductForm product={product} />
                <DeleteProductButton productId={product.id} />
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
