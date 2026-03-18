"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import { clearCart, getCart } from "@/lib/cart";
import { CartItem } from "@/types";

const INVOICE_STORAGE_KEY = "clothify-latest-invoice";
const PROFILE_STORAGE_KEY = "clothify-profile";
const CHECKOUT_DRAFT_KEY = "clothify-checkout-draft";

type CheckoutFormProps = {
  storeName?: string;
};

export default function CheckoutForm({ storeName = "Clothify" }: CheckoutFormProps) {
  const [customerName, setCustomerName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("Sylhet");
  const [postalCode, setPostalCode] = useState("");
  const [deliveryMethod, setDeliveryMethod] = useState("Home Delivery");
  const [courierName, setCourierName] = useState("Pathao");
  const [paymentMethod, setPaymentMethod] = useState("bKash");
  const [trxId, setTrxId] = useState("");
  const [website, setWebsite] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [startedAt, setStartedAt] = useState(Date.now());
  const [submitError, setSubmitError] = useState("");

  useEffect(() => {
    setCart(getCart());
    setStartedAt(Date.now());

    try {
      const rawProfile = localStorage.getItem(PROFILE_STORAGE_KEY);
      if (rawProfile) {
        const profile = JSON.parse(rawProfile);
        setCustomerName(profile.name || "");
        setPhone(profile.phone || "");
        setAddress(profile.address || "");
      }
    } catch {
      // Ignore invalid profile cache.
    }

    try {
      const rawDraft = localStorage.getItem(CHECKOUT_DRAFT_KEY);
      if (rawDraft) {
        const d = JSON.parse(rawDraft);
        setCustomerName(d.customerName || "");
        setPhone(d.phone || "");
        setAddress(d.address || "");
        setCity(d.city || "Sylhet");
        setPostalCode(d.postalCode || "");
        setDeliveryMethod(d.deliveryMethod || "Home Delivery");
        setCourierName(d.courierName || "Pathao");
        setPaymentMethod(d.paymentMethod || "bKash");
        setTrxId(d.trxId || "");
      }
    } catch {
      // Ignore invalid draft.
    }
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const draft = {
      customerName,
      phone,
      address,
      city,
      postalCode,
      deliveryMethod,
      courierName,
      paymentMethod,
      trxId,
      updatedAt: Date.now(),
    };
    localStorage.setItem(CHECKOUT_DRAFT_KEY, JSON.stringify(draft));
  }, [customerName, phone, address, city, postalCode, deliveryMethod, courierName, paymentMethod, trxId]);

  const total = useMemo(() => {
    return cart.reduce((sum, item) => sum + Number(item.price) * item.quantity, 0);
  }, [cart]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!customerName || !phone || !address) {
      alert("Please fill all fields");
      return;
    }

    if ((paymentMethod === "bKash" || paymentMethod === "Nagad") && !trxId.trim()) {
      alert("Please provide your payment Transaction ID");
      return;
    }

    if (cart.length === 0) {
      alert("Your cart is empty");
      return;
    }

    const fullAddress = [address.trim(), city.trim(), postalCode.trim() ? `Postal: ${postalCode.trim()}` : ""]
      .filter(Boolean)
      .join(", ");

    try {
      setSubmitting(true);
      setSubmitError("");

      const controller = new AbortController();
      const timeoutId = window.setTimeout(() => controller.abort(), 20000);

      const response = await fetch("/api/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        signal: controller.signal,
        body: JSON.stringify({
          customer_name: customerName,
          phone,
          address: fullAddress,
          delivery_method: deliveryMethod,
          courier_name: courierName,
          payment_method: paymentMethod,
          total_amount: total,
          bkash_trx_id: trxId,
          items: cart.map((item) => ({
            product_id: item.id,
            quantity: item.quantity,
            selected_size: item.selectedSize || "Standard",
          })),
          website,
          client_started_at: startedAt,
        }),
      });
      window.clearTimeout(timeoutId);

      const result = await response.json();
      if (!response.ok) {
        throw new Error(result.error || "Failed to place order");
      }

      if (typeof window !== "undefined") {
        sessionStorage.setItem(
          INVOICE_STORAGE_KEY,
          JSON.stringify({
            orderId: result.id || `ORD-${Date.now()}`,
            invoiceNumber:
              typeof result.invoice_number === "string" && result.invoice_number.trim()
                ? result.invoice_number.trim()
                : "",
            customerName,
            phone,
            address: fullAddress,
            city,
            postalCode,
            deliveryMethod,
            courierName,
            paymentMethod,
            trxId,
            total,
            items: cart,
            createdAt:
              typeof result.created_at === "string" && result.created_at
                ? result.created_at
                : new Date().toISOString(),
            storeName,
          })
        );
      }

      clearCart();
      localStorage.removeItem(CHECKOUT_DRAFT_KEY);
      window.location.href = "/order-success";
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "Failed to place order";
      setSubmitError(message.includes("aborted")
        ? "Network timeout. Connection slow হতে পারে, আবার চেষ্টা করুন।"
        : message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="Phone Number *"
        value={phone}
        onChange={(e) => setPhone(e.target.value)}
        className="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none"
        inputMode="numeric"
      />
      <input
        type="text"
        placeholder="Full Name *"
        value={customerName}
        onChange={(e) => setCustomerName(e.target.value)}
        className="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none"
      />
      <textarea
        placeholder="Address"
        value={address}
        onChange={(e) => setAddress(e.target.value)}
        className="min-h-[120px] w-full rounded-lg border border-slate-300 px-4 py-3 outline-none"
      />
      <div className="grid gap-3 sm:grid-cols-2">
        <select
          aria-label="City"
          title="City"
          value={city}
          onChange={(e) => setCity(e.target.value)}
          className="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none"
        >
          <option value="Sylhet">Sylhet</option>
          <option value="Dhaka">Dhaka</option>
          <option value="Chattogram">Chattogram</option>
          <option value="Rajshahi">Rajshahi</option>
          <option value="Khulna">Khulna</option>
          <option value="Barishal">Barishal</option>
          <option value="Mymensingh">Mymensingh</option>
          <option value="Rangpur">Rangpur</option>
        </select>
        <input
          type="text"
          placeholder="Postal Code"
          value={postalCode}
          onChange={(e) => setPostalCode(e.target.value)}
          className="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none"
        />
      </div>
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
        <option value="Nagad">Nagad</option>
        <option value="Cash on Delivery">Cash on Delivery</option>
      </select>

      {paymentMethod === "bKash" || paymentMethod === "Nagad" ? (
        <input
          type="text"
          placeholder={`${paymentMethod} Transaction ID`}
          value={trxId}
          onChange={(e) => setTrxId(e.target.value)}
          className="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none"
        />
      ) : (
        <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-3 text-sm text-emerald-800">
          COD selected. Product receive করার সময় courier-কে payment করুন।
        </div>
      )}

      <div className="rounded-xl border border-slate-200 bg-slate-50 p-3 text-xs text-slate-600">
        ✅ COD Available • 💳 bKash/Nagad supported • 🔁 7 days exchange support
      </div>

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
        id="checkout-submit"
        type="submit"
        disabled={submitting}
        className="w-full rounded-lg bg-black px-5 py-3 font-medium text-white disabled:opacity-60"
      >
        {submitting ? "Placing Order..." : "Place Order"}
      </button>

      {submitting ? (
        <p className="text-xs font-medium text-slate-500">
          Payment/Order processing... দয়া করে page close করবেন না।
        </p>
      ) : null}

      {submitError ? (
        <div className="rounded-xl border border-rose-200 bg-rose-50 p-3 text-sm text-rose-700">
          {submitError}
          <p className="mt-1 text-xs">Retry করুন বা WhatsApp support নিন।</p>
        </div>
      ) : null}
    </form>
  );
}
