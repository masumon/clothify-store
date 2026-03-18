import { NextResponse } from "next/server";
import { withMonitoredRoute } from "@/lib/monitoring";
import { runAdminWebhookSmokeTest } from "@/lib/api/admin-webhook-smoke";

async function handleWebhookSmoke() {
  const result = await runAdminWebhookSmokeTest();
  return NextResponse.json(result, {
    status: result.status === "failed" ? 502 : 200,
  });
}

export const POST = withMonitoredRoute("api.admin.monitoring.webhook-smoke", async () =>
  handleWebhookSmoke()
);
