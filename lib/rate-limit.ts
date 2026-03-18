import {
  deleteKey,
  getRemainingTtlMs,
  getRuntimeStoreMode,
  incrementValue,
  setKeyExpiry,
  setStringValue,
} from "@/lib/runtime-store";

type FixedWindowPolicy = {
  namespace: string;
  limit: number;
  windowMs: number;
};

type LockoutPolicy = {
  namespace: string;
  maxFailures: number;
  windowMs: number;
  blockDurationMs: number;
};

export type RateLimitResult = {
  allowed: boolean;
  current: number;
  remaining: number;
  retryAfterMs: number;
  limit: number;
  storeMode: ReturnType<typeof getRuntimeStoreMode>;
};

export type LockoutState = {
  blocked: boolean;
  retryAfterMs: number;
  remainingFailures: number;
  storeMode: ReturnType<typeof getRuntimeStoreMode>;
};

function normalizePart(value: string) {
  const normalized = value.trim().toLowerCase().replace(/[^a-z0-9._:@-]+/g, "-");
  return normalized.slice(0, 160) || "unknown";
}

function buildCounterKey(namespace: string, key: string) {
  return `clothify:ratelimit:${normalizePart(namespace)}:${normalizePart(key)}:count`;
}

function buildFailureKey(namespace: string, key: string) {
  return `clothify:ratelimit:${normalizePart(namespace)}:${normalizePart(key)}:failures`;
}

function buildBlockKey(namespace: string, key: string) {
  return `clothify:ratelimit:${normalizePart(namespace)}:${normalizePart(key)}:blocked`;
}

export function getClientIp(request: Request) {
  const forwarded = request.headers.get("x-forwarded-for") || "";
  const first = forwarded.split(",")[0]?.trim();
  return first || request.headers.get("x-real-ip") || "unknown";
}

export async function consumeFixedWindowRateLimit(policy: FixedWindowPolicy, key: string) {
  const counterKey = buildCounterKey(policy.namespace, key);
  const current = await incrementValue(counterKey);
  if (current === 1) {
    await setKeyExpiry(counterKey, policy.windowMs);
  }

  const retryAfterMs = Math.max(0, await getRemainingTtlMs(counterKey));
  return {
    allowed: current <= policy.limit,
    current,
    remaining: Math.max(0, policy.limit - current),
    retryAfterMs: current > policy.limit ? retryAfterMs : 0,
    limit: policy.limit,
    storeMode: getRuntimeStoreMode(),
  } satisfies RateLimitResult;
}

export async function getLockoutState(policy: LockoutPolicy, key: string) {
  const blockKey = buildBlockKey(policy.namespace, key);
  const retryAfterMs = Math.max(0, await getRemainingTtlMs(blockKey));
  return {
    blocked: retryAfterMs > 0,
    retryAfterMs,
    remainingFailures: policy.maxFailures,
    storeMode: getRuntimeStoreMode(),
  } satisfies LockoutState;
}

export async function registerLockoutFailure(policy: LockoutPolicy, key: string) {
  const failureKey = buildFailureKey(policy.namespace, key);
  const blockKey = buildBlockKey(policy.namespace, key);

  const current = await incrementValue(failureKey);
  if (current === 1) {
    await setKeyExpiry(failureKey, policy.windowMs);
  }

  if (current >= policy.maxFailures) {
    await setStringValue(blockKey, "1", policy.blockDurationMs);
    await deleteKey(failureKey);
    return {
      blocked: true,
      retryAfterMs: policy.blockDurationMs,
      remainingFailures: 0,
      storeMode: getRuntimeStoreMode(),
    } satisfies LockoutState;
  }

  const retryAfterMs = Math.max(0, await getRemainingTtlMs(failureKey));
  return {
    blocked: false,
    retryAfterMs,
    remainingFailures: Math.max(0, policy.maxFailures - current),
    storeMode: getRuntimeStoreMode(),
  } satisfies LockoutState;
}

export async function clearLockoutFailures(policy: LockoutPolicy, key: string) {
  await deleteKey(buildFailureKey(policy.namespace, key));
}
