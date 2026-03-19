"use client";

import NextImage from "next/image";
import { ChangeEvent, FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

const categoryPresets = ["Panjabi", "Shirt", "Polo", "T-Shirt", "Sharee", "Kids"];
const commonSizes = ["XS", "S", "M", "L", "XL", "XXL", "Free Size"];

async function resizeImageToSquare(file: File, size = 1000): Promise<File> {
  const imageUrl = URL.createObjectURL(file);

  try {
    const img = await new Promise<HTMLImageElement>((resolve, reject) => {
      const image = new Image();
      image.onload = () => resolve(image);
      image.onerror = () => reject(new Error("Image load failed"));
      image.src = imageUrl;
    });

    const canvas = document.createElement("canvas");
    canvas.width = size;
    canvas.height = size;

    const ctx = canvas.getContext("2d");
    if (!ctx) {
      throw new Error("Canvas context not available");
    }

    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, size, size);

    const sourceWidth = img.width;
    const sourceHeight = img.height;

    let sx = 0;
    let sy = 0;
    let sWidth = sourceWidth;
    let sHeight = sourceHeight;

    if (sourceWidth > sourceHeight) {
      sWidth = sourceHeight;
      sx = (sourceWidth - sourceHeight) / 2;
    } else if (sourceHeight > sourceWidth) {
      sHeight = sourceWidth;
      sy = (sourceHeight - sourceWidth) / 2;
    }

    ctx.drawImage(img, sx, sy, sWidth, sHeight, 0, 0, size, size);

    const blob = await new Promise<Blob>((resolve, reject) => {
      canvas.toBlob(
        (result) => {
          if (result) resolve(result);
          else reject(new Error("Image resize failed"));
        },
        "image/jpeg",
        0.82
      );
    });

    const fileName =
      file.name.replace(/\.[^/.]+$/, "").replace(/\s+/g, "-") + "-optimized.jpg";

    return new File([blob], fileName, {
      type: "image/jpeg",
      lastModified: Date.now(),
    });
  } finally {
    URL.revokeObjectURL(imageUrl);
  }
}

