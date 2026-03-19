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
    <div className="mb-6 rounded-[28px] border border-slate-200/80 bg-white/90 p-4 shadow-[0_20px_45px_-34px_rgba(2,6,23,0.55)] backdrop-blur">
      <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
        <div className="flex items-start gap-3">
          <div className="inline-flex h-12 w-12 items-center justify-center rounded-[18px] border border-slate-200 bg-slate-50 text-slate-700">
            <AppIcon name="dashboard" className="h-5 w-5" />
          </div>
          <div>
            <h2 className="text-xl font-black tracking-tight text-slate-900">{dict.admin.dashboardOverview}</h2>
            <p className="mt-1 text-sm text-slate-500">
              {today} | {dict.admin.locationSylhet}
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <AdminUiModeSwitch />

          <span className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-700 shadow-sm">
            <AppIcon name="bell" className="h-4.5 w-4.5" />
          </span>

          <span className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 shadow-sm">
            <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-slate-900 text-[10px] font-bold text-white">
              SO
            </span>
            Sumon (Owner)
          </span>

          <Link
            href="/"
            className="inline-flex items-center justify-center rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
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
