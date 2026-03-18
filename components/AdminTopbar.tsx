"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import AdminUiModeSwitch from "@/components/AdminUiModeSwitch";

export default function AdminTopbar() {
  const router = useRouter();
  const [loggingOut, setLoggingOut] = useState(false);

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

  return (
    <div className="mb-6 rounded-2xl border border-slate-200 bg-white p-4 shadow-[0_16px_40px_-32px_rgba(2,6,23,0.45)]">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex items-center gap-3">
          <div className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-slate-100 text-slate-700">
            <i className="fa-solid fa-chart-line" aria-hidden="true" />
          </div>
          <div>
            <h2 className="text-lg font-extrabold text-slate-900">Dashboard Overview</h2>
            <p className="text-xs font-semibold text-slate-500">{today} | Location: Sylhet</p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <AdminUiModeSwitch />

          <span className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-slate-300 bg-white text-slate-700">
            <i className="fa-regular fa-bell" aria-hidden="true" />
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
            <i className="fa-solid fa-arrow-up-right-from-square mr-1.5" aria-hidden="true" />
            View Live Site
          </Link>
          <button
            type="button"
            onClick={handleLogout}
            disabled={loggingOut}
            className="inline-flex items-center justify-center rounded-full bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:opacity-60"
          >
            <i className="fa-solid fa-right-from-bracket mr-1.5" aria-hidden="true" />
            {loggingOut ? "Logging out..." : "Logout"}
          </button>
        </div>
      </div>
    </div>
  );
}
