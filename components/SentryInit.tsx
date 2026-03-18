"use client";

import { useEffect } from "react";

declare global {
  interface Window {
    __clothifySentryClientReady?: boolean;
  }
}

function getClientDsn() {
  return process.env.NEXT_PUBLIC_SENTRY_DSN?.trim() || "";
}

export default function SentryInit() {
  useEffect(() => {
    const dsn = getClientDsn();
    if (!dsn || window.__clothifySentryClientReady) {
      return;
    }

    void import("@sentry/nextjs").then((Sentry) => {
      if (window.__clothifySentryClientReady) {
        return;
      }

      Sentry.init({
        dsn,
        environment:
          process.env.NEXT_PUBLIC_SENTRY_ENVIRONMENT?.trim() ||
          process.env.NODE_ENV ||
          "development",
        tracesSampleRate: Number(process.env.NEXT_PUBLIC_SENTRY_TRACES_SAMPLE_RATE || 0.2),
        sendDefaultPii: false,
      });
      window.__clothifySentryClientReady = true;
    });
  }, []);

  return null;
}
