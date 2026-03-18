import assert from "node:assert/strict";
import test from "node:test";
import { runAdminWebhookSmokeTest } from "@/lib/api/admin-webhook-smoke";

test("admin webhook smoke helper returns ok=true on successful delivery", async () => {
  const result = await runAdminWebhookSmokeTest(async () => ({
    status: "success",
    durationMs: 320,
    statusCode: 200,
  }));

  assert.deepEqual(result, {
    ok: true,
    status: "success",
    durationMs: 320,
    statusCode: 200,
  });
});

test("admin webhook smoke helper returns ok=false on skipped delivery", async () => {
  const result = await runAdminWebhookSmokeTest(async () => ({
    status: "skipped",
    durationMs: 0,
  }));

  assert.deepEqual(result, {
    ok: false,
    status: "skipped",
    durationMs: 0,
  });
});
