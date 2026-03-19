"use client";

import { useEffect, useState } from "react";
import {
  PREFERENCE_EVENT,
  readSitePreferences,
  updateSitePreferences,
  type UiMode,
} from "@/lib/site-preferences";

export default function AdminUiModeSwitch() {
  const [uiMode, setUiMode] = useState<UiMode>("default");

  useEffect(() => {
    const sync = () => setUiMode(readSitePreferences().uiMode);
    sync();
    window.addEventListener(PREFERENCE_EVENT, sync);
    return () => window.removeEventListener(PREFERENCE_EVENT, sync);
  }, []);

  const setMode = (mode: UiMode) => {
    const next = updateSitePreferences({ uiMode: mode });
    setUiMode(next.uiMode);
  };

  return (
    <div className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 bg-slate-50/90 px-2 py-1.5 shadow-[0_10px_24px_-24px_rgba(2,6,23,0.8)]">
      <span className="hidden text-[10px] font-bold uppercase tracking-[0.16em] text-slate-500 sm:block">
        UI Mode
      </span>
      <div className="inline-flex rounded-xl bg-white p-1">
        <button
          type="button"
          onClick={() => setMode("default")}
          className={`rounded-lg px-2.5 py-1 text-[11px] font-semibold transition ${
            uiMode === "default"
              ? "bg-slate-900 text-white shadow-sm"
              : "text-slate-600 hover:text-slate-900"
          }`}
          title="Current / Default Existing UI"
        >
          Default
        </button>
        <button
          type="button"
          onClick={() => setMode("abo")}
          className={`rounded-lg px-2.5 py-1 text-[11px] font-semibold transition ${
            uiMode === "abo"
              ? "bg-slate-900 text-amber-300 shadow-sm"
              : "text-slate-600 hover:text-slate-900"
          }`}
          title="ABO Premium Upgraded UI"
        >
          Premium
        </button>
      </div>
    </div>
  );
}
