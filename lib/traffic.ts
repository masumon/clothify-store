type VisitRecord = {
  visitorId: string;
  path: string;
  source: string;
  country: string;
  at: number;
};

type TrafficState = {
  events: VisitRecord[];
  lastSeenByVisitor: Map<string, number>;
};

const MAX_EVENTS = 5000;
const ACTIVE_WINDOW_MS = 5 * 60 * 1000;
const DAY_MS = 24 * 60 * 60 * 1000;

const globalTrafficState = globalThis as unknown as {
  __clothifyTrafficState?: TrafficState;
};

if (!globalTrafficState.__clothifyTrafficState) {
  globalTrafficState.__clothifyTrafficState = {
    events: [],
    lastSeenByVisitor: new Map<string, number>(),
  };
}

const state = globalTrafficState.__clothifyTrafficState;

function normalizeSource(source?: string) {
  if (!source || source.trim() === "") return "Direct";
  return source.trim();
}

export function trackVisit(payload: {
  visitorId: string;
  path: string;
  source?: string;
  country?: string;
}) {
  const now = Date.now();
  const event: VisitRecord = {
    visitorId: payload.visitorId,
    path: payload.path || "/",
    source: normalizeSource(payload.source),
    country: (payload.country || "Unknown").trim() || "Unknown",
    at: now,
  };

  state.events.push(event);
  state.lastSeenByVisitor.set(event.visitorId, now);

  if (state.events.length > MAX_EVENTS) {
    state.events.splice(0, state.events.length - MAX_EVENTS);
  }
}

function getDayKeyFromTime(ms: number) {
  return new Date(ms).toISOString().slice(0, 10);
}

function buildDayWindow(trendDays: number) {
  const days = Math.max(1, trendDays);
  const keys: string[] = [];
  const now = Date.now();

  for (let i = days - 1; i >= 0; i -= 1) {
    keys.push(getDayKeyFromTime(now - i * DAY_MS));
  }

  return keys;
}

export function getTrafficSnapshot(rangeDays = 1, trendDays = 7) {
  const now = Date.now();
  const rangeCutoff = now - Math.max(1, rangeDays) * DAY_MS;
  const recent = state.events.filter((item) => item.at >= rangeCutoff);
  const last24h = state.events.filter((item) => now - item.at <= DAY_MS);

  const sourceCounts = new Map<string, number>();
  const countryCounts = new Map<string, number>();
  const pageCounts = new Map<string, number>();
  const dayWindow = buildDayWindow(trendDays);
  const dayCountMap = new Map<string, number>(dayWindow.map((day) => [day, 0]));

  for (const item of recent) {
    sourceCounts.set(item.source, (sourceCounts.get(item.source) || 0) + 1);
    countryCounts.set(item.country, (countryCounts.get(item.country) || 0) + 1);
    pageCounts.set(item.path, (pageCounts.get(item.path) || 0) + 1);

    const key = getDayKeyFromTime(item.at);
    if (dayCountMap.has(key)) {
      dayCountMap.set(key, (dayCountMap.get(key) || 0) + 1);
    }
  }

  const liveUsers = Array.from(state.lastSeenByVisitor.values()).filter(
    (lastSeen) => now - lastSeen <= ACTIVE_WINDOW_MS
  ).length;

  const topSources = Array.from(sourceCounts.entries())
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 5);

  const topCountries = Array.from(countryCounts.entries())
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 5);

  const topPages = Array.from(pageCounts.entries())
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 5);

  const dailyVisits = dayWindow.map((date) => ({
    date,
    count: dayCountMap.get(date) || 0,
  }));

  return {
    liveUsers,
    visitsInRange: recent.length,
    visits24h: last24h.length,
    topSources,
    topCountries,
    topPages,
    dailyVisits,
  };
}

function aggregateVisits(
  visits: Array<{
    visitor_id: string;
    path: string;
    source: string;
    country: string;
    created_at: string;
  }>,
  rangeDays: number,
  trendDays: number
) {
  const now = Date.now();
  const rangeCutoff = now - Math.max(1, rangeDays) * DAY_MS;
  const last24hCutoff = now - DAY_MS;
  const sourceCounts = new Map<string, number>();
  const countryCounts = new Map<string, number>();
  const pageCounts = new Map<string, number>();
  const latestVisitorEvent = new Map<string, number>();
  const dayWindow = buildDayWindow(trendDays);
  const dailyCounts = new Map<string, number>(dayWindow.map((day) => [day, 0]));
  let visitsInRange = 0;
  let visits24h = 0;

  for (const item of visits) {
    const at = new Date(item.created_at).getTime();
    if (!Number.isFinite(at)) continue;

    if (at >= rangeCutoff) {
      visitsInRange += 1;
    }

    if (at >= last24hCutoff) {
      visits24h += 1;
    }

    sourceCounts.set(item.source || "Direct", (sourceCounts.get(item.source || "Direct") || 0) + 1);
    countryCounts.set(item.country || "Unknown", (countryCounts.get(item.country || "Unknown") || 0) + 1);
    pageCounts.set(item.path || "/", (pageCounts.get(item.path || "/") || 0) + 1);

    const existing = latestVisitorEvent.get(item.visitor_id) || 0;
    if (at > existing) {
      latestVisitorEvent.set(item.visitor_id, at);
    }

    const dayKey = getDayKeyFromTime(at);
    if (dailyCounts.has(dayKey)) {
      dailyCounts.set(dayKey, (dailyCounts.get(dayKey) || 0) + 1);
    }
  }

  const liveUsers = Array.from(latestVisitorEvent.values()).filter(
    (lastSeen) => now - lastSeen <= ACTIVE_WINDOW_MS
  ).length;

  const topSources = Array.from(sourceCounts.entries())
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 5);

  const topCountries = Array.from(countryCounts.entries())
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 5);

  const topPages = Array.from(pageCounts.entries())
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 5);

  const dailyVisits = dayWindow.map((date) => ({
    date,
    count: dailyCounts.get(date) || 0,
  }));

  return {
    liveUsers,
    visitsInRange,
    visits24h,
    topSources,
    topCountries,
    topPages,
    dailyVisits,
  };
}

export async function getTrafficSnapshotFromDb(rangeDays = 1, trendDays = 7) {
  try {
    const { getSupabaseAdminClient } = await import("@/lib/supabase-admin");
    const supabase = getSupabaseAdminClient();
    const fetchDays = Math.max(1, rangeDays, trendDays);
    const sinceIso = new Date(Date.now() - fetchDays * DAY_MS).toISOString();

    const { data, error } = await supabase
      .from("page_visits")
      .select("visitor_id,path,source,country,created_at")
      .gte("created_at", sinceIso)
      .order("created_at", { ascending: false })
      .limit(5000);

    if (error) {
      return {
        ...getTrafficSnapshot(rangeDays, trendDays),
      };
    }

    const visits = (data || []) as Array<{
      visitor_id: string;
      path: string;
      source: string;
      country: string;
      created_at: string;
    }>;

    return aggregateVisits(visits, rangeDays, trendDays);
  } catch {
    return {
      ...getTrafficSnapshot(rangeDays, trendDays),
    };
  }
}
