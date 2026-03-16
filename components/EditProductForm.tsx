"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

type Props = {
  product: {
    id: string;
    name: string;
    price: number;
    category: string;
    sizes: string[];
    image_url: string;
    stock_quantity?: number;
    is_featured?: boolean;
    campaign_badge?: string | null;
  };
};

export default function EditProductForm({ product }: Props) {
  const router = useRouter();
  const [name, setName] = useState(product.name);
  const [price, setPrice] = useState(String(product.price));
  const [category, setCategory] = useState(product.category);
  const [sizes, setSizes] = useState(product.sizes?.join(", ") || "");
  const [stockQuantity, setStockQuantity] = useState(String(product.stock_quantity ?? 20));
  const [isFeatured, setIsFeatured] = useState(product.is_featured === true);
  const [campaignBadge, setCampaignBadge] = useState(product.campaign_badge || "");
  const [saving, setSaving] = useState(false);
  const [open, setOpen] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    try {
      setSaving(true);

      const sizesArray = sizes
        .split(",")
        .map((item) => item.trim())
        .filter(Boolean);

      const response = await fetch("/api/admin/products", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: product.id,
          name,
          price: Number(price),
          category,
          sizes: sizesArray,
          stock_quantity: Number(stockQuantity),
          is_featured: isFeatured,
          campaign_badge: campaignBadge,
        }),
      });

      const result = await response.json();
      if (!response.ok) {
        throw new Error(result.error || "Failed to update product");
      }

      alert("Product updated successfully");
      setOpen(false);
      router.refresh();
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "Failed to update product";
      alert(message);
    } finally {
      setSaving(false);
    }
  };

  if (!open) {
    return (
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="mt-3 w-full rounded-xl border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-100"
      >
        Edit Product
      </button>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="mt-4 space-y-3 rounded-xl border border-slate-200 bg-slate-50 p-4"
    >
      <input
        type="text"
        title="Product Name"
        aria-label="Product Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="w-full rounded-lg border border-slate-300 px-3 py-2 outline-none transition focus:border-teal-400 focus:ring-2 focus:ring-teal-100"
      />

      <input
        type="number"
        title="Product Price"
        aria-label="Product Price"
        value={price}
        onChange={(e) => setPrice(e.target.value)}
        className="w-full rounded-lg border border-slate-300 px-3 py-2 outline-none transition focus:border-teal-400 focus:ring-2 focus:ring-teal-100"
      />

      <input
        type="text"
        title="Product Category"
        aria-label="Product Category"
        value={category}
        onChange={(e) => setCategory(e.target.value)}
        className="w-full rounded-lg border border-slate-300 px-3 py-2 outline-none transition focus:border-teal-400 focus:ring-2 focus:ring-teal-100"
      />

      <input
        type="text"
        title="Product Sizes"
        aria-label="Product Sizes"
        value={sizes}
        onChange={(e) => setSizes(e.target.value)}
        className="w-full rounded-lg border border-slate-300 px-3 py-2 outline-none transition focus:border-teal-400 focus:ring-2 focus:ring-teal-100"
      />

      <input
        type="number"
        title="Stock Quantity"
        aria-label="Stock Quantity"
        value={stockQuantity}
        onChange={(e) => setStockQuantity(e.target.value)}
        className="w-full rounded-lg border border-slate-300 px-3 py-2 outline-none transition focus:border-teal-400 focus:ring-2 focus:ring-teal-100"
      />

      <input
        type="text"
        title="Campaign Badge"
        aria-label="Campaign Badge"
        value={campaignBadge}
        onChange={(e) => setCampaignBadge(e.target.value)}
        className="w-full rounded-lg border border-slate-300 px-3 py-2 outline-none transition focus:border-teal-400 focus:ring-2 focus:ring-teal-100"
      />

      <label className="flex items-center gap-2 text-sm font-semibold text-slate-700">
        <input
          type="checkbox"
          checked={isFeatured}
          onChange={(e) => setIsFeatured(e.target.checked)}
        />
        Featured Product
      </label>

      <div className="grid grid-cols-2 gap-2">
        <button
          type="submit"
          disabled={saving}
          className="rounded-lg bg-teal-700 px-4 py-2 text-sm font-semibold text-white transition hover:bg-teal-800 disabled:opacity-60"
        >
          {saving ? "Saving..." : "Save"}
        </button>

        <button
          type="button"
          onClick={() => setOpen(false)}
          className="rounded-lg bg-slate-300 px-4 py-2 text-sm font-semibold text-slate-800"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
