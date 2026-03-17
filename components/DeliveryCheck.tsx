"use client";

import { useMemo, useState } from "react";

type Props = {
  compact?: boolean;
};

const COVERAGE: Record<string, { eta: string; cod: boolean }> = {
  dhaka: { eta: "1-2 days", cod: true },
  chattogram: { eta: "2-3 days", cod: true },
  cumilla: { eta: "2-4 days", cod: true },
  noakhali: { eta: "2-4 days", cod: true },
  barishal: { eta: "3-5 days", cod: true },
  rajshahi: { eta: "3-5 days", cod: true },
  rangpur: { eta: "3-5 days", cod: true },
  khulna: { eta: "3-5 days", cod: true },
  sylhet: { eta: "3-5 days", cod: true },
  sunamganj: { eta: "4-6 days", cod: false },
};

export default function DeliveryCheck({ compact = false }: Props) {
  const [area, setArea] = useState("");

  const result = useMemo(() => {
    const key = area.trim().toLowerCase();
    if (!key) return null;
    return COVERAGE[key] || { eta: "3-6 days", cod: true };
  }, [area]);

  return (
    <div className={`rounded-2xl border border-slate-200 bg-white ${compact ? "p-3" : "p-4"}`}>
      <p className="text-xs font-bold uppercase tracking-wider text-slate-500">Delivery Check</p>
      <div className="mt-2 flex flex-col gap-2 sm:flex-row">
        <input
          type="text"
          value={area}
          onChange={(e) => setArea(e.target.value)}
          placeholder="আপনার জেলা / এলাকা লিখুন"
          className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm outline-none"
        />
      </div>

      {result ? (
        <div className="mt-3 grid grid-cols-2 gap-2 text-xs">
          <div className="rounded-xl border border-cyan-200 bg-cyan-50 px-3 py-2 font-semibold text-cyan-800">
            🚚 ETA: {result.eta}
          </div>
          <div
            className={`rounded-xl border px-3 py-2 font-semibold ${
              result.cod
                ? "border-emerald-200 bg-emerald-50 text-emerald-800"
                : "border-amber-200 bg-amber-50 text-amber-800"
            }`}
          >
            {result.cod ? "✅ COD Available" : "ℹ️ COD সীমিত"}
          </div>
        </div>
      ) : null}
    </div>
  );
}
