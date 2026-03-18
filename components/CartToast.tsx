"use client";

import { useEffect, useRef, useState } from "react";
import { CART_ITEM_ADDED_EVENT } from "@/lib/cart";

type CartAddPayload = {
  name?: string;
  quantity?: number;
};

export default function CartToast() {
  const [message, setMessage] = useState("");
  const timeoutRef = useRef<number | null>(null);

  useEffect(() => {
    const onItemAdded = (event: Event) => {
      const customEvent = event as CustomEvent<CartAddPayload>;
      const name = customEvent.detail?.name || "Product";
      const quantity = Number(customEvent.detail?.quantity || 1);
      setMessage(`🛒 ${name} x${quantity} added to cart`);

      if (timeoutRef.current) {
        window.clearTimeout(timeoutRef.current);
      }
      timeoutRef.current = window.setTimeout(() => setMessage(""), 1800);
    };

    window.addEventListener(CART_ITEM_ADDED_EVENT, onItemAdded as EventListener);
    return () => {
      window.removeEventListener(CART_ITEM_ADDED_EVENT, onItemAdded as EventListener);
      if (timeoutRef.current) {
        window.clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  if (!message) return null;

  return (
    <div className="pointer-events-none fixed bottom-[6.5rem] left-1/2 z-[95] -translate-x-1/2 px-4 md:bottom-6">
      <div className="abo-toast rounded-full border border-white/20 bg-slate-900/95 px-4 py-2 text-xs font-semibold text-white shadow-2xl backdrop-blur sm:text-sm">
        <span className="mr-1.5 text-emerald-300">✔</span>
        {message}
      </div>
    </div>
  );
}
