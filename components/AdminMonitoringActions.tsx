"use client";

import { useMemo, useState } from "react";
import type { AdminHealthSnapshot, HealthStatus } from "@/lib/api/admin-health";

type SmokeResult = {
  ok: boolean;
  status: "success" | "failed" | "skipped";
  durationMs: number;
  statusCode?: number;
  error?: string;
};

type AdminMonitoringActionsProps = {
  initialHealthSnapshot: AdminHealthSnapshot;
};

function tone(status: HealthStatus | SmokeResult["status"]) {
  if (status === "ok" || status === "success") return "border-emerald-200 bg-emerald-50 text-emerald-700";
  if (status === "warn" || status === "skipped") return "border-amber-200 bg-amber-50 text-amber-700";
  return "border-rose-200 bg-rose-50 text-rose-700";
}

function formatTimestamp(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return new Intl.DateTimeFormat("en-BD", {
    dateStyle: "medium",
    timeStyle: "short",
    timeZone: "Asia/Dhaka",
  }).format(date);
}

export default function AdminMonitoringActions({
  initialHealthSnapshot,
}: AdminMonitoringActionsProps) {
  const [healthSnapshot, setHealthSnapshot] = useState(initialHealthSnapshot);
  const [healthLoading, setHealthLoading] = useState(false);
  const [smokeLoading, setSmokeLoading] = useState(false);
  const [smokeResult, setSmokeResult] = useState<SmokeResult | null>(null);
  const [errorMessage, setErrorMessage] = useState("");

  const healthCounts = useMemo(() => {
    return {
      ok: healthSnapshot.checks.filter((item) => item.status === "ok").length,
      warn: healthSnapshot.checks.filter((item) => item.status === "warn").length,
      error: healthSnapshot.checks.filter((item) => item.status === "error").length,
      skipped: healthSnapshot.checks.filter((item) => item.status === "skipped").length,
    };
  }, [healthSnapshot]);

  async function runHealthCheck() {
    setHealthLoading(true);
    setErrorMessage("");

    try {
      const response = await fetch("/api/admin/health", {
        method: "GET",
        cache: "no-store",
      });
      const data = (await response.json()) as AdminHealthSnapshot;
      if (!response.ok) {
        throw new Error("Health check request failed.");
      }
      setHealthSnapshot(data);
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : "Health check failed.");
    } finally {
      setHealthLoading(false);
    }
  }

  async function runSmokeTest() {
    setSmokeLoading(true);
    setErrorMessage("");

    try {
      const response = await fetch("/api/admin/monitoring/webhook-smoke", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({}),
      });
      const data = (await response.json()) as SmokeResult;
      setSmokeResult(data);
      if (!response.ok && data.status !== "failed") {
        throw new Error("Webhook smoke test failed.");
      }
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : "Webhook smoke test failed.");
    } finally {
      setSmokeLoading(false);
    }
  }

  return (
    <div className="mt-5 rounded-2xl border border-slate-200 bg-slate-50/80 p-4">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h4 className="text-sm font-bold uppercase tracking-[0.16em] text-slate-700">
            Live Health Check
          </h4>
          <p className="mt-1 text-sm text-slate-600">
            Runtime config, Supabase connectivity, Sentry readiness, Redis status, and webhook setup.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={runHealthCheck}
            disabled={healthLoading}
            className="rounded-full border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {healthLoading ? "Running..." : "Run Health Check"}
          </button>
          <button
            type="button"
            onClick={runSmokeTest}
            disabled={smokeLoading}
            className="rounded-full border border-emerald-300 bg-emerald-50 px-4 py-2 text-sm font-semibold text-emerald-700 transition hover:bg-emerald-100 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {smokeLoading ? "Sending..." : "Send WhatsApp Smoke"}
          </button>
        </div>
      </div>

      <div className="mt-4 grid gap-3 md:grid-cols-4">
        <div className={`rounded-2xl border px-4 py-3 ${tone(healthSnapshot.overallStatus)}`}>
          <p className="text-xs font-semibold uppercase tracking-[0.14em]">Overall</p>
          <p className="mt-2 text-xl font-extrabold">{healthSnapshot.overallStatus.toUpperCase()}</p>
          <p className="mt-1 text-xs">Updated: {formatTimestamp(healthSnapshot.generatedAt)}</p>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white px-4 py-3">
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">Healthy</p>
          <p className="mt-2 text-xl font-extrabold text-emerald-700">{healthCounts.ok}</p>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white px-4 py-3">
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">Warnings</p>
          <p className="mt-2 text-xl font-extrabold text-amber-700">{healthCounts.warn}</p>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white px-4 py-3">
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">Errors</p>
          <p className="mt-2 text-xl font-extrabold text-rose-700">{healthCounts.error}</p>
          <p className="mt-1 text-xs text-slate-500">Skipped: {healthCounts.skipped}</p>
        </div>
      </div>

      <div className="mt-4 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
        {healthSnapshot.checks.map((check) => (
          <div key={check.id} className={`rounded-2xl border px-4 py-3 ${tone(check.status)}`}>
            <div className="flex items-center justify-between gap-2">
              <p className="font-semibold">{check.label}</p>
              <span className="text-[11px] font-bold uppercase">{check.status}</span>
            </div>
            <p className="mt-2 text-sm">{check.detail}</p>
          </div>
        ))}
      </div>

      {smokeResult ? (
        <div className={`mt-4 rounded-2xl border px-4 py-3 ${tone(smokeResult.status)}`}>
          <p className="font-semibold">WhatsApp Smoke Result: {smokeResult.status.toUpperCase()}</p>
          <p className="mt-1 text-sm">
            Delivery time {smokeResult.durationMs}ms
            {typeof smokeResult.statusCode === "number" ? ` • HTTP ${smokeResult.statusCode}` : ""}
          </p>
          {smokeResult.error ? <p className="mt-2 text-sm">{smokeResult.error}</p> : null}
        </div>
      ) : null}

      {errorMessage ? (
        <div className="mt-4 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
          {errorMessage}
        </div>
      ) : null}
    </div>
  );
}
