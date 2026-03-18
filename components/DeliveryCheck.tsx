"use client";

import { useEffect, useMemo, useState } from "react";
import {
  allDistricts,
  getDivisionOfDistrict,
} from "@bangladeshi/bangladesh-address/build/src/district/index";
import { upazilaNamesOf } from "@bangladeshi/bangladesh-address/build/src/upazila/index";
import {
  type Language,
  PREFERENCE_EVENT,
  readSitePreferences,
} from "@/lib/site-preferences";

type Props = {
  compact?: boolean;
};

const DISTRICTS = allDistricts().slice().sort((a, b) => a.localeCompare(b));

const DIVISION_COVERAGE: Record<
  string,
  { eta: string; cod: boolean; courier: string; etaBn: string; courierBn: string }
> = {
  Dhaka: {
    eta: "1-2 days",
    cod: true,
    courier: "Pathao, RedX, Steadfast",
    etaBn: "১-২ দিন",
    courierBn: "Pathao, RedX, Steadfast",
  },
  Chattogram: {
    eta: "2-3 days",
    cod: true,
    courier: "RedX, Sundarban",
    etaBn: "২-৩ দিন",
    courierBn: "RedX, Sundarban",
  },
  Mymensingh: {
    eta: "2-4 days",
    cod: true,
    courier: "Sundarban, SA Paribahan",
    etaBn: "২-৪ দিন",
    courierBn: "Sundarban, SA Paribahan",
  },
  Khulna: {
    eta: "3-5 days",
    cod: true,
    courier: "Steadfast, Sundarban",
    etaBn: "৩-৫ দিন",
    courierBn: "Steadfast, Sundarban",
  },
  Rajshahi: {
    eta: "3-5 days",
    cod: true,
    courier: "Steadfast, Sundarban",
    etaBn: "৩-৫ দিন",
    courierBn: "Steadfast, Sundarban",
  },
  Rangpur: {
    eta: "3-5 days",
    cod: true,
    courier: "Steadfast, Sundarban",
    etaBn: "৩-৫ দিন",
    courierBn: "Steadfast, Sundarban",
  },
  Sylhet: {
    eta: "3-5 days",
    cod: true,
    courier: "Steadfast, Sundarban",
    etaBn: "৩-৫ দিন",
    courierBn: "Steadfast, Sundarban",
  },
  Barisal: {
    eta: "3-6 days",
    cod: true,
    courier: "Steadfast, Sundarban",
    etaBn: "৩-৬ দিন",
    courierBn: "Steadfast, Sundarban",
  },
};

const FALLBACK_COVERAGE = {
  eta: "3-6 days",
  cod: true,
  courier: "Sundarban, Steadfast",
  etaBn: "৩-৬ দিন",
  courierBn: "Sundarban, Steadfast",
};

const DIVISION_ALIASES: Record<string, string> = {
  Barishal: "Barisal",
  Chittagong: "Chattogram",
};

function normalizeDivisionName(value: string) {
  const key = value.trim();
  return DIVISION_ALIASES[key] || key;
}

export default function DeliveryCheck({ compact = false }: Props) {
  const [district, setDistrict] = useState("");
  const [upazila, setUpazila] = useState("");
  const [lang, setLang] = useState<Language>("bn");

  useEffect(() => {
    const sync = () => setLang(readSitePreferences().language);
    sync();
    window.addEventListener(PREFERENCE_EVENT, sync);
    return () => window.removeEventListener(PREFERENCE_EVENT, sync);
  }, []);

  const upazilaOptions = useMemo(() => {
    if (!district) return [] as string[];
    return upazilaNamesOf(district).slice().sort((a, b) => a.localeCompare(b));
  }, [district]);

  const coverage = useMemo(() => {
    if (!district) return null;
    const division = normalizeDivisionName(getDivisionOfDistrict(district) || "");
    return DIVISION_COVERAGE[division] || FALLBACK_COVERAGE;
  }, [district]);

  const isBn = lang === "bn";

  return (
    <div className={`rounded-2xl border border-slate-200 bg-white ${compact ? "p-3" : "p-4"}`}>
      <p className="text-xs font-bold uppercase tracking-wider text-slate-500">
        {isBn ? "ডেলিভারি চেক" : "Delivery Check"}
      </p>
      <div className="mt-2 flex flex-col gap-2 sm:flex-row">
        <select
          value={district}
          onChange={(e) => {
            setDistrict(e.target.value);
            setUpazila("");
          }}
          className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm outline-none"
          aria-label={isBn ? "জেলা নির্বাচন" : "Select district"}
        >
          <option value="">{isBn ? "জেলা নির্বাচন করুন" : "Select district"}</option>
          {DISTRICTS.map((d) => (
            <option key={d} value={d}>
              {d}
            </option>
          ))}
        </select>

        {district && (
          <select
            value={upazila}
            onChange={(e) => setUpazila(e.target.value)}
            className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm outline-none"
            aria-label={isBn ? "উপজেলা নির্বাচন" : "Select upazila"}
          >
            <option value="">{isBn ? "উপজেলা নির্বাচন করুন" : "Select upazila"}</option>
            {upazilaOptions.map((u) => (
              <option key={u} value={u}>
                {u}
              </option>
            ))}
          </select>
        )}
      </div>

      {coverage ? (
        <div className="mt-3 grid grid-cols-1 gap-2 text-xs sm:grid-cols-3">
          <div className="rounded-xl border border-cyan-200 bg-cyan-50 px-3 py-2 font-semibold text-cyan-800">
            🚚 ETA: {isBn ? coverage.etaBn : coverage.eta}
          </div>
          <div
            className={`rounded-xl border px-3 py-2 font-semibold ${
              coverage.cod
                ? "border-emerald-200 bg-emerald-50 text-emerald-800"
                : "border-amber-200 bg-amber-50 text-amber-800"
            }`}
          >
            {coverage.cod
              ? isBn
                ? "✅ COD Available"
                : "✅ COD Available"
              : isBn
                ? "ℹ️ COD সীমিত"
                : "ℹ️ COD limited"}
          </div>
          <div className="rounded-xl border border-indigo-200 bg-indigo-50 px-3 py-2 font-semibold text-indigo-800">
            🚚 {isBn ? "কুরিয়ার" : "Courier"}: {isBn ? coverage.courierBn : coverage.courier}
          </div>
        </div>
      ) : null}
    </div>
  );
}
