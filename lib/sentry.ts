import * as Sentry from "@sentry/nextjs";

type MonitoringContext = {
  tags?: Record<string, string | number | boolean | undefined>;
  extras?: Record<string, unknown>;
};

function toServerDsn() {
  return process.env.SENTRY_DSN?.trim() || process.env.NEXT_PUBLIC_SENTRY_DSN?.trim() || "";
}

export function isSentryEnabled() {
  return Boolean(toServerDsn());
}

let initialized = false;

function getEnvironment() {
  return (
    process.env.SENTRY_ENVIRONMENT?.trim() ||
    process.env.VERCEL_ENV?.trim() ||
    process.env.NODE_ENV ||
    "development"
  );
}

function toNumber(value: string | undefined, fallback: number) {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
}

function ensureSentryInitialized() {
  if (initialized || !isSentryEnabled()) {
    return;
  }

  Sentry.init({
    dsn: toServerDsn(),
    environment: getEnvironment(),
    tracesSampleRate: toNumber(process.env.SENTRY_TRACES_SAMPLE_RATE, 0.2),
    sendDefaultPii: false,
    enableLogs: false,
  });
  initialized = true;
}

export function captureServerException(error: unknown, context: MonitoringContext = {}) {
  if (!isSentryEnabled()) {
    return;
  }

  ensureSentryInitialized();
  Sentry.withScope((scope) => {
    Object.entries(context.tags || {}).forEach(([key, value]) => {
      if (value !== undefined) {
        scope.setTag(key, String(value));
      }
    });
    Object.entries(context.extras || {}).forEach(([key, value]) => {
      scope.setExtra(key, value);
    });
    Sentry.captureException(error);
  });
}

export function captureServerMessage(
  message: string,
  level: "info" | "warning" | "error" = "warning",
  context: MonitoringContext = {}
) {
  if (!isSentryEnabled()) {
    return;
  }

  ensureSentryInitialized();
  Sentry.withScope((scope) => {
    scope.setLevel(level);
    Object.entries(context.tags || {}).forEach(([key, value]) => {
      if (value !== undefined) {
        scope.setTag(key, String(value));
      }
    });
    Object.entries(context.extras || {}).forEach(([key, value]) => {
      scope.setExtra(key, value);
    });
    Sentry.captureMessage(message, level);
  });
}
