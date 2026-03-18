import { NextResponse } from "next/server";
import {
  ADMIN_SESSION_TTL_SECONDS,
  clearAdminSessionCookie,
  createAdminSessionToken,
  setAdminSessionCookie,
} from "@/lib/admin-auth";
import { withMonitoredRoute } from "@/lib/monitoring";
import {
  clearLockoutFailures,
  getClientIp,
  getLockoutState,
  registerLockoutFailure,
} from "@/lib/rate-limit";
import { sendWhatsAppNotification } from "@/lib/whatsapp-notify";

const authLockoutPolicy = {
  namespace: "admin-password-auth",
  maxFailures: 8,
  windowMs: 10 * 60 * 1000,
  blockDurationMs: 15 * 60 * 1000,
} as const;

type AdminAuthDeps = {
  createSessionToken?: typeof createAdminSessionToken;
  setSessionCookie?: typeof setAdminSessionCookie;
  clearFailures?: (key: string) => Promise<void>;
  getBlockState?: (key: string) => ReturnType<typeof getLockoutState>;
  registerFailure?: (key: string) => ReturnType<typeof registerLockoutFailure>;
  notify?: typeof sendWhatsAppNotification;
};

function buildRateKey(request: Request, username: string) {
  return `${getClientIp(request)}:${username.toLowerCase().trim() || "unknown-user"}`;
}

function safeCompare(left: string, right: string) {
  if (left.length !== right.length) return false;
  let diff = 0;
  for (let i = 0; i < left.length; i += 1) {
    diff |= left.charCodeAt(i) ^ right.charCodeAt(i);
  }
  return diff === 0;
}

async function defaultGetBlockState(key: string) {
  return getLockoutState(authLockoutPolicy, key);
}

async function defaultRegisterFailure(key: string) {
  return registerLockoutFailure(authLockoutPolicy, key);
}

async function defaultClearFailures(key: string) {
  await clearLockoutFailures(authLockoutPolicy, key);
}

async function handleAdminPasswordAuth(
  request: Request,
  deps: AdminAuthDeps = {}
) {
  const createSessionToken = deps.createSessionToken || createAdminSessionToken;
  const applySessionCookie = deps.setSessionCookie || setAdminSessionCookie;
  const clearFailures = deps.clearFailures || defaultClearFailures;
  const getBlockState = deps.getBlockState || defaultGetBlockState;
  const registerFailure = deps.registerFailure || defaultRegisterFailure;
  const notify = deps.notify || sendWhatsAppNotification;

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
    const blockState = await getBlockState(rateKey);
    if (blockState.blocked) {
      return NextResponse.json(
        {
          error: "Too many failed login attempts. Please wait and try again.",
          retry_after_seconds: Math.ceil(blockState.retryAfterMs / 1000),
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
      const failure = await registerFailure(rateKey);
      if (failure.blocked) {
        const clientIp = getClientIp(request);
        const retryAfter = Math.max(1, Math.ceil(failure.retryAfterMs / 1000));
        void notify({
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

    await clearFailures(rateKey);
    const sessionValue = await createSessionToken(adminUser, ADMIN_SESSION_TTL_SECONDS);

    const response = NextResponse.json({ success: true });
    applySessionCookie(response, sessionValue, ADMIN_SESSION_TTL_SECONDS);
    return response;
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }
}

async function handleAdminLogout() {
  const response = NextResponse.json({ success: true });
  clearAdminSessionCookie(response);
  return response;
}

export const POST = withMonitoredRoute("api.admin.auth.password", (request) =>
  handleAdminPasswordAuth(request)
);

export const DELETE = withMonitoredRoute("api.admin.auth.logout", async () =>
  handleAdminLogout()
);
