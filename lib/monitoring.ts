import { NextResponse } from "next/server";
import { captureServerException } from "@/lib/sentry";
import {
  getListRange,
  getRuntimeStoreMode,
  pushListValue,
  trimList,
} from "@/lib/runtime-store";

const ROUTE_METRICS_KEY = "clothify:observability:route-metrics";
const WEBHOOK_LOGS_KEY = "clothify:observability:webhook-deliveries";
const MAX_ROUTE_METRICS = 800;
const MAX_WEBHOOK_LOGS = 240;

export type RouteMetricRecord = {
  routeId: string;
  method: string;
  status: number;
  durationMs: number;
  ok: boolean;
  at: string;
  error?: string;
};

export type WebhookDeliveryRecord = {
  channel: "whatsapp";
  eventType: string;
  title: string;
  status: "success" | "failed" | "skipped";
  durationMs: number;
  statusCode?: number;
  error?: string;
  at: string;
};

function nowIso() {
  return new Date().toISOString();
}

function sanitizeError(value: string | undefined) {
  if (!value) return undefined;
  return value.replace(/\b(\+?880|0)?1[3-9]\d{8}\b/g, "[phone]").slice(0, 180);
}

async function appendJsonLog<T>(key: string, payload: T, maxItems: number) {
  await pushListValue(key, JSON.stringify(payload));
  await trimList(key, 0, maxItems - 1);
}

async function readJsonLogs<T>(key: string, maxItems: number) {
  const items = await getListRange(key, 0, maxItems - 1);
  return items.reduce<T[]>((acc, raw) => {
    try {
      const parsed = JSON.parse(raw) as T;
      acc.push(parsed);
    } catch {
      // Ignore malformed rows to keep dashboard resilient.
    }
    return acc;
  }, []);
}

function percentile(values: number[], target: number) {
  if (values.length === 0) return 0;
  const sorted = values.slice().sort((left, right) => left - right);
  const index = Math.min(sorted.length - 1, Math.max(0, Math.ceil((target / 100) * sorted.length) - 1));
  return sorted[index] || 0;
}

function average(values: number[]) {
  if (values.length === 0) return 0;
  return values.reduce((sum, value) => sum + value, 0) / values.length;
}

export async function recordRouteMetric(metric: Omit<RouteMetricRecord, "at"> & { at?: string }) {
  await appendJsonLog(
    ROUTE_METRICS_KEY,
    {
      ...metric,
      at: metric.at || nowIso(),
      error: sanitizeError(metric.error),
    } satisfies RouteMetricRecord,
    MAX_ROUTE_METRICS
  );
}

export async function recordWebhookDelivery(
  delivery: Omit<WebhookDeliveryRecord, "at"> & { at?: string }
) {
  await appendJsonLog(
    WEBHOOK_LOGS_KEY,
    {
      ...delivery,
      at: delivery.at || nowIso(),
      error: sanitizeError(delivery.error),
    } satisfies WebhookDeliveryRecord,
    MAX_WEBHOOK_LOGS
  );
}

export function withMonitoredRoute(
  routeId: string,
  handler: (request: Request) => Promise<Response>
) {
  return async function monitoredRoute(request: Request) {
    const startedAt = Date.now();

    try {
      const response = await handler(request);
      const durationMs = Date.now() - startedAt;
      response.headers.set("x-clothify-latency-ms", String(durationMs));
      void recordRouteMetric({
        routeId,
        method: request.method,
        status: response.status,
        durationMs,
        ok: response.status < 500,
      });
      return response;
    } catch (error) {
      const durationMs = Date.now() - startedAt;
      captureServerException(error, {
        tags: {
          route_id: routeId,
          request_method: request.method,
        },
        extras: {
          durationMs,
        },
      });
      void recordRouteMetric({
        routeId,
        method: request.method,
        status: 500,
        durationMs,
        ok: false,
        error: error instanceof Error ? error.message : "unknown error",
      });

      const response = NextResponse.json(
        { error: "Internal server error" },
        { status: 500 }
      );
      response.headers.set("x-clothify-latency-ms", String(durationMs));
      return response;
    }
  };
}

export async function getObservabilitySnapshot() {
  const routeMetrics = await readJsonLogs<RouteMetricRecord>(ROUTE_METRICS_KEY, 240);
  const webhookLogs = await readJsonLogs<WebhookDeliveryRecord>(WEBHOOK_LOGS_KEY, 80);
  const durations = routeMetrics.map((item) => item.durationMs);
  const failures = routeMetrics.filter((item) => item.status >= 500);
  const throttled = routeMetrics.filter((item) => item.status === 429);

  const routeSummaries = Array.from(
    routeMetrics.reduce((map, item) => {
      const current = map.get(item.routeId) || {
        routeId: item.routeId,
        count: 0,
        errorCount: 0,
        latestStatus: item.status,
        latestAt: item.at,
        durations: [] as number[],
      };
      current.count += 1;
      current.latestStatus = item.status;
      current.latestAt = item.at;
      current.durations.push(item.durationMs);
      if (item.status >= 500) {
        current.errorCount += 1;
      }
      map.set(item.routeId, current);
      return map;
    }, new Map<string, {
      routeId: string;
      count: number;
      errorCount: number;
      latestStatus: number;
      latestAt: string;
      durations: number[];
    }>())
  )
    .map(([, item]) => ({
      routeId: item.routeId,
      count: item.count,
      errorCount: item.errorCount,
      latestStatus: item.latestStatus,
      latestAt: item.latestAt,
      avgLatencyMs: Math.round(average(item.durations)),
      p95LatencyMs: Math.round(percentile(item.durations, 95)),
    }))
    .sort((left, right) => right.p95LatencyMs - left.p95LatencyMs)
    .slice(0, 6);

  const webhookDurations = webhookLogs
    .filter((item) => item.status === "success")
    .map((item) => item.durationMs);

  return {
    storeMode: getRuntimeStoreMode(),
    sentryEnabled: Boolean(
      process.env.SENTRY_DSN?.trim() || process.env.NEXT_PUBLIC_SENTRY_DSN?.trim()
    ),
    routeSummary: {
      requestCount: routeMetrics.length,
      errorCount: failures.length,
      throttledCount: throttled.length,
      avgLatencyMs: Math.round(average(durations)),
      p95LatencyMs: Math.round(percentile(durations, 95)),
      recentFailures: failures.slice(0, 5),
      topRoutes: routeSummaries,
    },
    webhookSummary: {
      total: webhookLogs.length,
      successCount: webhookLogs.filter((item) => item.status === "success").length,
      failedCount: webhookLogs.filter((item) => item.status === "failed").length,
      skippedCount: webhookLogs.filter((item) => item.status === "skipped").length,
      avgDeliveryMs: Math.round(average(webhookDurations)),
      recent: webhookLogs.slice(0, 6),
    },
  };
}
