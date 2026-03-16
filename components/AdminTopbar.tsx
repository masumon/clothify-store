import Link from "next/link";

export default function AdminTopbar() {
  return (
    <div className="mb-6 rounded-2xl border border-slate-200/80 bg-white/90 p-4 shadow-[0_10px_30px_-22px_rgba(2,6,23,0.6)] backdrop-blur">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
            Clothify Control Center
          </p>
          <h2 className="text-xl font-extrabold tracking-tight text-slate-900">
            Admin Panel
          </h2>
        </div>

        <div className="flex flex-wrap gap-2">
          <Link
            href="/"
            className="inline-flex items-center justify-center rounded-full border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-100"
          >
            ← Back to Website
          </Link>
          <Link
            href="/admin"
            className="inline-flex items-center justify-center rounded-full bg-teal-700 px-4 py-2 text-sm font-semibold text-white transition hover:bg-teal-800"
          >
            Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
}
