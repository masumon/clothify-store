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

export function getTrafficSnapshot() {
  const now = Date.now();
  const recent = state.events.filter((item) => now - item.at <= 24 * 60 * 60 * 1000);

  const sourceCounts = new Map<string, number>();
  const countryCounts = new Map<string, number>();
  const pageCounts = new Map<string, number>();

  for (const item of recent) {
    sourceCounts.set(item.source, (sourceCounts.get(item.source) || 0) + 1);
    countryCounts.set(item.country, (countryCounts.get(item.country) || 0) + 1);
    pageCounts.set(item.path, (pageCounts.get(item.path) || 0) + 1);
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

  return {
    liveUsers,
    visits24h: recent.length,
    topSources,
    topCountries,
    topPages,
  };
}

function aggregateVisits(visits: Array<{ visitor_id: string; path: string; source: string; country: string; created_at: string }>) {
  const now = Date.now();
  const sourceCounts = new Map<string, number>();
  const countryCounts = new Map<string, number>();
  const pageCounts = new Map<string, number>();
  const latestVisitorEvent = new Map<string, number>();
  const dailyCounts = new Map<string, number>();

  for (const item of visits) {
    const at = new Date(item.created_at).getTime();
    if (!Number.isFinite(at)) continue;

    sourceCounts.set(item.source || "Direct", (sourceCounts.get(item.source || "Direct") || 0) + 1);
    countryCounts.set(item.country || "Unknown", (countryCounts.get(item.country || "Unknown") || 0) + 1);
    pageCounts.set(item.path || "/", (pageCounts.get(item.path || "/") || 0) + 1);

    const existing = latestVisitorEvent.get(item.visitor_id) || 0;
    if (at > existing) {
      latestVisitorEvent.set(item.visitor_id, at);
    }

    const dayKey = new Date(at).toISOString().slice(0, 10);
    dailyCounts.set(dayKey, (dailyCounts.get(dayKey) || 0) + 1);
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

  const dailyVisits = Array.from(dailyCounts.entries())
    .map(([date, count]) => ({ date, count }))
    .sort((a, b) => a.date.localeCompare(b.date))
    .slice(-7);

  return {
    liveUsers,
    visits24h: visits.length,
    topSources,
    topCountries,
    topPages,
    dailyVisits,
  };
}

export async function getTrafficSnapshotFromDb() {
  try {
    const { getSupabaseAdminClient } = await import("@/lib/supabase-admin");
    const supabase = getSupabaseAdminClient();
    const sinceIso = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();

    const { data, error } = await supabase
      .from("page_visits")
      .select("visitor_id,path,source,country,created_at")
      .gte("created_at", sinceIso)
      .order("created_at", { ascending: false })
      .limit(5000);

    if (error) {
      return {
        ...getTrafficSnapshot(),
        dailyVisits: [],
      };
    }

    const visits = (data || []) as Array<{
      visitor_id: string;
      path: string;
      source: string;
      country: string;
      created_at: string;
    }>;

    return aggregateVisits(visits);
  } catch {
    return {
      ...getTrafficSnapshot(),
      dailyVisits: [],
    };
  }
}
