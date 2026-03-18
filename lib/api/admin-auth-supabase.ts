import { NextResponse } from "next/server";
import { getSupabaseAdminClient } from "@/lib/supabase-admin";
import {
  ADMIN_SESSION_TTL_SECONDS,
  createAdminSessionToken,
  setAdminSessionCookie,
} from "@/lib/admin-auth";
import { consumeFixedWindowRateLimit, getClientIp, type RateLimitResult } from "@/lib/rate-limit";

export type SupabaseBridgeDeps = {
  getAllowedEmails?: () => Set<string>;
  getAdminUsername?: () => string;
  getSupabaseUser?: (accessToken: string) => Promise<{ email?: string | null } | null>;
  createSessionToken?: typeof createAdminSessionToken;
  setSessionCookie?: typeof setAdminSessionCookie;
  consumeRateLimit?: (request: Request) => Promise<RateLimitResult>;
};

function parseAllowedEmails() {
  const fromEnv = (process.env.ADMIN_SUPABASE_ALLOWED_EMAILS || "")
    .split(",")
    .map((item) => item.trim().toLowerCase())
    .filter(Boolean);

  const adminUsername = (process.env.ADMIN_USERNAME || "").trim().toLowerCase();
  if (adminUsername.includes("@")) {
    fromEnv.push(adminUsername);
  }

  return new Set(fromEnv);
}

async function defaultGetSupabaseUser(accessToken: string) {
  const supabase = getSupabaseAdminClient();
  const { data, error } = await supabase.auth.getUser(accessToken);
  if (error) {
    return null;
  }
  return data.user ?? null;
}

function defaultGetAdminUsername() {
  return process.env.ADMIN_USERNAME?.trim() || "";
}

async function defaultSupabaseBridgeRateLimit(request: Request) {
  return consumeFixedWindowRateLimit(
    {
      namespace: "admin-supabase-bridge",
      limit: 20,
      windowMs: 60 * 1000,
    },
    getClientIp(request)
  );
}

export async function handleAdminSupabaseAuth(
  request: Request,
  deps: SupabaseBridgeDeps = {}
) {
  const getAllowedEmails = deps.getAllowedEmails || parseAllowedEmails;
  const getAdminUsername = deps.getAdminUsername || defaultGetAdminUsername;
  const getSupabaseUser = deps.getSupabaseUser || defaultGetSupabaseUser;
  const createSessionToken = deps.createSessionToken || createAdminSessionToken;
  const applySessionCookie = deps.setSessionCookie || setAdminSessionCookie;
  const consumeRateLimit = deps.consumeRateLimit || defaultSupabaseBridgeRateLimit;

  const rateLimit = await consumeRateLimit(request);
  if (!rateLimit.allowed) {
    return NextResponse.json(
      {
        error: "Too many auth bridge requests. Please wait and try again.",
        retry_after_seconds: Math.ceil(rateLimit.retryAfterMs / 1000),
      },
      { status: 429 }
    );
  }

  try {
    const body = (await request.json()) as { access_token?: string };
    const accessToken =
      typeof body.access_token === "string" ? body.access_token.trim() : "";
    if (!accessToken) {
      return NextResponse.json({ error: "Missing access token." }, { status: 400 });
    }

    const adminUser = getAdminUsername();
    if (!adminUser) {
      return NextResponse.json(
        { error: "Admin credentials are not configured on this server." },
        { status: 500 }
      );
    }

    const allowedEmails = getAllowedEmails();
    if (allowedEmails.size === 0) {
      return NextResponse.json(
        {
          error:
            "No allowed Supabase admin email is configured. Set ADMIN_SUPABASE_ALLOWED_EMAILS.",
        },
        { status: 400 }
      );
    }

    const user = await getSupabaseUser(accessToken);
    if (!user) {
      return NextResponse.json({ error: "Invalid Supabase session." }, { status: 401 });
    }

    const email = (user.email || "").trim().toLowerCase();
    if (!email || !allowedEmails.has(email)) {
      return NextResponse.json(
        { error: "Supabase account is not authorized for admin access." },
        { status: 403 }
      );
    }

    const sessionToken = await createSessionToken(
      adminUser,
      ADMIN_SESSION_TTL_SECONDS
    );
    const response = NextResponse.json({ success: true });
    applySessionCookie(response, sessionToken, ADMIN_SESSION_TTL_SECONDS);
    return response;
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }
}
