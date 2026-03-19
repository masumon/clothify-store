import { Redis } from "@upstash/redis";

export type RuntimeStoreMode = "upstash" | "memory";

type MemoryValue = {
  value: string;
  expiresAt: number | null;
};

type MemoryState = {
  values: Map<string, MemoryValue>;
  lists: Map<string, string[]>;
};

const globalRuntimeStore = globalThis as unknown as {
  __clothifyRuntimeStoreMemory?: MemoryState;
  __clothifyUpstashRedisClient?: Redis | null;
};

function getMemoryState() {
  if (!globalRuntimeStore.__clothifyRuntimeStoreMemory) {
    globalRuntimeStore.__clothifyRuntimeStoreMemory = {
      values: new Map<string, MemoryValue>(),
      lists: new Map<string, string[]>(),
    };
  }

  return globalRuntimeStore.__clothifyRuntimeStoreMemory;
}

function getUpstashRedis() {
  const normalizeEnvValue = (value?: string) => {
    const trimmed = value?.trim();
    if (!trimmed) return "";
    if (
      (trimmed.startsWith('"') && trimmed.endsWith('"')) ||
      (trimmed.startsWith("'") && trimmed.endsWith("'"))
    ) {
      return trimmed.slice(1, -1).trim();
    }
    return trimmed;
  };

  const url = normalizeEnvValue(process.env.UPSTASH_REDIS_REST_URL);
  const token = normalizeEnvValue(process.env.UPSTASH_REDIS_REST_TOKEN);
  if (!url || !token) {
    return null;
  }

  if (!globalRuntimeStore.__clothifyUpstashRedisClient) {
    globalRuntimeStore.__clothifyUpstashRedisClient = new Redis({ url, token });
  }

  return globalRuntimeStore.__clothifyUpstashRedisClient;
}

function pruneMemoryValue(key: string) {
  const memory = getMemoryState();
  const current = memory.values.get(key);
  if (!current) {
    return null;
  }

  if (typeof current.expiresAt === "number" && current.expiresAt <= Date.now()) {
    memory.values.delete(key);
    return null;
  }

  return current;
}

function getMemoryList(key: string) {
  const memory = getMemoryState();
  if (!memory.lists.has(key)) {
    memory.lists.set(key, []);
  }
  return memory.lists.get(key)!;
}

function normalizeRangeStop(length: number, stop: number) {
  if (length <= 0) return -1;
  if (stop < 0) {
    return Math.max(0, length + stop);
  }
  return Math.min(length - 1, stop);
}

export function getRuntimeStoreMode(): RuntimeStoreMode {
  return getUpstashRedis() ? "upstash" : "memory";
}

export async function getStringValue(key: string) {
  const redis = getUpstashRedis();
  if (redis) {
    const value = await redis.get<string | null>(key);
    return typeof value === "string" ? value : null;
  }

  return pruneMemoryValue(key)?.value ?? null;
}

export async function setStringValue(key: string, value: string, ttlMs?: number) {
  const redis = getUpstashRedis();
  if (redis) {
    if (typeof ttlMs === "number" && ttlMs > 0) {
      await redis.set(key, value, { px: ttlMs });
    } else {
      await redis.set(key, value);
    }
    return;
  }

  const memory = getMemoryState();
  memory.values.set(key, {
    value,
    expiresAt: typeof ttlMs === "number" && ttlMs > 0 ? Date.now() + ttlMs : null,
  });
}

export async function incrementValue(key: string) {
  const redis = getUpstashRedis();
  if (redis) {
    const value = await redis.incr(key);
    return Number(value || 0);
  }

  const current = Number(pruneMemoryValue(key)?.value || "0");
  const next = current + 1;
  const memory = getMemoryState();
  const existing = pruneMemoryValue(key);
  memory.values.set(key, {
    value: String(next),
    expiresAt: existing?.expiresAt ?? null,
  });
  return next;
}

export async function setKeyExpiry(key: string, ttlMs: number) {
  const redis = getUpstashRedis();
  if (redis) {
    await redis.pexpire(key, ttlMs);
    return;
  }

  const current = pruneMemoryValue(key);
  if (!current) {
    return;
  }

  const memory = getMemoryState();
  memory.values.set(key, {
    value: current.value,
    expiresAt: Date.now() + ttlMs,
  });
}

export async function getRemainingTtlMs(key: string) {
  const redis = getUpstashRedis();
  if (redis) {
    const ttl = await redis.pttl(key);
    return Number(ttl ?? -2);
  }

  const current = pruneMemoryValue(key);
  if (!current) return -2;
  if (current.expiresAt === null) return -1;
  return Math.max(0, current.expiresAt - Date.now());
}

export async function deleteKey(key: string) {
  const redis = getUpstashRedis();
  if (redis) {
    await redis.del(key);
    return;
  }

  const memory = getMemoryState();
  memory.values.delete(key);
  memory.lists.delete(key);
}

export async function pushListValue(key: string, value: string) {
  const redis = getUpstashRedis();
  if (redis) {
    await redis.lpush(key, value);
    return;
  }

  const list = getMemoryList(key);
  list.unshift(value);
}

export async function trimList(key: string, start: number, stop: number) {
  const redis = getUpstashRedis();
  if (redis) {
    await redis.ltrim(key, start, stop);
    return;
  }

  const memory = getMemoryState();
  const list = getMemoryList(key);
  if (list.length === 0) {
    return;
  }

  const normalizedStop = normalizeRangeStop(list.length, stop);
  if (normalizedStop < start) {
    memory.lists.set(key, []);
    return;
  }

  memory.lists.set(key, list.slice(start, normalizedStop + 1));
}

export async function getListRange(key: string, start: number, stop: number) {
  const redis = getUpstashRedis();
  if (redis) {
    const values = await redis.lrange(key, start, stop);
    return Array.isArray(values) ? values.map((value) => String(value)) : [];
  }

  const list = getMemoryList(key);
  if (list.length === 0) {
    return [];
  }

  const normalizedStop = normalizeRangeStop(list.length, stop);
  if (normalizedStop < start) {
    return [];
  }

  return list.slice(start, normalizedStop + 1);
}

export function resetRuntimeStoreForTests() {
  const memory = getMemoryState();
  memory.values.clear();
  memory.lists.clear();
}
