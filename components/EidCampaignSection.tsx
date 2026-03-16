"use client";

import { useEffect, useState } from "react";

// Eid al-Fitr 2026 target date (approximate — moon sighting may shift by a day)
const EID_DATE = new Date("2026-03-31T00:00:00+06:00");

function getTimeLeft() {
  const diff = EID_DATE.getTime() - Date.now();
  if (diff <= 0) return { days: 0, hours: 0, minutes: 0, seconds: 0 };
  return {
    days: Math.floor(diff / (1000 * 60 * 60 * 24)),
    hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((diff / (1000 * 60)) % 60),
    seconds: Math.floor((diff / 1000) % 60),
  };
}

function CountBlock({ value, label }: { value: number; label: string }) {
  return (
    <div className="flex flex-col items-center rounded-2xl bg-white/10 px-4 py-3 backdrop-blur min-w-[64px]">
      <span className="text-2xl font-extrabold leading-none sm:text-3xl">
        {String(value).padStart(2, "0")}
      </span>
      <span className="mt-1 text-[10px] font-semibold uppercase tracking-widest text-white/70">
        {label}
      </span>
    </div>
  );
}

export default function EidCampaignSection() {
  const [timeLeft, setTimeLeft] = useState(getTimeLeft());

  useEffect(() => {
    const id = setInterval(() => setTimeLeft(getTimeLeft()), 1000);
    return () => clearInterval(id);
  }, []);

  const isOver = timeLeft.days === 0 && timeLeft.hours === 0 && timeLeft.minutes === 0;

  return (
    <section className="mb-8 overflow-hidden rounded-[32px] bg-gradient-to-br from-emerald-900 via-green-700 to-emerald-500 text-white shadow-2xl">
      <div className="relative px-6 py-10 sm:px-8 sm:py-12 md:px-12">
        {/* decorative glow */}
        <div className="absolute inset-0 opacity-10 pointer-events-none">
          <div className="h-full w-full bg-[radial-gradient(circle_at_top_right,_white,_transparent_30%)]" />
        </div>

        <div className="relative flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
          {/* left: copy */}
          <div className="max-w-3xl">
            <p className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-1.5 text-[11px] font-semibold uppercase tracking-[0.3em] text-white/90 backdrop-blur">
              🌙 ঈদ এক্সক্লুসিভ ২০২৬
            </p>

            <h3 className="mt-4 text-3xl font-extrabold leading-tight sm:text-4xl md:text-5xl">
              Premium Eid Collection
              <br className="hidden sm:block" /> Has Arrived ✨
            </h3>

            <p className="mt-4 max-w-2xl text-sm leading-7 text-white/90 sm:text-base">
              Elegant premium fabrics, festive fashion styles, selected discounts,
              and stylish new arrivals — ready for Eid shopping. Make this season
              unforgettable with exclusive looks from your trusted collection.
            </p>

            {/* Countdown */}
            <div className="mt-6">
              {isOver ? (
                <p className="text-lg font-bold text-yellow-300">🎉 ঈদ মোবারক!</p>
              ) : (
                <>
                  <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-white/70">
                    ঈদের আগে বাকি আছে
                  </p>
                  <div className="flex flex-wrap gap-2">
                    <CountBlock value={timeLeft.days} label="দিন" />
                    <CountBlock value={timeLeft.hours} label="ঘন্টা" />
                    <CountBlock value={timeLeft.minutes} label="মিনিট" />
                    <CountBlock value={timeLeft.seconds} label="সেকেন্ড" />
                  </div>
                </>
              )}
            </div>

            {/* Tags */}
            <div className="mt-6 flex flex-wrap gap-3">
              {["নতুন আরাইভাল", "ঈদ অফার", "প্রিমিয়াম ফেব্রিক", "সীমিত স্টক"].map(
                (tag) => (
                  <span
                    key={tag}
                    className="rounded-full bg-white/15 px-4 py-2 text-sm font-semibold text-white backdrop-blur"
                  >
                    {tag}
                  </span>
                )
              )}
            </div>
          </div>

          {/* right: CTAs */}
          <div className="flex flex-col gap-3 lg:min-w-[240px]">
            <a
              href="#products"
              className="inline-flex items-center justify-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-bold text-black transition hover:bg-slate-100"
            >
              🛍️ Shop Eid Collection
            </a>

            <a
              href="/checkout"
              className="inline-flex items-center justify-center gap-2 rounded-full border border-white/25 bg-white/10 px-6 py-3 text-sm font-bold text-white backdrop-blur transition hover:bg-white/20"
            >
              ⚡ Quick Checkout
            </a>

            <a
              href="/payment"
              className="inline-flex items-center justify-center gap-2 rounded-full border border-white/15 bg-white/5 px-6 py-3 text-sm font-semibold text-white/80 backdrop-blur transition hover:bg-white/15"
            >
              💳 bKash Payment Guide
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
