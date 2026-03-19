"use client";

import { useEffect, useMemo, useState } from "react";
import AppIcon from "@/components/AppIcon";
import { getDictionary } from "@/lib/i18n";
import {
  type Language,
  PREFERENCE_EVENT,
  readSitePreferences,
} from "@/lib/site-preferences";

type Props = {
  totalProducts: number;
  totalOrders: number;
  totalPending: number;
  totalRevenue: number;
};

export default function AdminStats({
  totalProducts,
  totalOrders,
  totalPending,
  totalRevenue,
}: Props) {
  const [lang, setLang] = useState<Language>("bn");

  useEffect(() => {
    const syncLanguage = () => setLang(readSitePreferences().language);
    syncLanguage();
    window.addEventListener(PREFERENCE_EVENT, syncLanguage);
    return () => window.removeEventListener(PREFERENCE_EVENT, syncLanguage);
  }, []);

  const dict = getDictionary(lang);
  const cards = useMemo(
    () => [
      {
        label: dict.admin.monthlyRevenue,
        value: `৳${Math.round(totalRevenue).toLocaleString("en-BD")}`,
        icon: "revenue" as const,
        iconTone: "bg-amber-100 text-amber-700",
        borderTone: "border-amber-200/70",
      },
      {
        label: dict.admin.totalOrders,
        value: totalOrders.toLocaleString("en-BD"),
        icon: "packageOpen" as const,
        iconTone: "bg-sky-100 text-sky-700",
        borderTone: "border-sky-200/70",
      },
      {
        label: dict.admin.pendingDelivery,
        value: totalPending.toLocaleString("en-BD"),
        icon: "truck" as const,
        iconTone: "bg-rose-100 text-rose-700",
        borderTone: "border-rose-200/70",
      },
      {
        label: dict.admin.productCatalogShort,
        value: totalProducts.toLocaleString("en-BD"),
        icon: "shirt" as const,
        iconTone: "bg-emerald-100 text-emerald-700",
        borderTone: "border-emerald-200/70",
      },
    ],
    [dict.admin.monthlyRevenue, dict.admin.pendingDelivery, dict.admin.productCatalogShort, dict.admin.totalOrders, totalOrders, totalPending, totalProducts, totalRevenue]
  );

  return (
    <div className="mb-8 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
      {cards.map((card) => (
        <div
          key={card.label}
          className={`rounded-[26px] border bg-white/95 p-5 shadow-[0_18px_40px_-32px_rgba(2,6,23,0.5)] transition hover:-translate-y-0.5 hover:shadow-[0_24px_46px_-34px_rgba(2,6,23,0.58)] ${card.borderTone}`}
        >
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.15em] text-slate-500">{card.label}</p>
              <h3 className="mt-2 text-2xl font-black tracking-tight text-slate-900">{card.value}</h3>
            </div>
            <span className={`inline-flex h-11 w-11 items-center justify-center rounded-[18px] ${card.iconTone}`}>
              <AppIcon name={card.icon} className="h-5 w-5" />
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}
