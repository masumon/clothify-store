import type { AdminHealthSnapshot } from "@/lib/api/admin-health";
import AdminMonitoringActions from "@/components/AdminMonitoringActions";

type ObservabilityPanelProps = {
  snapshot: {
    storeMode: "upstash" | "memory";
    sentryEnabled: boolean;
    routeSummary: {
      requestCount: number;
      errorCount: number;
      throttledCount: number;
      avgLatencyMs: number;
      p95LatencyMs: number;
      recentFailures: Array<{
        routeId: string;
        status: number;
        durationMs: number;
        at: string;
        error?: string;
      }>;
      topRoutes: Array<{
        routeId: string;
        count: number;
        errorCount: number;
        latestStatus: number;
        latestAt: string;
        avgLatencyMs: number;
        p95LatencyMs: number;
      }>;
    };
    webhookSummary: {
      total: number;
      successCount: number;
      failedCount: number;
      skippedCount: number;
      avgDeliveryMs: number;
      recent: Array<{
        channel: "whatsapp";
        eventType: string;
        title: string;
        status: "success" | "failed" | "skipped";
        durationMs: number;
        statusCode?: number;
        error?: string;
        at: string;
      }>;
    };
    healthSnapshot: AdminHealthSnapshot;
  };
};

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

function statusTone(status: "success" | "failed" | "skipped") {
  if (status === "success") return "bg-emerald-100 text-emerald-700";
  if (status === "failed") return "bg-rose-100 text-rose-700";
  return "bg-amber-100 text-amber-700";
}

