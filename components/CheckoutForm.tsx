"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import { clearCart, getCart } from "@/lib/cart";
import { CartItem } from "@/types";

export default function CheckoutForm() {
  const [customerName, setCustomerName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [deliveryMethod, setDeliveryMethod] = useState("Home Delivery");
  const [courierName, setCourierName] = useState("Pathao");
  const [paymentMethod, setPaymentMethod] = useState("bKash");
  const [trxId, setTrxId] = useState("");
  const [website, setWebsite] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [startedAt, setStartedAt] = useState(Date.now());

  useEffect(() => {
    setCart(getCart());
    setStartedAt(Date.now());
  }, []);

  const total = useMemo(() => {
    return cart.reduce((sum, item) => sum + Number(item.price) * item.quantity, 0);
  }, [cart]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!customerName || !phone || !address) {
      alert("Please fill all fields");
      return;
    }

    if (paymentMethod === "bKash" && !trxId.trim()) {
      alert("Please provide your bKash Transaction ID");
      return;
    }

    if (cart.length === 0) {
      alert("Your cart is empty");
      return;
    }

    try {
      setSubmitting(true);

      const response = await fetch("/api/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          customer_name: customerName,
          phone,
          address,
          delivery_method: deliveryMethod,
          courier_name: courierName,
          payment_method: paymentMethod,
          total_amount: total,
          bkash_trx_id: trxId,
          website,
          client_started_at: startedAt,
        }),
      });

      const result = await response.json();
      if (!response.ok) {
        throw new Error(result.error || "Failed to place order");
      }

      clearCart();
      window.location.href = "/order-success";
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "Failed to place order";
      alert(message);
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
        aria-label="Delivery Method"
        title="Delivery Method"
        value={deliveryMethod}
        onChange={(e) => setDeliveryMethod(e.target.value)}
        className="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none"
      >
        <option value="Home Delivery">Home Delivery</option>
        <option value="Pickup">Store Pickup</option>
      </select>

      {deliveryMethod === "Home Delivery" ? (
        <select
          aria-label="Courier Service"
          title="Courier Service"
          value={courierName}
          onChange={(e) => setCourierName(e.target.value)}
          className="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none"
        >
          <option value="Pathao">Pathao</option>
          <option value="Sundarban">Sundarban</option>
          <option value="SA Paribahan">SA Paribahan</option>
          <option value="RedX">RedX</option>
          <option value="Steadfast">Steadfast</option>
          <option value="Self Managed">Self Managed</option>
        </select>
      ) : null}

      <select
        aria-label="Payment Method"
        title="Payment Method"
        value={paymentMethod}
        onChange={(e) => setPaymentMethod(e.target.value)}
        className="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none"
      >
        <option value="bKash">bKash</option>
        <option value="Cash on Delivery">Cash on Delivery</option>
      </select>

      {paymentMethod === "bKash" ? (
        <input
          type="text"
          placeholder="bKash Transaction ID"
          value={trxId}
          onChange={(e) => setTrxId(e.target.value)}
          className="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none"
        />
      ) : (
        <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-3 text-sm text-emerald-800">
          Cash on Delivery selected. Pay to courier at delivery time.
        </div>
      )}

      <input
        type="text"
        name="website"
        value={website}
        onChange={(e) => setWebsite(e.target.value)}
        tabIndex={-1}
        autoComplete="off"
        className="hidden"
        aria-hidden="true"
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
