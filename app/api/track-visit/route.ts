import { NextResponse } from "next/server";
import { trackVisit } from "@/lib/traffic";
import { getSupabaseAdminClient } from "@/lib/supabase-admin";

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

    try {
      const supabase = getSupabaseAdminClient();
      await supabase.from("page_visits").insert([
        {
          visitor_id: visitorId,
          path: path || "/",
          source: source || "Direct",
          country,
        },
      ]);
    } catch {
      // Keep request successful even when analytics table is not ready.
    }

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
}
