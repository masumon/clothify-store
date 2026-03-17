"use client";

import { useEffect, useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import MobileStickyBar from "@/components/MobileStickyBar";
import Link from "next/link";

type ProfileState = {
  name: string;
  phone: string;
  address: string;
};

const PROFILE_KEY = "clothify-profile";

export default function ProfilePage() {
  const [profile, setProfile] = useState<ProfileState>({ name: "", phone: "", address: "" });
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(PROFILE_KEY);
      if (!raw) return;
      const parsed = JSON.parse(raw);
      setProfile({
        name: parsed.name || "",
        phone: parsed.phone || "",
        address: parsed.address || "",
      });
    } catch {
      // Ignore invalid local data.
    }
  }, []);

  const saveProfile = () => {
    localStorage.setItem(PROFILE_KEY, JSON.stringify(profile));
    setSaved(true);
    setTimeout(() => setSaved(false), 1800);
  };

  return (
    <main className="pb-24 md:pb-0">
      <Header storeName="Clothify" slogan="Find Your Fit" logoUrl="" whatsappNumber="8801811314262" />

      <section className="mx-auto max-w-3xl space-y-6 px-4 py-6 sm:py-8">
        <div className="rounded-3xl border border-slate-200 bg-white p-6">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-slate-500">Profile & Orders</p>
          <h1 className="mt-2 text-2xl font-extrabold text-slate-900">My Profile</h1>
          <p className="mt-2 text-sm text-slate-600">Checkout-এ auto-fill এর জন্য আপনার তথ্য save করুন।</p>
        </div>

        <div className="rounded-3xl border border-slate-200 bg-white p-6">
          <div className="grid gap-3">
            <input
              type="text"
              placeholder="Full Name"
              value={profile.name}
              onChange={(e) => setProfile((p) => ({ ...p, name: e.target.value }))}
              className="w-full rounded-xl border border-slate-300 px-4 py-3"
            />
            <input
              type="text"
              placeholder="Phone Number"
              value={profile.phone}
              onChange={(e) => setProfile((p) => ({ ...p, phone: e.target.value }))}
              className="w-full rounded-xl border border-slate-300 px-4 py-3"
            />
            <textarea
              placeholder="Address"
              value={profile.address}
              onChange={(e) => setProfile((p) => ({ ...p, address: e.target.value }))}
              className="min-h-[110px] w-full rounded-xl border border-slate-300 px-4 py-3"
            />
          </div>

          <button
            type="button"
            onClick={saveProfile}
            className="mt-4 rounded-full bg-teal-700 px-5 py-2.5 text-sm font-bold text-white"
          >
            💾 Save Profile
          </button>

          {saved && <p className="mt-2 text-sm font-semibold text-emerald-700">Saved! Checkout-এ auto-fill হবে।</p>}
        </div>

        <div className="rounded-3xl border border-slate-200 bg-white p-6">
          <h2 className="text-lg font-bold text-slate-900">Order Tracking</h2>
          <p className="mt-2 text-sm text-slate-600">Order status জানতে support টিমের সাথে WhatsApp-এ যোগাযোগ করুন।</p>
          <div className="mt-3 flex flex-wrap gap-2">
            <Link
              href="/profile/orders"
              className="rounded-full border border-slate-300 bg-white px-5 py-2.5 text-sm font-semibold text-slate-700"
            >
              📦 My Orders
            </Link>
            <a
              href="https://wa.me/8801811314262?text=%E0%A6%86%E0%A6%AE%E0%A6%BE%E0%A6%B0%20order%20status%20%E0%A6%9C%E0%A6%BE%E0%A6%A8%E0%A6%A4%E0%A7%87%20%E0%A6%9A%E0%A6%BE%E0%A6%87"
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-full bg-emerald-600 px-5 py-2.5 text-sm font-bold text-white"
            >
              💬 Track on WhatsApp
            </a>
          </div>
        </div>
      </section>

      <Footer storeName="Clothify" address="" phone="" />
      <MobileStickyBar />
    </main>
  );
}
