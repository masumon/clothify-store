"use client";

import { useEffect, useState } from "react";

type Props = {
  storeName?: string;
  slogan?: string;
  whatsappNumber?: string;
};

type Countdown = { days: number; hours: number; minutes: number; seconds: number };

const EID_DATE = new Date("2026-03-30T00:00:00+06:00");

function calcCountdown(target: Date): Countdown {
  const diff = target.getTime() - Date.now();
  if (diff <= 0) return { days: 0, hours: 0, minutes: 0, seconds: 0 };
  return {
    days: Math.floor(diff / 864e5),
    hours: Math.floor((diff % 864e5) / 36e5),
    minutes: Math.floor((diff % 36e5) / 6e4),
    seconds: Math.floor((diff % 6e4) / 1e3),
  };
}

function normalizeBangladeshWhatsAppNumber(phone: string) {
  const digits = phone.replace(/\D/g, "");
  if (!digits) return "8801811314262";
  if (digits.startsWith("880")) return digits;
  if (digits.startsWith("0")) return `88${digits}`;
  return digits;
}

export default function HomeHero({
  storeName = "Clothify",
  slogan = "Find Your Fit",
  whatsappNumber = "8801811314262",
}: Props) {
  const [lang, setLang] = useState<"en" | "bn">("bn");
  const [countdown, setCountdown] = useState<Countdown>({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    const syncLang = () => {
      const saved = localStorage.getItem("clothfy-lang");
      if (saved === "en" || saved === "bn") {
        setLang(saved);
      }
    };

    syncLang();
    window.addEventListener("clothfy-preferences-change", syncLang);
    return () => window.removeEventListener("clothfy-preferences-change", syncLang);
  }, []);

  useEffect(() => {
    setCountdown(calcCountdown(EID_DATE));
    const id = setInterval(() => setCountdown(calcCountdown(EID_DATE)), 1000);
    return () => clearInterval(id);
  }, []);

  const isBn = lang === "bn";
  const pad = (n: number) => String(n).padStart(2, "0");

  const waLink = `https://wa.me/${normalizeBangladeshWhatsAppNumber(whatsappNumber)}?text=${encodeURIComponent(
    isBn
      ? "আস্সালামু আলাইকুম! Clothify-তে ঈদ কালেকশন দেখতে চাই।"
      : "Hello! I want to explore the Eid Collection at Clothify."
  )}`;

  const chips = [
    { en: "⭐ 4.9/5 Rating", bn: "⭐ ৪.৯/৫ রেটিং" },
    { en: "🚚 Nationwide Delivery", bn: "🚚 সারা দেশে ডেলিভারি" },
    { en: "💳 bKash + COD", bn: "💳 bKash + COD" },
    { en: "🔄 Easy Returns", bn: "🔄 সহজ রিটার্ন" },
  ];

  const collection = [
    { icon: "👔", en: "Premium Panjabi", bn: "প্রিমিয়াম পাঞ্জাবি" },
    { icon: "👕", en: "Polo Shirts", bn: "পোলো শার্ট" },
    { icon: "👖", en: "Slim Fit Pants", bn: "স্লিম ফিট প্যান্ট" },
    { icon: "🧥", en: "Cuban Collar", bn: "কিউবান কলার" },
  ];

  const cdUnits = [
    { v: countdown.days, en: "Days", bn: "দিন" },
    { v: countdown.hours, en: "Hours", bn: "ঘণ্টা" },
    { v: countdown.minutes, en: "Mins", bn: "মিনিট" },
    { v: countdown.seconds, en: "Secs", bn: "সেকেন্ড" },
  ];

  return (
    <section className="relative mb-8 overflow-hidden rounded-[28px] border border-slate-700/20 shadow-2xl shadow-slate-900/30">
      {/* Background */}
      <div className="absolute inset-0 bg-[url('/hero-modern-fashion.svg')] bg-cover bg-center" />
      <div className="absolute inset-0 bg-gradient-to-br from-[#0F172A]/96 via-[#0F172A]/82 to-[#1e3a5f]/70" />
      {/* Decorative blobs */}
      <div className="absolute -left-20 -top-20 h-64 w-64 rounded-full bg-amber-400/15 blur-3xl" />
      <div className="absolute -bottom-24 right-4 h-72 w-72 rounded-full bg-teal-400/15 blur-3xl" />
      <div className="absolute right-1/3 top-0 h-40 w-40 rounded-full bg-rose-400/10 blur-2xl" />

      {/* Announcement strip */}
      <div className="relative border-b border-white/10 bg-amber-400/10 px-5 py-2 text-center text-[11px] font-bold uppercase tracking-[0.25em] text-amber-200 backdrop-blur">
        {isBn
          ? "⚡ ঈদ এক্সক্লুসিভ কালেকশন ২০২৬ — সীমিত স্টক — এখনই অর্ডার করুন"
          : "⚡ Eid Exclusive Collection 2026 — Limited Stock — Order Now"}
      </div>

      {/* Main hero grid */}
      <div className="relative grid gap-8 px-5 py-10 sm:px-8 sm:py-14 md:grid-cols-[1.1fr_0.9fr] md:items-center md:px-12 md:py-16">
        {/* LEFT: Copy + CTAs */}
        <div className="max-w-xl">
          <p className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-1.5 text-[11px] font-bold uppercase tracking-[0.25em] text-white backdrop-blur">
            <span className="inline-block h-2 w-2 animate-pulse rounded-full bg-amber-400" />
            {isBn ? "ঈদুল ফিতর ২০২৬ কালেকশন" : "Eid ul-Fitr 2026 Collection"}
          </p>

          <h2 className="text-3xl font-extrabold leading-tight tracking-tight text-white sm:text-4xl md:text-5xl">
            {storeName}
          </h2>
          <p className="mt-1.5 text-xl font-bold text-amber-200 sm:text-2xl">{slogan}</p>

          <p className="mt-4 max-w-lg text-sm leading-7 text-slate-200 sm:text-base">
            {isBn
              ? "প্রিমিয়াম পাঞ্জাবি, স্মার্ট পোলো শার্ট, স্লিম ফিট প্যান্ট এবং কিউবান কলার শার্ট। ঈদের জন্য বাছাই করা সেরা কালেকশন।"
              : "Premium Panjabi, smart polo shirts, slim fit pants, and Cuban collar shirts. Curated exclusively for Eid celebrations."}
          </p>

          {/* Trust chips */}
          <div className="mt-5 flex flex-wrap gap-2">
            {chips.map((chip) => (
              <span
                key={chip.en}
                className="rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs font-semibold text-white/90"
              >
                {isBn ? chip.bn : chip.en}
              </span>
            ))}
          </div>

          {/* CTAs */}
          <div className="mt-7 flex flex-col gap-3 sm:flex-row">
            <a
              href="#products"
              className="inline-flex items-center justify-center gap-2 rounded-full bg-amber-500 px-7 py-3.5 text-base font-extrabold text-slate-900 transition duration-300 hover:-translate-y-0.5 hover:bg-amber-400"
            >
              {isBn ? "🛍️ কালেকশন দেখুন" : "🛍️ Shop Collection"}
            </a>
            <a
              href={waLink}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center justify-center gap-2 rounded-full border-2 border-emerald-400/60 bg-emerald-500/20 px-7 py-3.5 text-base font-bold text-white backdrop-blur transition duration-300 hover:-translate-y-0.5 hover:bg-emerald-500/35"
            >
              {isBn ? "💬 WhatsApp অর্ডার" : "💬 WhatsApp Order"}
            </a>
            <a
              href="/checkout"
              className="inline-flex items-center justify-center gap-2 rounded-full border-2 border-white/25 bg-white/10 px-7 py-3.5 text-base font-bold text-white backdrop-blur transition duration-300 hover:-translate-y-0.5 hover:bg-white/20"
            >
              {isBn ? "✅ চেকআউট" : "✅ Checkout"}
            </a>
          </div>
        </div>

        {/* RIGHT: Countdown + collection grid */}
        <div className="flex flex-col gap-4">
          {/* Countdown card */}
          <div className="rounded-3xl border border-white/15 bg-white/[0.08] p-5 backdrop-blur">
            <p className="text-center text-[11px] font-bold uppercase tracking-[0.25em] text-amber-300">
              {isBn ? "🌙 ঈদ কাউন্টডাউন" : "🌙 Eid Countdown"}
            </p>
            <div className="mt-3 grid grid-cols-4 gap-2">
              {cdUnits.map((unit) => (
                <div
                  key={unit.en}
                  className="flex flex-col items-center rounded-2xl border border-white/15 bg-black/20 py-3"
                >
                  <span className="text-2xl font-extrabold tabular-nums text-white sm:text-3xl">
                    {pad(unit.v)}
                  </span>
                  <span className="mt-1 text-[9px] font-bold uppercase tracking-wider text-white/55">
                    {isBn ? unit.bn : unit.en}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Collection highlights */}
          <div className="grid grid-cols-2 gap-2">
            {collection.map((item) => (
              <div
                key={item.en}
                className="flex items-center gap-2.5 rounded-2xl border border-white/10 bg-white/[0.08] px-3.5 py-3 backdrop-blur"
              >
                <span className="text-xl">{item.icon}</span>
                <span className="text-xs font-semibold text-white/90">
                  {isBn ? item.bn : item.en}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
