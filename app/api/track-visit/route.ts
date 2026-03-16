import { NextResponse } from "next/server";
import { trackVisit } from "@/lib/traffic";

type TrackPayload = {
  visitorId?: string;
  path?: string;
  source?: string;
};

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as TrackPayload;

    const visitorId = typeof body.visitorId === "string" ? body.visitorId.trim() : "";
    const path = typeof body.path === "string" ? body.path.trim() : "/";
    const source = typeof body.source === "string" ? body.source.trim() : "Direct";

    if (!visitorId) {
      return NextResponse.json({ error: "visitorId is required" }, { status: 400 });
    }

    const country = req.headers.get("x-vercel-ip-country") || "Unknown";

    trackVisit({
      visitorId,
      path: path || "/",
      source,
      country,
    });

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
}
