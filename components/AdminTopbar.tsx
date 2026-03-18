"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

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

  return (
    <div className="mb-6 rounded-2xl border border-slate-700 bg-slate-900/80 p-4 shadow-[0_14px_30px_-22px_rgba(0,0,0,0.9)] backdrop-blur">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-emerald-300">
            Clothify Control Center
          </p>
          <h2 className="text-xl font-extrabold tracking-tight text-white">
            Admin Panel
          </h2>
        </div>

        <div className="flex flex-wrap gap-2">
          <span className="inline-flex items-center justify-center rounded-full border border-orange-400/60 bg-orange-500/10 px-3 py-2 text-xs font-bold text-orange-300">
            Live Analytics
          </span>
          <Link
            href="/"
            className="inline-flex items-center justify-center rounded-full border border-slate-600 bg-slate-800 px-4 py-2 text-sm font-semibold text-slate-100 transition hover:bg-slate-700"
          >
            ← Back to Website
          </Link>
          <button
            type="button"
            onClick={handleLogout}
            disabled={loggingOut}
            className="inline-flex items-center justify-center rounded-full bg-rose-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-rose-500 disabled:opacity-60"
          >
            {loggingOut ? "Logging out..." : "Logout"}
          </button>
        </div>
      </div>
    </div>
  );
}
