"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import AppIcon from "@/components/AppIcon";
import AdminUiModeSwitch from "@/components/AdminUiModeSwitch";
import { getDictionary } from "@/lib/i18n";
import {
  type Language,
  PREFERENCE_EVENT,
  readSitePreferences,
} from "@/lib/site-preferences";

export default function AdminTopbar() {
  const router = useRouter();
  const [loggingOut, setLoggingOut] = useState(false);
  const [lang, setLang] = useState<Language>("bn");

  const handleLogout = async () => {
    try {
      setLoggingOut(true);
      await fetch("/api/admin/auth", { method: "DELETE" });
    } finally {
      router.replace("/admin/login");
      router.refresh();
    }
  };

  const today = new Date().toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
  const dict = getDictionary(lang);

  useEffect(() => {
    const syncLanguage = () => setLang(readSitePreferences().language);
    syncLanguage();
    window.addEventListener(PREFERENCE_EVENT, syncLanguage);
    return () => window.removeEventListener(PREFERENCE_EVENT, syncLanguage);
  }, []);

  return (
    <div className="mb-6 rounded-2xl border border-slate-200 bg-white p-4 shadow-[0_16px_40px_-32px_rgba(2,6,23,0.45)]">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex items-center gap-3">
          <div className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-slate-100 text-slate-700">
            <AppIcon name="chart" className="h-5 w-5" />
          </div>
          <div>
            <h2 className="text-lg font-extrabold text-slate-900">{dict.admin.dashboardOverview}</h2>
            <p className="text-xs font-semibold text-slate-500">{today} | {dict.admin.locationSylhet}</p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <AdminUiModeSwitch />

          <span className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-slate-300 bg-white text-slate-700">
            <AppIcon name="bell" className="h-4.5 w-4.5" />
          </span>

          <span className="inline-flex items-center gap-2 rounded-full border border-slate-300 bg-white px-3 py-2 text-xs font-semibold text-slate-700">
            <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-slate-900 text-[10px] font-bold text-white">
              SO
            </span>
            Sumon (Owner)
          </span>

          <Link
            href="/"
            className="inline-flex items-center justify-center rounded-full border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-100"
          >
            <AppIcon name="external" className="mr-1.5 h-4 w-4" />
            {dict.admin.viewLiveSite}
          </Link>
          <button
            type="button"
            onClick={handleLogout}
            disabled={loggingOut}
            className="inline-flex items-center justify-center rounded-full bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:opacity-60"
          >
            <AppIcon name="logout" className="mr-1.5 h-4 w-4" />
            {loggingOut ? `${dict.admin.logout}...` : dict.admin.logout}
          </button>
        </div>
      </div>
    </div>
  );
}
