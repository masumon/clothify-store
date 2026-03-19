"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { addToCart } from "@/lib/cart";
import { toggleWishlist, isInWishlist } from "@/lib/wishlist";
import { formatPrice, getSavedCurrency, type Currency } from "@/lib/currency";
import AppIcon from "@/components/AppIcon";

type QuickViewProduct = {
  id: string;
  name: string;
  price: number;
  original_price?: number;
  category: string;
  sizes: string[];
  image_url: string;
  stock_quantity?: number;
  is_featured?: boolean;
  campaign_badge?: string | null;
  has_video?: boolean;
};

type Props = {
  product: QuickViewProduct;
  whatsappNumber?: string;
  onClose: () => void;
};

const FIT_GUIDE: Record<string, string> = {
  S: "Chest 36–38\"",
  M: "Chest 38–40\"",
  L: "Chest 40–42\"",
  XL: "Chest 42–44\"",
  XXL: "Chest 44–46\"",
  "3XL": "Chest 46–48\"",
  "32": "Waist 32\"",
  "34": "Waist 34\"",
  "36": "Waist 36\"",
  "38": "Waist 38\"",
};

export default function QuickViewModal({
  product,
  whatsappNumber = "8801811314262",
  onClose,
}: Props) {
  const availableSizes = product.sizes.length > 0 ? product.sizes : ["S", "M", "L", "XL"];
  const [selectedSize, setSelectedSize] = useState(availableSizes[0] || "M");
  const [wishlisted, setWishlisted] = useState(false);
  const [currency, setCurrency] = useState<Currency>("BDT");
  const [added, setAdded] = useState(false);
  const [imageSrc, setImageSrc] = useState(product.image_url || "/hero-modern-fashion.svg");

  useEffect(() => {
    setWishlisted(isInWishlist(product.id));
    setCurrency(getSavedCurrency());
    const onPrefs = () => setCurrency(getSavedCurrency());
    window.addEventListener("clothfy-preferences-change", onPrefs);
    return () => window.removeEventListener("clothfy-preferences-change", onPrefs);
  }, [product.id]);

  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, []);

  useEffect(() => {
    setSelectedSize(product.sizes[0] || "S");
  }, [product.id, product.sizes]);

  useEffect(() => {
    setImageSrc(product.image_url || "/hero-modern-fashion.svg");
  }, [product.id, product.image_url]);

  const discount =
    product.original_price && product.original_price > product.price
      ? Math.round(((product.original_price - product.price) / product.original_price) * 100)
      : 0;

  const isOutOfStock = (product.stock_quantity ?? 1) <= 0;
  const isLowStock = !isOutOfStock && (product.stock_quantity ?? 20) <= 5;

  const handleAddToCart = () => {
    addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      image_url: product.image_url,
      selectedSize,
      quantity: 1,
    });
    setAdded(true);
    setTimeout(() => setAdded(false), 2200);
  };

  const handleToggleWishlist = () => {
    const result = toggleWishlist({
      id: product.id,
      name: product.name,
      price: product.price,
      image_url: product.image_url,
      category: product.category,
    });
    setWishlisted(result);
  };

  const waLink = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(
    `Hello, I want to order:\n\nProduct: ${product.name}\nSize: ${selectedSize}\nPrice: ৳${product.price}`
  )}`;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={`Quick view: ${product.name}`}
      className="fixed inset-0 z-[200] flex items-center justify-center bg-black/70 p-3 backdrop-blur-sm sm:p-4"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="relative max-h-[92vh] w-full max-w-3xl overflow-auto rounded-3xl border border-slate-200/80 bg-white shadow-2xl shadow-slate-900/30">
        {/* Close */}
        <button
          type="button"
          onClick={onClose}
          aria-label="Close quick view"
          className="absolute right-4 top-4 z-10 inline-flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 bg-white/95 text-sm font-bold text-slate-600 shadow-sm transition hover:bg-slate-100"
        >
          <AppIcon name="close" className="h-4.5 w-4.5" />
        </button>

        <div className="grid md:grid-cols-2">
          {/* ── Image pane ── */}
          <div className="relative min-h-[260px] overflow-hidden rounded-t-3xl md:rounded-l-3xl md:rounded-tr-none">
            <Image
              src={imageSrc}
              alt={product.name}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 50vw"
              onError={() => setImageSrc("/hero-modern-fashion.svg")}
            />

            {/* Overlay badges */}
            <div className="absolute left-3 top-3 flex flex-col gap-1.5">
              {product.is_featured && (
                <span className="rounded-full bg-slate-900/90 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-white backdrop-blur">
                  Featured
                </span>
              )}
              {product.campaign_badge && (
                <span className="rounded-full bg-rose-600/90 px-2.5 py-1 text-[10px] font-bold text-white backdrop-blur">
                  {product.campaign_badge}
                </span>
              )}
              {discount > 0 && (
                <span className="rounded-full bg-amber-500 px-2.5 py-1 text-[10px] font-extrabold text-white">
                  -{discount}% OFF
                </span>
              )}
            </div>

            {product.has_video && (
              <div className="absolute bottom-3 left-3 flex items-center gap-1.5 rounded-full bg-black/65 px-2.5 py-1 text-xs font-bold text-white backdrop-blur">
                <span className="inline-block h-2 w-2 animate-pulse rounded-full bg-red-500" />
                Reel Available
              </div>
            )}
          </div>

          {/* ── Details pane ── */}
          <div className="flex flex-col gap-4 p-6">
            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-teal-700">
                {product.category}
              </p>
              <h2 className="mt-1.5 text-xl font-extrabold leading-tight text-slate-900">
                {product.name}
              </h2>
              <p className="mt-1 text-xs font-semibold text-amber-500">
                ★★★★☆ <span className="text-slate-500">(4.9 premium rating)</span>
              </p>
              <p className="mt-2 text-sm text-slate-600">
                Crafted for modern menswear styling with premium finish, durable comfort, and elegant fit.
              </p>
            </div>

            {/* Pricing */}
            <div className="flex flex-wrap items-center gap-2.5">
              <span className="text-2xl font-extrabold text-teal-700">
                {formatPrice(product.price, currency)}
              </span>
              {product.original_price && discount > 0 && (
                <span className="text-sm font-medium text-slate-400 line-through">
                  {formatPrice(product.original_price, currency)}
                </span>
              )}
              {discount > 0 && (
                <span className="rounded-full bg-rose-100 px-2.5 py-0.5 text-xs font-bold text-rose-700">
                  Save {discount}%
                </span>
              )}
            </div>

            {/* Stock */}
            <span
              className={`inline-flex items-center gap-1 text-xs font-semibold ${
                isOutOfStock
                  ? "text-red-600"
                  : isLowStock
                  ? "text-amber-600"
                  : "text-emerald-600"
              }`}
            >
              {isOutOfStock
                ? "Out of Stock"
                : isLowStock
                ? `Only ${product.stock_quantity} left`
                : "In Stock"}
            </span>

            {/* Size picker */}
            <div>
              <p className="mb-2 text-xs font-bold uppercase tracking-wide text-slate-500">
                Select Size
                {FIT_GUIDE[selectedSize] && (
                  <span className="ml-2 font-normal normal-case text-teal-600">
                    — {FIT_GUIDE[selectedSize]}
                  </span>
                )}
              </p>
              <div className="flex flex-wrap gap-2">
                {availableSizes.map((size) => (
                  <button
                    key={size}
                    type="button"
                    onClick={() => setSelectedSize(size)}
                    className={`rounded-xl border px-4 py-2 text-sm font-bold transition ${
                      selectedSize === size
                        ? "border-teal-600 bg-teal-600 text-white shadow-md shadow-teal-200"
                        : "border-slate-200 bg-white text-slate-700 hover:border-teal-400 hover:bg-teal-50"
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            {/* Wishlist */}
            <button
              type="button"
              onClick={handleToggleWishlist}
              className={`inline-flex items-center gap-2 text-sm font-semibold transition ${
                wishlisted ? "text-rose-600" : "text-slate-400 hover:text-rose-500"
              }`}
            >
              <AppIcon name="heart" className="h-4.5 w-4.5" fill={wishlisted ? "currentColor" : "none"} />
              {wishlisted ? "Saved to Wishlist" : "Add to Wishlist"}
            </button>

            {/* Specs strip */}
            <div className="grid grid-cols-3 gap-2 rounded-2xl border border-slate-100 bg-slate-50 p-3">
              {[
                { label: "Fabric", value: "Premium Cotton" },
                { label: "Fit", value: "Regular Fit" },
                { label: "Made In", value: "Bangladesh 🇧🇩" },
              ].map((spec) => (
                <div key={spec.label} className="text-center">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    {spec.label}
                  </p>
                  <p className="mt-0.5 text-xs font-semibold text-slate-700">
                    {spec.label === "Made In" ? "Bangladesh" : spec.value}
                  </p>
                </div>
              ))}
            </div>

            {/* CTAs */}
            <div className="mt-auto flex flex-col gap-2.5">
              <button
                type="button"
                disabled={isOutOfStock || added}
                onClick={handleAddToCart}
                className="inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-slate-900 py-3 text-sm font-bold text-white transition hover:bg-slate-700 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <AppIcon name="cart" className="h-4.5 w-4.5" />
                {added ? "Added to Cart" : isOutOfStock ? "Out of Stock" : "Add to Cart"}
              </button>
              <a
                href={waLink}
                target="_blank"
                rel="noreferrer"
                className="inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-emerald-600 py-3 text-center text-sm font-bold text-white transition hover:bg-emerald-700"
              >
                <AppIcon name="whatsapp" className="h-4.5 w-4.5" />
                Order via WhatsApp
              </a>
              <Link
                href={`/product/${product.id}`}
                onClick={onClose}
                className="inline-flex w-full items-center justify-center gap-1 rounded-2xl border border-slate-200 py-2.5 text-center text-sm font-semibold text-slate-600 transition hover:bg-slate-50"
              >
                View Full Details
                <AppIcon name="chevronRight" className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
