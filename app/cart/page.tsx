"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import Header from "@/components/Header";
import BottomNav from "@/components/BottomNav";
import { getCart, removeCartItem, updateCartQuantity } from "@/lib/cart";
import { CartItem } from "@/types";

export default function CartPage() {
  const [cart, setCart] = useState<CartItem[]>([]);

  const loadCart = () => {
    setCart(getCart());
  };

  useEffect(() => {
    loadCart();
  }, []);

  const total = useMemo(() => {
    return cart.reduce((sum, item) => sum + Number(item.price) * item.quantity, 0);
  }, [cart]);

  return (
    <main className="pb-20">
      <Header storeName="Clothify" slogan="Find Your Fit" logoUrl="" />

      <section className="mx-auto max-w-5xl px-4 py-10">
        <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
          <div className="flex items-center justify-between gap-3">
            <h1 className="text-2xl font-bold text-slate-900">Your Cart</h1>
            <Link
              href="/"
              className="inline-flex items-center gap-1 rounded-full border border-slate-300 px-3 py-1.5 text-xs font-semibold text-slate-700 transition hover:bg-slate-50"
            >
              🏠 Back to Home
            </Link>
          </div>

          {cart.length === 0 ? (
            <p className="mt-4 text-slate-600">Your cart is empty.</p>
          ) : (
            <div className="mt-6 space-y-4">
              {cart.map((item, index) => (
                <div
                  key={`${item.id}-${item.selectedSize}-${index}`}
                  className="flex flex-col gap-4 rounded-xl border border-slate-200 p-4 md:flex-row md:items-center"
                >
                  <Image
                    src={item.image_url}
                    alt={item.name}
                    width={96}
                    height={96}
                    className="h-24 w-24 rounded-lg object-cover"
                  />

                  <div className="flex-1">
                    <h3 className="font-bold text-slate-900">{item.name}</h3>
                    <p className="text-sm text-slate-500">
                      Size: {item.selectedSize}
                    </p>
                    <p className="mt-1 font-semibold text-slate-900">
                      ৳{item.price}
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        updateCartQuantity(index, item.quantity - 1);
                        loadCart();
                      }}
                      className="rounded border px-3 py-1"
                    >
                      -
                    </button>

                    <span className="min-w-[32px] text-center">{item.quantity}</span>

                    <button
                      type="button"
                      onClick={() => {
                        updateCartQuantity(index, item.quantity + 1);
                        loadCart();
                      }}
                      className="rounded border px-3 py-1"
                    >
                      +
                    </button>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      removeCartItem(index);
                      loadCart();
                    }}
                    className="rounded-lg bg-red-600 px-4 py-2 text-sm text-white"
                  >
                    Remove
                  </button>
                </div>
              ))}

              <div className="rounded-xl bg-slate-50 p-4">
                <p className="text-lg font-bold text-slate-900">Total: ৳{total}</p>

                <Link
                  href="/checkout"
                  className="mt-4 inline-block rounded-lg bg-black px-5 py-3 text-white"
                >
                  Proceed to Checkout
                </Link>
              </div>
            </div>
          )}
        </div>
      </section>

      <BottomNav />
    </main>
  );
}
