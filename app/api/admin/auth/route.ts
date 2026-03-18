import { NextResponse } from "next/server";
import {
  ADMIN_SESSION_TTL_SECONDS,
  clearAdminSessionCookie,
  createAdminSessionToken,
  setAdminSessionCookie,
} from "@/lib/admin-auth";
import { sendWhatsAppNotification } from "@/lib/whatsapp-notify";

type RateBucket = {
  failedAttempts: number;
  windowResetAt: number;
  blockedUntil: number;
};

const ATTEMPT_WINDOW_MS = 10 * 60 * 1000;
const MAX_FAILED_ATTEMPTS = 8;
const BLOCK_DURATION_MS = 15 * 60 * 1000;

const globalAuthRateState = globalThis as unknown as {
  __clothifyAdminAuthRateStore?: Map<string, RateBucket>;
};

if (!globalAuthRateState.__clothifyAdminAuthRateStore) {
  globalAuthRateState.__clothifyAdminAuthRateStore = new Map<string, RateBucket>();
}

function getClientIp(request: Request) {
  const forwarded = request.headers.get("x-forwarded-for") || "";
  const fromForwarded = forwarded.split(",")[0]?.trim();
  return fromForwarded || request.headers.get("x-real-ip") || "unknown";
}

function buildRateKey(request: Request, username: string) {
  return `${getClientIp(request)}:${username.toLowerCase().trim() || "unknown-user"}`;
}

function readRateBucket(key: string) {
  const now = Date.now();
  const store = globalAuthRateState.__clothifyAdminAuthRateStore!;
  const current = store.get(key);

  if (!current || now > current.windowResetAt) {
    const fresh: RateBucket = {
      failedAttempts: 0,
      windowResetAt: now + ATTEMPT_WINDOW_MS,
      blockedUntil: 0,
    };
    store.set(key, fresh);
    return fresh;
  }

  return current;
}

function getBlockRemainingMs(bucket: RateBucket) {
  const now = Date.now();
  return bucket.blockedUntil > now ? bucket.blockedUntil - now : 0;
}

function registerAuthFailure(key: string) {
  const bucket = readRateBucket(key);
  const store = globalAuthRateState.__clothifyAdminAuthRateStore!;
  bucket.failedAttempts += 1;
  let blocked = false;
  if (bucket.failedAttempts >= MAX_FAILED_ATTEMPTS) {
    bucket.blockedUntil = Date.now() + BLOCK_DURATION_MS;
    bucket.failedAttempts = 0;
    bucket.windowResetAt = Date.now() + ATTEMPT_WINDOW_MS;
    blocked = true;
  }
  store.set(key, bucket);
  return {
    blocked,
    blockedUntil: bucket.blockedUntil,
  };
}

function clearAuthFailures(key: string) {
  const store = globalAuthRateState.__clothifyAdminAuthRateStore!;
  store.delete(key);
}

function safeCompare(left: string, right: string) {
  if (left.length !== right.length) return false;
  let diff = 0;
  for (let i = 0; i < left.length; i += 1) {
    diff |= left.charCodeAt(i) ^ right.charCodeAt(i);
  }
  return diff === 0;
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { username, password } = body as { username?: string; password?: string };

    if (!username || !password) {
      return NextResponse.json(
        { error: "Username and password are required" },
        { status: 400 }
      );
    }

    const rateKey = buildRateKey(request, username);
    const bucket = readRateBucket(rateKey);
    const blockRemainingMs = getBlockRemainingMs(bucket);
    if (blockRemainingMs > 0) {
      return NextResponse.json(
        {
          error: "Too many failed login attempts. Please wait and try again.",
          retry_after_seconds: Math.ceil(blockRemainingMs / 1000),
        },
        { status: 429 }
      );
    }

    const adminUser = process.env.ADMIN_USERNAME;
    const adminPass = process.env.ADMIN_PASSWORD;

    if (!adminUser || !adminPass) {
      return NextResponse.json(
        { error: "Admin credentials are not configured on this server" },
        { status: 500 }
      );
    }

    if (!safeCompare(username, adminUser) || !safeCompare(password, adminPass)) {
      const failure = registerAuthFailure(rateKey);
      if (failure.blocked) {
        const clientIp = getClientIp(request);
        const retryAfter = Math.max(1, Math.ceil((failure.blockedUntil - Date.now()) / 1000));
        void sendWhatsAppNotification({
          type: "security_alert",
          title: "🚨 Security Alert: Admin Login Lockout",
          message: `Multiple failed admin login attempts detected for user "${username}" from IP ${clientIp}. Lock active for ~${retryAfter}s.`,
          metadata: {
            username,
            ip: clientIp,
            retry_after_seconds: retryAfter,
          },
        });
      }
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
    }

    clearAuthFailures(rateKey);
    const sessionValue = await createAdminSessionToken(adminUser, ADMIN_SESSION_TTL_SECONDS);

    const response = NextResponse.json({ success: true });
    setAdminSessionCookie(response, sessionValue, ADMIN_SESSION_TTL_SECONDS);

    return response;
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }
}

export async function DELETE() {
  const response = NextResponse.json({ success: true });
  clearAdminSessionCookie(response);
  return response;
}