export default function ProductUploadForm() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("");
  const [sizesText, setSizesText] = useState("");
  const [selectedSizes, setSelectedSizes] = useState<string[]>([]);
  const [imageUrl, setImageUrl] = useState("");
  const [stockQuantity, setStockQuantity] = useState("20");
  const [isFeatured, setIsFeatured] = useState(false);
  const [campaignBadge, setCampaignBadge] = useState("");
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [statusText, setStatusText] = useState(
    "Choose image and wait for upload success message"
  );

  const mergedSizes = Array.from(
    new Set([
      ...selectedSizes,
      ...sizesText
        .split(",")
        .map((item) => item.trim())
        .filter(Boolean),
    ])
  );

  const checklist = {
    name: name.trim().length >= 3,
    price: Number(price) > 0,
    category: category.trim().length >= 2,
    sizes: mergedSizes.length > 0,
    image: Boolean(imageUrl.trim()),
    stock: Number(stockQuantity) >= 0,
  };

  const resetForm = () => {
    setName("");
    setPrice("");
    setCategory("");
    setSizesText("");
    setSelectedSizes([]);
    setImageUrl("");
    setStockQuantity("20");
    setIsFeatured(false);
    setCampaignBadge("");
    setStatusText("Choose image and wait for upload success message");
  };

  const toggleSize = (size: string) => {
    setSelectedSizes((prev) =>
      prev.includes(size) ? prev.filter((item) => item !== size) : [...prev, size]
    );
  };

  const handleImageUpload = async (e: ChangeEvent<HTMLInputElement>) => {
    const originalFile = e.target.files?.[0];
    if (!originalFile) return;

    try {
      setUploading(true);
      setImageUrl("");
      setStatusText("Optimizing image... please wait");

      const resizedFile = await resizeImageToSquare(originalFile, 1000);

      setStatusText("Uploading optimized image... please wait");

      const formData = new FormData();
      formData.append("file", resizedFile);
      formData.append("bucket", "product-images");
      formData.append("folder", "products");

      const response = await fetch("/api/admin/upload", {
        method: "POST",
        body: formData,
      });

      const result = await response.json();
      if (!response.ok) {
        throw new Error(result.error || "Image upload failed");
      }

      setImageUrl(result.url || "");
      setStatusText("Image uploaded successfully");
      alert("Product image uploaded successfully");
    } catch (error: unknown) {
      setStatusText("Image upload failed");
      const message = error instanceof Error ? error.message : "Image upload failed";
      alert(message);
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!name.trim()) {
      alert("Product name is required");
      return;
    }

    if (!price.trim()) {
      alert("Price is required");
      return;
    }

    if (!category.trim()) {
      alert("Category is required");
      return;
    }

    if (uploading) {
      alert("Please wait until image upload is complete");
      return;
    }

    if (!imageUrl.trim()) {
      alert("Please upload a product image first");
      return;
    }

    try {
      setSaving(true);

      const response = await fetch("/api/admin/products", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: name.trim(),
          price: Number(price),
          category: category.trim(),
          sizes: mergedSizes,
          image_url: imageUrl,
          stock_quantity: Number(stockQuantity),
          is_featured: isFeatured,
          campaign_badge: campaignBadge.trim(),
        }),
      });

      const result = await response.json();
      if (!response.ok) {
        throw new Error(result.error || "Failed to add product");
      }

      alert("Product added successfully");
      resetForm();
      router.refresh();
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "Failed to add product";
      alert(message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="mb-8 grid gap-6 rounded-2xl border border-slate-200/80 bg-white/95 p-6 shadow-[0_10px_30px_-22px_rgba(2,6,23,0.65)] lg:grid-cols-[1fr_320px]"
    >
      <div className="space-y-4">
        <h2 className="text-xl font-bold text-slate-900">Add New Product</h2>

        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <label className="mb-2 block text-sm font-semibold text-slate-700">
              Product Name
            </label>
            <input
              type="text"
              placeholder="e.g. Premium Cotton Panjabi"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none transition focus:border-teal-400 focus:ring-2 focus:ring-teal-100"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-semibold text-slate-700">Price</label>
            <input
              type="number"
              placeholder="e.g. 1450"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none transition focus:border-teal-400 focus:ring-2 focus:ring-teal-100"
            />
          </div>
        </div>

        <div>
          <label className="mb-2 block text-sm font-semibold text-slate-700">Category</label>
          <input
            type="text"
            placeholder="Select preset or type custom category"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none transition focus:border-teal-400 focus:ring-2 focus:ring-teal-100"
          />
          <div className="mt-2 flex flex-wrap gap-2">
            {categoryPresets.map((item) => (
              <button
                key={item}
                type="button"
                onClick={() => setCategory(item)}
                className={`rounded-full border px-3 py-1 text-xs font-semibold transition ${
                  category.toLowerCase() === item.toLowerCase()
                    ? "border-teal-700 bg-teal-700 text-white"
                    : "border-slate-300 bg-white text-slate-700 hover:bg-slate-100"
                }`}
              >
                {item}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="mb-2 block text-sm font-semibold text-slate-700">
            Sizes
          </label>
          <div className="flex flex-wrap gap-2">
            {commonSizes.map((size) => (
              <button
                key={size}
                type="button"
                onClick={() => toggleSize(size)}
                className={`rounded-full border px-3 py-1 text-xs font-semibold transition ${
                  selectedSizes.includes(size)
                    ? "border-cyan-700 bg-cyan-700 text-white"
                    : "border-slate-300 bg-white text-slate-700 hover:bg-slate-100"
                }`}
              >
                {size}
              </button>
            ))}
          </div>

          <input
            type="text"
            placeholder="Custom sizes (comma separated), e.g. 36, 38"
            value={sizesText}
            onChange={(e) => setSizesText(e.target.value)}
            className="mt-3 w-full rounded-xl border border-slate-300 px-4 py-3 outline-none transition focus:border-teal-400 focus:ring-2 focus:ring-teal-100"
          />
          <p className="mt-2 text-xs text-slate-500">
            Selected sizes: {mergedSizes.length ? mergedSizes.join(", ") : "None"}
          </p>
        </div>

        <div>
          <label className="mb-2 block text-sm font-semibold text-slate-700">
            Product Image
          </label>
          <input
            type="file"
            title="Product Image"
            aria-label="Product Image"
            accept="image/*"
            onChange={handleImageUpload}
            className="w-full rounded-xl border border-slate-300 bg-white px-3 py-3 text-sm"
          />
          <p className="mt-2 text-xs text-slate-500">{statusText}</p>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          <div>
            <label className="mb-2 block text-sm font-semibold text-slate-700">Stock Quantity</label>
            <input
              type="number"
              min="0"
              title="Stock Quantity"
              aria-label="Stock Quantity"
              placeholder="20"
              value={stockQuantity}
              onChange={(e) => setStockQuantity(e.target.value)}
              className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none transition focus:border-teal-400 focus:ring-2 focus:ring-teal-100"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-semibold text-slate-700">Campaign Badge</label>
            <input
              type="text"
              placeholder="e.g. Eid Sale"
              value={campaignBadge}
              onChange={(e) => setCampaignBadge(e.target.value)}
              className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none transition focus:border-teal-400 focus:ring-2 focus:ring-teal-100"
            />
          </div>

          <label className="flex items-center gap-3 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-700">
            <input
              type="checkbox"
              title="Mark product as featured"
              aria-label="Mark product as featured"
              checked={isFeatured}
              onChange={(e) => setIsFeatured(e.target.checked)}
            />
            Mark as Featured
          </label>
        </div>

        <button
          type="submit"
          disabled={saving || uploading}
          className="w-full rounded-xl bg-teal-700 px-5 py-3 font-semibold text-white transition hover:bg-teal-800 disabled:opacity-60"
        >
          {uploading ? "Uploading image..." : saving ? "Saving..." : "Add Product"}
        </button>
      </div>

      <aside className="space-y-4 rounded-2xl border border-slate-200 bg-slate-50/80 p-4">
        <h3 className="text-lg font-bold text-slate-900">Setup Checklist</h3>
        <ul className="space-y-2 text-sm text-slate-700">
          <li>{checklist.name ? "Ready" : "Pending"} - Product name is clear</li>
          <li>{checklist.price ? "Ready" : "Pending"} - Price is valid</li>
          <li>{checklist.category ? "Ready" : "Pending"} - Category selected</li>
          <li>{checklist.sizes ? "Ready" : "Pending"} - Size added</li>
          <li>{checklist.image ? "Ready" : "Pending"} - Image uploaded</li>
          <li>{checklist.stock ? "Ready" : "Pending"} - Stock is valid</li>
        </ul>

        <div className="rounded-xl border border-slate-200 bg-white p-3">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
            Live Preview
          </p>

          {imageUrl ? (
            <NextImage
              src={imageUrl}
              alt="Preview"
              width={280}
              height={280}
              className="mt-3 h-44 w-full rounded-xl border object-cover"
            />
          ) : (
            <div className="mt-3 flex h-44 items-center justify-center rounded-xl border border-dashed border-slate-300 bg-slate-50 text-sm text-slate-400">
              Image preview will appear here
            </div>
          )}

          <p className="mt-3 text-sm font-bold text-slate-900">{name || "Product name"}</p>
          <p className="mt-1 text-sm text-slate-500">{category || "Category"}</p>
          <p className="mt-1 font-semibold text-teal-700">৳{price || "0"}</p>
          <p className="mt-1 text-xs text-slate-500">Stock: {stockQuantity || "0"}</p>
          <p className="mt-1 text-xs text-slate-500">
            {isFeatured ? "Featured product" : "Regular product"}
            {campaignBadge.trim() ? ` | Badge: ${campaignBadge.trim()}` : ""}
          </p>
          <p className="mt-1 text-xs text-slate-500">
            Sizes: {mergedSizes.length ? mergedSizes.join(", ") : "Not set"}
          </p>
        </div>
      </aside>
    </form>
  );
}
