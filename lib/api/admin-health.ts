import { getRuntimeStoreMode, setStringValue, getStringValue, deleteKey } from "@/lib/runtime-store";
import { getSupabaseAdminClient } from "@/lib/supabase-admin";
import { resolvePublicSiteUrl } from "@/lib/site-url";

export type HealthStatus = "ok" | "warn" | "error" | "skipped";

export type AdminHealthCheck = {
  id: string;
  label: string;
  status: HealthStatus;
  detail: string;
};

export type AdminHealthSnapshot = {
  overallStatus: Exclude<HealthStatus, "skipped">;
  generatedAt: string;
  checks: AdminHealthCheck[];
};

function computeOverallStatus(checks: AdminHealthCheck[]) {
  if (checks.some((item) => item.status === "error")) {
    return "error" as const;
  }

  if (checks.some((item) => item.status === "warn")) {
    return "warn" as const;
  }

  return "ok" as const;
}

async function checkSupabase(): Promise<AdminHealthCheck> {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim();
  const serviceRole = process.env.SUPABASE_SERVICE_ROLE_KEY?.trim();

  if (!url || !serviceRole) {
    return {
      id: "supabase",
      label: "Supabase",
      status: "error",
      detail: "NEXT_PUBLIC_SUPABASE_URL বা SUPABASE_SERVICE_ROLE_KEY missing.",
    };
  }

  try {
    const supabase = getSupabaseAdminClient();
    const { error } = await supabase.from("products").select("id", { head: true, count: "exact" });
    if (error) {
      return {
        id: "supabase",
        label: "Supabase",
        status: "warn",
        detail: `Connected but query warning: ${error.message}`,
      };
    }

    return {
      id: "supabase",
      label: "Supabase",
      status: "ok",
      detail: "Server credentials and database connectivity look healthy.",
    };
  } catch (error) {
    return {
      id: "supabase",
      label: "Supabase",
      status: "error",
      detail: error instanceof Error ? error.message : "Supabase check failed.",
    };
  }
}

async function checkRuntimeStore(): Promise<AdminHealthCheck> {
  const configured = Boolean(
    process.env.UPSTASH_REDIS_REST_URL?.trim() && process.env.UPSTASH_REDIS_REST_TOKEN?.trim()
  );
  const storeMode = getRuntimeStoreMode();

  if (!configured) {
    return {
      id: "runtime-store",
      label: "Upstash Redis",
      status: "skipped",
      detail: `Not configured. App is using safe ${storeMode} fallback mode.`,
    };
  }

  try {
    const key = `clothify:healthcheck:${Date.now()}`;
    await setStringValue(key, "ok", 15_000);
    const roundTrip = await getStringValue(key);
    await deleteKey(key);
    if (roundTrip !== "ok") {
      return {
        id: "runtime-store",
        label: "Upstash Redis",
        status: "warn",
        detail: `Configured but round-trip verification returned "${roundTrip || "empty"}".`,
      };
    }

    return {
      id: "runtime-store",
      label: "Upstash Redis",
      status: "ok",
      detail: `Configured and responding. Active store mode: ${storeMode}.`,
    };
  } catch (error) {
    return {
      id: "runtime-store",
      label: "Upstash Redis",
      status: "error",
      detail: error instanceof Error ? error.message : "Upstash check failed.",
    };
  }
}

function checkAdminAuth(): AdminHealthCheck {
  const username = process.env.ADMIN_USERNAME?.trim();
  const password = process.env.ADMIN_PASSWORD?.trim();
  const sessionSecret = process.env.ADMIN_SESSION_SECRET?.trim();

  if (!username || !password) {
    return {
      id: "admin-auth",
      label: "Admin Auth",
      status: "error",
      detail: "ADMIN_USERNAME অথবা ADMIN_PASSWORD missing.",
    };
  }

  if (!sessionSecret) {
    return {
      id: "admin-auth",
      label: "Admin Auth",
      status: "error",
      detail: "ADMIN_SESSION_SECRET missing. Signed admin session boot will fail until it is set.",
    };
  }

  return {
    id: "admin-auth",
    label: "Admin Auth",
    status: "ok",
    detail: "Admin credentials and signed session secret configured.",
  };
}

