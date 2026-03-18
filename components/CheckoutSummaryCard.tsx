"use client";

import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import type { CartItem } from "@/types";
import { CART_UPDATED_EVENT, getCart } from "@/lib/cart";

export default function CheckoutSummaryCard() {
  const [items, setItems] = useState<CartItem[]>([]);

  useEffect(() => {
    const sync = () => setItems(getCart());
    sync();
    window.addEventListener(CART_UPDATED_EVENT, sync);
    window.addEventListener("storage", sync);
    return () => {
      window.removeEventListener(CART_UPDATED_EVENT, sync);
      window.removeEventListener("storage", sync);
    };
  }, []);

  const subtotal = useMemo(
    () => items.reduce((sum, item) => sum + Number(item.price || 0) * Number(item.quantity || 0), 0),
    [items]
  );
  const shipping = subtotal >= 2000 || subtotal === 0 ? 0 : 120;
  const total = subtotal + shipping;

  return (
    <aside className="rounded-2xl border border-slate-200 bg-slate-50 p-4 shadow-sm lg:sticky lg:top-24">
      <h3 className="text-lg font-extrabold text-slate-900">Order Summary ({items.length})</h3>

      <div className="mt-4 space-y-3">
        {items.length === 0 ? (
          <p className="text-sm text-slate-500">Your cart is empty.</p>
        ) : (
          items.map((item, index) => (
            <div key={`${item.id}-${item.selectedSize}-${index}`} className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white p-2.5">
              <Image
                src={item.image_url || "/hero-modern-fashion.svg"}
                alt={item.name}
                width={56}
                height={56}
                className="h-14 w-14 rounded-lg object-cover"
              />
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-semibold text-slate-900">{item.name}</p>
                <p className="text-xs text-slate-500">
                  {item.selectedSize} • Qty {item.quantity}
                </p>
              </div>
              <p className="text-sm font-bold text-slate-900">৳{Number(item.price || 0) * Number(item.quantity || 0)}</p>
            </div>
          ))
        )}
      </div>

      <div className="mt-4 space-y-2 border-t border-slate-200 pt-3 text-sm">
        <div className="flex items-center justify-between text-slate-600">
          <span>Subtotal</span>
          <span>৳{subtotal}</span>
        </div>
        <div className="flex items-center justify-between text-slate-600">
          <span>Shipping (Sylhet)</span>
          <span>{shipping === 0 ? "Free" : `৳${shipping}`}</span>
        </div>
        <div className="flex items-center justify-between text-base font-extrabold text-slate-900">
          <span>Total Payable</span>
          <span>৳{total}</span>
        </div>
      </div>

      <a
        href="#checkout-submit"
        className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-slate-900 px-4 py-3 text-sm font-bold text-white transition hover:bg-amber-400 hover:text-slate-900"
      >
        <i className="fa-solid fa-lock" aria-hidden="true" />
        Complete Purchase
      </a>
    </aside>
  );
}
