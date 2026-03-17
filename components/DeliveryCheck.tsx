"use client";

import { useMemo, useState } from "react";


type Props = {
  compact?: boolean;
};

const DISTRICTS = [
  "Dhaka", "Chattogram", "Cumilla", "Noakhali", "Barishal", "Rajshahi", "Rangpur", "Khulna", "Sylhet", "Sunamganj"
];
const UPAZILAS: Record<string, string[]> = {
  Dhaka: ["Dhanmondi", "Mirpur", "Uttara", "Motijheel"],
  Chattogram: ["Pahartali", "Kotwali", "Anwara"],
  Cumilla: ["Cumilla Sadar", "Debidwar"],
  Noakhali: ["Noakhali Sadar", "Begumganj"],
  Barishal: ["Barishal Sadar", "Uzirpur"],
  Rajshahi: ["Rajshahi Sadar", "Paba"],
  Rangpur: ["Rangpur Sadar", "Pirganj"],
  Khulna: ["Khulna Sadar", "Batiaghata"],
  Sylhet: ["Sylhet Sadar", "Beanibazar"],
  Sunamganj: ["Sunamganj Sadar", "Jagannathpur"],
};
const COVERAGE: Record<string, { eta: string; cod: boolean; courier: string }> = {
  dhaka: { eta: "1-2 days", cod: true, courier: "Pathao, RedX" },
  chattogram: { eta: "2-3 days", cod: true, courier: "RedX, Sundarban" },
  cumilla: { eta: "2-4 days", cod: true, courier: "Sundarban, SA Paribahan" },
  noakhali: { eta: "2-4 days", cod: true, courier: "Sundarban, SA Paribahan" },
  barishal: { eta: "3-5 days", cod: true, courier: "Steadfast, Sundarban" },
  rajshahi: { eta: "3-5 days", cod: true, courier: "Steadfast, Sundarban" },
  rangpur: { eta: "3-5 days", cod: true, courier: "Steadfast, Sundarban" },
  khulna: { eta: "3-5 days", cod: true, courier: "Steadfast, Sundarban" },
  sylhet: { eta: "3-5 days", cod: true, courier: "Steadfast, Sundarban" },
  sunamganj: { eta: "4-6 days", cod: false, courier: "Steadfast" },
};

export default function DeliveryCheck({ compact = false }: Props) {
  const [district, setDistrict] = useState("");
  const [upazila, setUpazila] = useState("");

  const upazilaOptions = district ? UPAZILAS[district] || [] : [];

  const result = useMemo(() => {
    const key = district.trim().toLowerCase();
    if (!key) return null;
    return COVERAGE[key] || { eta: "3-6 days", cod: true, courier: "Sundarban" };
  }, [district]);

  return (
    <div className={`rounded-2xl border border-slate-200 bg-white ${compact ? "p-3" : "p-4"}`}>
      <p className="text-xs font-bold uppercase tracking-wider text-slate-500">Delivery Check</p>
      <div className="mt-2 flex flex-col gap-2 sm:flex-row">
        <select
          value={district}
          onChange={e => { setDistrict(e.target.value); setUpazila(""); }}
          className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm outline-none"
        >
          <option value="">জেলা নির্বাচন করুন</option>
          {DISTRICTS.map(d => (
            <option key={d} value={d}>{d}</option>
          ))}
        </select>
        {district && (
          <select
            value={upazila}
            onChange={e => setUpazila(e.target.value)}
            className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm outline-none"
          >
            <option value="">উপজেলা নির্বাচন করুন</option>
            {upazilaOptions.map(u => (
              <option key={u} value={u}>{u}</option>
            ))}
          </select>
        )}
      </div>

      {result ? (
        <div className="mt-3 grid grid-cols-3 gap-2 text-xs">
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
          <div className="rounded-xl border border-indigo-200 bg-indigo-50 px-3 py-2 font-semibold text-indigo-800">
            🚚 Courier: {result.courier}
          </div>
        </div>
      ) : null}
    </div>
  );
}