function checkSentry(): AdminHealthCheck {
  const serverDsn = process.env.SENTRY_DSN?.trim();
  const clientDsn = process.env.NEXT_PUBLIC_SENTRY_DSN?.trim();

  if (!serverDsn && !clientDsn) {
    return {
      id: "sentry",
      label: "Sentry",
      status: "skipped",
      detail: "Server/client DSN missing. Optional error capture is currently disabled.",
    };
  }

  if (!serverDsn || !clientDsn) {
    return {
      id: "sentry",
      label: "Sentry",
      status: "warn",
      detail: "Partial DSN configuration detected. Better set both server and client DSN.",
    };
  }

  return {
    id: "sentry",
    label: "Sentry",
    status: "ok",
    detail: "Server and client error monitoring configured.",
  };
}

function checkWhatsApp(): AdminHealthCheck {
  const enabled = (process.env.WHATSAPP_NOTIFY_ENABLED || "true").toLowerCase() !== "false";
  const webhookUrl = process.env.WHATSAPP_NOTIFY_WEBHOOK_URL?.trim();

  if (!enabled) {
    return {
      id: "whatsapp",
      label: "WhatsApp Alerts",
      status: "skipped",
      detail: "WhatsApp notifications are disabled by env toggle.",
    };
  }

  if (!webhookUrl) {
    return {
      id: "whatsapp",
      label: "WhatsApp Alerts",
      status: "warn",
      detail: "Enabled but WHATSAPP_NOTIFY_WEBHOOK_URL missing.",
    };
  }

  return {
    id: "whatsapp",
    label: "WhatsApp Alerts",
    status: "ok",
    detail: "Webhook URL configured. Smoke test can verify delivery path.",
  };
}

function checkOpenAi(): AdminHealthCheck {
  const apiKey = process.env.OPENAI_API_KEY?.trim();
  return {
    id: "openai",
    label: "OpenAI Translation",
    status: apiKey ? "ok" : "warn",
    detail: apiKey
      ? "OPENAI_API_KEY configured for better multilingual quality."
      : "OPENAI_API_KEY missing. SUMONIX will stay on best-effort fallback translation.",
  };
}

function checkSiteUrl(): AdminHealthCheck {
  const rawSiteUrl = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  const resolvedSiteUrl = resolvePublicSiteUrl(rawSiteUrl);
  return {
    id: "site-url",
    label: "Site URL",
    status: "ok",
    detail:
      rawSiteUrl && rawSiteUrl !== resolvedSiteUrl
        ? `Canonical site URL auto-resolved to ${resolvedSiteUrl} from legacy value ${rawSiteUrl}.`
        : `Canonical site URL resolved to ${resolvedSiteUrl}.`,
  };
}

function checkSupabaseAdminUi(): AdminHealthCheck {
  const enabled =
    (process.env.NEXT_PUBLIC_ENABLE_ADMIN_SUPABASE_AUTH || "false").toLowerCase() === "true";
  const allowedEmails = (process.env.ADMIN_SUPABASE_ALLOWED_EMAILS || "")
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);

  if (!enabled) {
    return {
      id: "supabase-admin-ui",
      label: "Admin Supabase Login",
      status: "skipped",
      detail: "Extra Google/OTP admin login tab is disabled.",
    };
  }

  if (allowedEmails.length === 0) {
    return {
      id: "supabase-admin-ui",
      label: "Admin Supabase Login",
      status: "warn",
      detail: "Enabled but ADMIN_SUPABASE_ALLOWED_EMAILS is empty.",
    };
  }

  return {
    id: "supabase-admin-ui",
    label: "Admin Supabase Login",
    status: "ok",
    detail: `Enabled with ${allowedEmails.length} allowed admin email(s).`,
  };
}

export async function getAdminHealthSnapshot(): Promise<AdminHealthSnapshot> {
  const checks = await Promise.all([
    checkSupabase(),
    checkRuntimeStore(),
    Promise.resolve(checkAdminAuth()),
    Promise.resolve(checkSentry()),
    Promise.resolve(checkWhatsApp()),
    Promise.resolve(checkOpenAi()),
    Promise.resolve(checkSiteUrl()),
    Promise.resolve(checkSupabaseAdminUi()),
  ]);

  return {
    overallStatus: computeOverallStatus(checks),
    generatedAt: new Date().toISOString(),
    checks,
  };
}