export default function AdminObservabilityPanel({
  snapshot,
}: ObservabilityPanelProps) {
  return (
    <section className="mb-8 rounded-[28px] border border-slate-200/80 bg-white/95 p-5 shadow-[0_18px_38px_-30px_rgba(2,6,23,0.45)]">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h3 className="text-lg font-black tracking-tight text-slate-900">Production Monitoring</h3>
          <p className="mt-1 text-sm text-slate-600">
            API latency, error capture, webhook delivery health, and runtime storage mode.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <span className="rounded-full border border-slate-300 bg-slate-50 px-3 py-1 text-xs font-semibold text-slate-700">
            Rate limit store: {snapshot.storeMode === "upstash" ? "Upstash Redis" : "Memory Fallback"}
          </span>
          <span
            className={`rounded-full px-3 py-1 text-xs font-semibold ${
              snapshot.sentryEnabled
                ? "border border-emerald-300 bg-emerald-50 text-emerald-700"
                : "border border-amber-300 bg-amber-50 text-amber-700"
            }`}
          >
            Sentry: {snapshot.sentryEnabled ? "Configured" : "Needs DSN"}
          </span>
        </div>
      </div>

      <div className="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <div className="rounded-[22px] border border-slate-200 bg-slate-50/90 p-4">
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">API Requests</p>
          <p className="mt-2 text-2xl font-extrabold text-slate-900">
            {snapshot.routeSummary.requestCount}
          </p>
        </div>
        <div className="rounded-[22px] border border-cyan-200/70 bg-cyan-50/70 p-4">
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">Avg Latency</p>
          <p className="mt-2 text-2xl font-extrabold text-cyan-700">
            {snapshot.routeSummary.avgLatencyMs}ms
          </p>
          <p className="mt-1 text-xs text-slate-500">
            P95: {snapshot.routeSummary.p95LatencyMs}ms
          </p>
        </div>
        <div className="rounded-[22px] border border-rose-200/70 bg-rose-50/70 p-4">
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">API Errors</p>
          <p className="mt-2 text-2xl font-extrabold text-rose-700">
            {snapshot.routeSummary.errorCount}
          </p>
          <p className="mt-1 text-xs text-slate-500">
            Throttled: {snapshot.routeSummary.throttledCount}
          </p>
        </div>
        <div className="rounded-[22px] border border-emerald-200/70 bg-emerald-50/70 p-4">
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">Webhook Health</p>
          <p className="mt-2 text-2xl font-extrabold text-emerald-700">
            {snapshot.webhookSummary.successCount}/{snapshot.webhookSummary.total}
          </p>
          <p className="mt-1 text-xs text-slate-500">
            Avg delivery: {snapshot.webhookSummary.avgDeliveryMs}ms
          </p>
        </div>
      </div>

      <div className="mt-5 grid gap-4 xl:grid-cols-[1.2fr_0.8fr]">
        <div className="rounded-[24px] border border-slate-200 bg-slate-50/80 p-4">
          <div className="flex items-center justify-between gap-3">
            <h4 className="text-sm font-bold uppercase tracking-[0.16em] text-slate-700">
              Slowest / Busiest API Routes
            </h4>
            <span className="text-xs text-slate-500">Recent rolling window</span>
          </div>
          <div className="mt-4 overflow-x-auto">
            <table className="min-w-[560px] w-full text-sm">
              <thead>
                <tr className="border-b border-slate-200 text-left text-xs uppercase tracking-[0.12em] text-slate-500">
                  <th className="px-2 py-2">Route</th>
                  <th className="px-2 py-2">Calls</th>
                  <th className="px-2 py-2">Errors</th>
                  <th className="px-2 py-2">Avg</th>
                  <th className="px-2 py-2">P95</th>
                  <th className="px-2 py-2">Last Seen</th>
                </tr>
              </thead>
              <tbody>
                {snapshot.routeSummary.topRoutes.length === 0 ? (
                  <tr>
                    <td className="px-2 py-4 text-slate-500" colSpan={6}>
                      No API metrics yet.
                    </td>
                  </tr>
                ) : (
                  snapshot.routeSummary.topRoutes.map((route) => (
                    <tr key={route.routeId} className="border-b border-slate-100 text-slate-700">
                      <td className="px-2 py-3 font-semibold text-slate-900">{route.routeId}</td>
                      <td className="px-2 py-3">{route.count}</td>
                      <td className="px-2 py-3">{route.errorCount}</td>
                      <td className="px-2 py-3">{route.avgLatencyMs}ms</td>
                      <td className="px-2 py-3">{route.p95LatencyMs}ms</td>
                      <td className="px-2 py-3 text-xs text-slate-500">
                        {formatTimestamp(route.latestAt)}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        <div className="rounded-[24px] border border-slate-200 bg-slate-50/80 p-4">
          <h4 className="text-sm font-bold uppercase tracking-[0.16em] text-slate-700">
            Recent API Failures
          </h4>
          <ul className="mt-4 space-y-3">
            {snapshot.routeSummary.recentFailures.length === 0 ? (
              <li className="rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
                No recent 5xx failures recorded.
              </li>
            ) : (
              snapshot.routeSummary.recentFailures.map((failure) => (
                <li
                  key={`${failure.routeId}-${failure.at}`}
                  className="rounded-2xl border border-rose-200 bg-white px-4 py-3 text-sm text-slate-700"
                >
                  <p className="font-semibold text-slate-900">{failure.routeId}</p>
                  <p className="mt-1 text-xs text-slate-500">
                    {failure.status} • {failure.durationMs}ms • {formatTimestamp(failure.at)}
                  </p>
                  {failure.error ? (
                    <p className="mt-2 text-xs text-rose-700">{failure.error}</p>
                  ) : null}
                </li>
              ))
            )}
          </ul>
        </div>
      </div>

      <div className="mt-5 rounded-[24px] border border-slate-200 bg-slate-50/80 p-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h4 className="text-sm font-bold uppercase tracking-[0.16em] text-slate-700">
            WhatsApp Webhook Delivery Log
          </h4>
          <p className="text-xs text-slate-500">
            Success {snapshot.webhookSummary.successCount} • Failed {snapshot.webhookSummary.failedCount} • Skipped {snapshot.webhookSummary.skippedCount}
          </p>
        </div>
        <div className="mt-4 grid gap-3 md:grid-cols-2 xl:grid-cols-3">
          {snapshot.webhookSummary.recent.length === 0 ? (
            <p className="text-sm text-slate-500">No webhook attempts recorded yet.</p>
          ) : (
            snapshot.webhookSummary.recent.map((item) => (
              <div key={`${item.eventType}-${item.at}`} className="rounded-[22px] border border-slate-200 bg-white p-4">
                <div className="flex items-center justify-between gap-2">
                  <p className="font-semibold text-slate-900">{item.title}</p>
                  <span className={`rounded-full px-2.5 py-1 text-[11px] font-bold ${statusTone(item.status)}`}>
                    {item.status}
                  </span>
                </div>
                <p className="mt-2 text-xs uppercase tracking-[0.12em] text-slate-500">
                  {item.eventType}
                </p>
                <p className="mt-2 text-sm text-slate-700">
                  {item.durationMs}ms
                  {typeof item.statusCode === "number" ? ` • HTTP ${item.statusCode}` : ""}
                </p>
                <p className="mt-1 text-xs text-slate-500">{formatTimestamp(item.at)}</p>
                {item.error ? (
                  <p className="mt-2 text-xs text-rose-700">{item.error}</p>
                ) : null}
              </div>
            ))
          )}
        </div>
      </div>

      <AdminMonitoringActions initialHealthSnapshot={snapshot.healthSnapshot} />
    </section>
  );
}
