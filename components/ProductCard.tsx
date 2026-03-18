"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import { addToCart } from "@/lib/cart";
import { toggleWishlist, isInWishlist } from "@/lib/wishlist";
import { formatPrice, getSavedCurrency, type Currency } from "@/lib/currency";
import QuickViewModal from "@/components/QuickViewModal";

type ProductCardProps = {
  product: {
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
    video_url?: string | null;
  };
  whatsappNumber?: string;
};

function normalizeBangladeshWhatsAppNumber(phone: string) {
  const digits = phone.replace(/\D/g, "");

  if (!digits) return "8801811314262";
  if (digits.startsWith("880")) return digits;
  if (digits.startsWith("0")) return `88${digits}`;
  return digits;
}

export default function ProductCard({ product, whatsappNumber = "8801811314262" }: ProductCardProps) {
  const [wishlisted, setWishlisted] = useState(false);
  const [currency, setCurrency] = useState<Currency>("BDT");
  const [quickViewOpen, setQuickViewOpen] = useState(false);
  const [hovered, setHovered] = useState(false);
  const [zoomActive, setZoomActive] = useState(false);
  const [zoomOrigin, setZoomOrigin] = useState("50% 50%");

  useEffect(() => {
    setWishlisted(isInWishlist(product.id));
    setCurrency(getSavedCurrency());
    const onPrefs = () => setCurrency(getSavedCurrency());
    const onWishlist = () => setWishlisted(isInWishlist(product.id));
    window.addEventListener("clothfy-preferences-change", onPrefs);
    window.addEventListener("clothfy-wishlist-change", onWishlist);
    return () => {
      window.removeEventListener("clothfy-preferences-change", onPrefs);
      window.removeEventListener("clothfy-wishlist-change", onWishlist);
    };
  }, [product.id]);

  const discount =
    product.original_price && product.original_price > product.price
      ? Math.round(((product.original_price - product.price) / product.original_price) * 100)
      : 0;

  const isOutOfStock = (product.stock_quantity ?? 1) <= 0;
  const isLowStock = !isOutOfStock && (product.stock_quantity ?? 20) <= 5;

  const handleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const result = toggleWishlist({
      id: product.id,
      name: product.name,
      price: product.price,
      image_url: product.image_url,
      category: product.category,
    });
    setWishlisted(result);
  };

  const waText = `Hello, I want to order this product:%0A%0AProduct: ${encodeURIComponent(
    product.name
  )}%0APrice: ৳${product.price}`;
  const whatsappUrl = `https://wa.me/${normalizeBangladeshWhatsAppNumber(whatsappNumber)}?text=${waText}`;

  const updateZoomOrigin = (
    clientX: number,
    clientY: number,
    target: EventTarget & HTMLDivElement
  ) => {
    const rect = target.getBoundingClientRect();
    const x = Math.max(0, Math.min(100, ((clientX - rect.left) / rect.width) * 100));
    const y = Math.max(0, Math.min(100, ((clientY - rect.top) / rect.height) * 100));
    setZoomOrigin(`${x}% ${y}%`);
  };

  const handleImageMouseMove = (event: React.MouseEvent<HTMLDivElement>) => {
    updateZoomOrigin(event.clientX, event.clientY, event.currentTarget);
    setZoomActive(true);
  };

  const handleImageTouchMove = (event: React.TouchEvent<HTMLDivElement>) => {
    const touch = event.touches[0];
    if (!touch) return;
    updateZoomOrigin(touch.clientX, touch.clientY, event.currentTarget);
    setZoomActive(true);
  };

  return (
    <>
      <div
        className="group relative overflow-hidden rounded-3xl border border-slate-200/80 bg-white/95 shadow-[0_12px_32px_-24px_rgba(2,6,23,0.6)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_24px_40px_-24px_rgba(2,6,23,0.45)]"
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        {/* Image region */}
        <div
          className="relative overflow-hidden"
          onMouseMove={handleImageMouseMove}
          onMouseLeave={() => {
            setZoomActive(false);
            setZoomOrigin("50% 50%");
          }}
          onTouchStart={() => setZoomActive(true)}
          onTouchMove={handleImageTouchMove}
          onTouchEnd={() => setZoomActive(false)}
        >
          <Link href={`/product/${product.id}`}>
            <Image
              src={product.image_url}
              alt={product.name}
              width={400}
              height={288}
              sizes="(max-width: 640px) 48vw, (max-width: 1024px) 32vw, 24vw"
              className="h-52 w-full object-cover sm:h-56"
              style={{
                transformOrigin: zoomOrigin,
                transform: zoomActive ? "scale(1.25)" : "scale(1)",
                transition: zoomActive ? "transform 120ms ease-out" : "transform 320ms ease",
              }}
            />
          </Link>

          {/* Quick View hover overlay */}
          <div
            className={`absolute inset-0 flex items-end justify-center bg-gradient-to-t from-black/60 via-black/20 to-transparent pb-4 transition-opacity duration-300 ${
              hovered ? "opacity-100" : "opacity-0"
            }`}
          >
            <button
              type="button"
              onClick={() => setQuickViewOpen(true)}
              className="rounded-full bg-white/95 px-5 py-2.5 text-sm font-bold text-slate-900 shadow-lg backdrop-blur transition hover:bg-white hover:shadow-xl"
            >
              👁 Quick View
            </button>
          </div>

          {/* Left badge stack */}
          <div className="absolute left-3 top-3 flex flex-col gap-1.5">
            {product.is_featured ? (
              <div className="rounded-full bg-slate-900/90 px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.2em] text-white backdrop-blur">
                ⭐ Featured
              </div>
            ) : null}
            {product.campaign_badge ? (
              <div className="rounded-full bg-rose-600/90 px-2.5 py-1 text-[10px] font-bold text-white backdrop-blur">
                {product.campaign_badge}
              </div>
            ) : null}
            {discount > 0 && (
              <div className="rounded-full bg-amber-500 px-2.5 py-1 text-[10px] font-extrabold text-white">
                -{discount}%
              </div>
            )}
          </div>

          {/* Video reel indicator */}
          {product.has_video && (
            <div className="absolute bottom-3 left-3 flex items-center gap-1.5 rounded-full bg-black/65 px-2.5 py-1 text-[10px] font-bold text-white backdrop-blur">
              <span className="inline-block h-1.5 w-1.5 animate-pulse rounded-full bg-red-500" />
              Reel
            </div>
          )}

          {/* Category chip — top right */}
          <div className="absolute right-3 top-3 rounded-full bg-white/95 px-2.5 py-1 text-[10px] font-semibold text-slate-700 shadow-sm backdrop-blur">
            {product.category}
          </div>

          {/* Wishlist button — bottom right */}
          <button
            type="button"
            onClick={handleWishlist}
            aria-label={wishlisted ? "Remove from wishlist" : "Add to wishlist"}
            className={`absolute bottom-3 right-3 flex h-9 w-9 items-center justify-center rounded-full border shadow-sm transition duration-200 ${
              wishlisted
                ? "border-rose-300 bg-rose-50 text-rose-600 hover:bg-rose-100"
                : "border-slate-200 bg-white/90 text-slate-400 hover:border-rose-300 hover:text-rose-500"
            }`}
          >
            <span className="text-sm leading-none">{wishlisted ? "❤️" : "🤍"}</span>
          </button>
        </div>

        {/* Card body */}
        <div className="p-4 sm:p-5">
          <h3 className="line-clamp-2 min-h-[50px] text-base font-bold leading-6 text-slate-900 sm:text-lg sm:leading-7">
            {product.name}
          </h3>

          {/* Pricing row */}
          <div className="mt-3 flex flex-wrap items-center gap-2">
            <span className="text-xl font-extrabold text-teal-700 sm:text-2xl">
              {formatPrice(product.price, currency)}
            </span>
            {discount > 0 && product.original_price && (
              <span className="text-sm font-medium text-slate-400 line-through">
                {formatPrice(product.original_price, currency)}
              </span>
            )}
          </div>

          {/* Stock indicator */}
          <p
            className={`mt-1.5 text-xs font-semibold ${
              isOutOfStock ? "text-red-600" : isLowStock ? "text-amber-600" : "text-slate-400"
            }`}
          >
            {isOutOfStock
              ? "❌ Out of stock"
              : isLowStock
                ? `⚠️ Only ${product.stock_quantity} left`
                : "✓ In stock"}
          </p>

          {/* Action row */}
          <div className="mt-3 grid grid-cols-2 gap-1.5 sm:gap-2">
            <button
              type="button"
              disabled={isOutOfStock}
              onClick={() =>
                addToCart({
                  id: product.id,
                  name: product.name,
                  price: Number(product.price),
                  image_url: product.image_url,
                  selectedSize: product.sizes?.[0] || "Standard",
                  quantity: 1,
                })
              }
              className="rounded-full border border-slate-200 bg-slate-50 px-2 py-2 text-center text-[11px] font-semibold text-slate-700 transition duration-200 hover:-translate-y-0.5 hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-40 sm:px-3 sm:py-2.5 sm:text-sm"
            >
              🛒 Cart
            </button>
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noreferrer"
              className="rounded-full bg-emerald-600 px-2 py-2 text-center text-[11px] font-bold text-white transition duration-200 hover:-translate-y-0.5 hover:bg-emerald-700 sm:px-3 sm:py-2.5 sm:text-sm"
            >
              💬 WhatsApp
            </a>
          </div>

          <Link
            href={`/product/${product.id}`}
            className="mt-2 block text-center text-xs font-semibold text-slate-500 underline-offset-2 hover:underline"
          >
            View Details →
          </Link>
        </div>
      </div>

      {quickViewOpen && (
        <QuickViewModal
          product={{ ...product, sizes: product.sizes || [] }}
          whatsappNumber={normalizeBangladeshWhatsAppNumber(whatsappNumber)}
          onClose={() => setQuickViewOpen(false)}
        />
      )}
    </>
  );
}
