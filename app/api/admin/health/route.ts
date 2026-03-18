import { NextResponse } from "next/server";
import { withMonitoredRoute } from "@/lib/monitoring";
import { getAdminHealthSnapshot } from "@/lib/api/admin-health";

async function handleAdminHealth() {
  const snapshot = await getAdminHealthSnapshot();
  return NextResponse.json(snapshot);
}

export const GET = withMonitoredRoute("api.admin.health", async () => handleAdminHealth());
