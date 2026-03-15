"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import { clearCart, getCart } from "@/lib/cart";
import { createOrder } from "@/lib/data";

export default function CheckoutForm() {
  const [customerName, setCustomerName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [deliveryMethod, setDeliveryMethod] = useState("Home Delivery");
  const [trxId, setTrxId] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [cart, setCart] = useState<any[]>([]);

  useEffect(() => {
    setCart(getCart());
  }, []);

  const total = useMemo(() => {
    return cart.reduce((sum, item) => sum + Number(item.price) * item.quantity, 0);
  }, [cart]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!customerName || !phone || !address || !trxId) {
      alert("Please fill all fields");
      return;
    }

    if (cart.length === 0) {
      alert("Your cart is empty");
      return;
    }

    try {
      setSubmitting(true);

      await createOrder({
        customer_name: customerName,
        phone,
        address,
        delivery_method: deliveryMethod,
        total_amount: total,
        bkash_trx_id: trxId,
      });

      clearCart();
      alert("Order placed successfully");
      window.location.href = "/";
    } catch (error: any) {
      alert(error.message || "Failed to place order");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="Full Name"
        value={customerName}
        onChange={(e) => setCustomerName(e.target.value)}
        className="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none"
      />
      <input
        type="text"
        placeholder="Phone Number"
        value={phone}
        onChange={(e) => setPhone(e.target.value)}
        className="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none"
      />
      <textarea
        placeholder="Address"
        value={address}
        onChange={(e) => setAddress(e.target.value)}
        className="min-h-[120px] w-full rounded-lg border border-slate-300 px-4 py-3 outline-none"
      />
      <select
        value={deliveryMethod}
        onChange={(e) => setDeliveryMethod(e.target.value)}
        className="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none"
      >
        <option>Home Delivery</option>
        <option>Store Pickup</option>
      </select>
      <input
        type="text"
        placeholder="bKash Transaction ID"
        value={trxId}
        onChange={(e) => setTrxId(e.target.value)}
        className="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none"
      />

      <div className="rounded-xl bg-slate-50 p-4">
        <p className="font-semibold text-slate-900">Order Total: ৳{total}</p>
      </div>

      <button
        type="submit"
        disabled={submitting}
        className="w-full rounded-lg bg-black px-5 py-3 font-medium text-white disabled:opacity-60"
      >
        {submitting ? "Placing Order..." : "Place Order"}
      </button>
    </form>
  );
}
