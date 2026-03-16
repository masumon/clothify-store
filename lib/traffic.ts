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
