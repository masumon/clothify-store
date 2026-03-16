"use client";

import { useState } from "react";
import { addToCart } from "@/lib/cart";

type Props = {
  product: {
    id: string;
    name: string;
    price: number;
    image_url: string;
    sizes?: string[];
  };
};

export default function AddToCartButton({ product }: Props) {
  const [selectedSize, setSelectedSize] = useState(
    product.sizes?.[0] || "Standard"
  );
  const [toast, setToast] = useState("");

  const handleAdd = () => {
    addToCart({
      id: product.id,
      name: product.name,
      price: Number(product.price),
      image_url: product.image_url,
      selectedSize,
      quantity: 1,
    });

    setToast("✅ Product added to cart");
    window.setTimeout(() => setToast(""), 1800);
  };

  return (
    <div className="mt-6">
      <div className="mb-4">
        <p className="mb-2 text-sm font-semibold text-slate-700">Select Size</p>
        <div className="flex flex-wrap gap-2">
          {(product.sizes?.length ? product.sizes : ["Standard"]).map((size) => (
            <button
              key={size}
              type="button"
              onClick={() => setSelectedSize(size)}
              className={`rounded-full border px-4 py-2 text-sm ${
                selectedSize === size
                  ? "border-black bg-black text-white"
                  : "border-slate-300 text-slate-700"
              }`}
            >
              {size}
            </button>
          ))}
        </div>
      </div>

      <button
        type="button"
        onClick={handleAdd}
        className="rounded-lg bg-black px-5 py-3 text-sm font-medium text-white"
      >
        Add to Cart
      </button>

      {toast ? (
        <p className="mt-3 text-sm font-semibold text-emerald-700">{toast}</p>
      ) : null}
    </div>
  );
}
