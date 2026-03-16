"use client";

import NextImage from "next/image";
import { ChangeEvent, FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

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
  const [sizes, setSizes] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [statusText, setStatusText] = useState(
    "Choose image and wait for upload success message"
  );

  const resetForm = () => {
    setName("");
    setPrice("");
    setCategory("");
    setSizes("");
    setImageUrl("");
    setStatusText("Choose image and wait for upload success message");
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

      const sizesArray = sizes
        .split(",")
        .map((item) => item.trim())
        .filter(Boolean);

      const response = await fetch("/api/admin/products", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: name.trim(),
          price: Number(price),
          category: category.trim(),
          sizes: sizesArray,
          image_url: imageUrl,
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
      className="mb-8 space-y-4 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
    >
      <h2 className="text-xl font-bold text-slate-900">Add New Product</h2>

      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <label className="mb-2 block text-sm font-semibold text-slate-700">
            Product Name
          </label>
          <input
            type="text"
            placeholder="Enter product name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none"
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-semibold text-slate-700">
            Price
          </label>
          <input
            type="number"
            placeholder="Enter product price"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            className="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none"
          />
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <label className="mb-2 block text-sm font-semibold text-slate-700">
            Category
          </label>
          <input
            type="text"
            placeholder="Enter category"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none"
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-semibold text-slate-700">
            Sizes
          </label>
          <input
            type="text"
            placeholder="M,L,XL"
            value={sizes}
            onChange={(e) => setSizes(e.target.value)}
            className="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none"
          />
        </div>
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
          className="w-full text-sm"
        />
        <p className="mt-2 text-xs text-slate-500">{statusText}</p>
      </div>

      {imageUrl ? (
        <NextImage
          src={imageUrl}
          alt="Preview"
          width={160}
          height={160}
          className="h-40 w-40 rounded-xl border object-cover"
        />
      ) : null}

      <button
        type="submit"
        disabled={saving || uploading}
        className="w-full rounded-lg bg-black px-5 py-3 font-medium text-white disabled:opacity-60"
      >
        {uploading
          ? "Uploading image..."
          : saving
          ? "Saving..."
          : "Add Product"}
      </button>
    </form>
  );
}
