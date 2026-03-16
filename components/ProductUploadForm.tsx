"use client";

import { ChangeEvent, FormEvent, useState } from "react";
import { supabase } from "@/lib/supabase";

async function resizeImageToSquare(file: File, size = 1200): Promise<File> {
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
    const sourceRatio = sourceWidth / sourceHeight;
    const targetRatio = 1;

    let sx = 0;
    let sy = 0;
    let sWidth = sourceWidth;
    let sHeight = sourceHeight;

    if (sourceRatio > targetRatio) {
      sWidth = sourceHeight;
      sx = (sourceWidth - sWidth) / 2;
    } else if (sourceRatio < targetRatio) {
      sHeight = sourceWidth;
      sy = (sourceHeight - sHeight) / 2;
    }

    ctx.drawImage(img, sx, sy, sWidth, sHeight, 0, 0, size, size);

    const blob = await new Promise<Blob>((resolve, reject) => {
      canvas.toBlob(
        (result) => {
          if (result) resolve(result);
          else reject(new Error("Image resize failed"));
        },
        "image/jpeg",
        0.9
      );
    });

    const newFileName = file.name.replace(/\.[^/.]+$/, "") + "-square.jpg";

    return new File([blob], newFileName, {
      type: "image/jpeg",
      lastModified: Date.now(),
    });
  } finally {
    URL.revokeObjectURL(imageUrl);
  }
}

export default function ProductUploadForm() {
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("");
  const [sizes, setSizes] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);

  const handleImageUpload = async (e: ChangeEvent<HTMLInputElement>) => {
    const originalFile = e.target.files?.[0];
    if (!originalFile) return;

    try {
      setUploading(true);
      setImageUrl("");

      const resizedFile = await resizeImageToSquare(originalFile, 1200);
      const cleanName = resizedFile.name.replace(/\s+/g, "-");
      const filePath = `products/${Date.now()}-${cleanName}`;

      const { error: uploadError } = await supabase.storage
        .from("product-images")
        .upload(filePath, resizedFile, { upsert: true });

      if (uploadError) throw uploadError;

      const { data } = supabase.storage
        .from("product-images")
        .getPublicUrl(filePath);

      setImageUrl(data.publicUrl);
      alert("Product image uploaded successfully");
    } catch (error: any) {
      alert(error.message || "Image upload failed");
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

      const { error } = await supabase.from("products").insert([
        {
          name: name.trim(),
          price: Number(price),
          category: category.trim(),
          sizes: sizesArray,
          image_url: imageUrl,
        },
      ]);

      if (error) throw error;

      alert("Product added successfully");
      window.location.reload();
    } catch (error: any) {
      alert(error.message || "Failed to add product");
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
        <input
          type="text"
          placeholder="Product Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none"
        />
        <input
          type="number"
          placeholder="Price"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          className="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none"
        />
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <input
          type="text"
          placeholder="Category"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none"
        />
        <input
          type="text"
          placeholder="Sizes comma separated (M,L,XL)"
          value={sizes}
          onChange={(e) => setSizes(e.target.value)}
          className="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none"
        />
      </div>

      <div>
        <label className="mb-2 block text-sm font-semibold text-slate-700">
          Product Image
        </label>
        <input
          type="file"
          accept="image/*"
          onChange={handleImageUpload}
          className="w-full text-sm"
        />
        <p className="mt-2 text-xs text-slate-500">
          {uploading
            ? "Uploading and resizing image... please wait"
            : imageUrl
            ? "Image uploaded successfully"
            : "Choose image and wait for upload success message"}
        </p>
      </div>

      {imageUrl ? (
        <img
          src={imageUrl}
          alt="Preview"
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
