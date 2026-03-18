import assert from "node:assert/strict";
import test from "node:test";
import { handlePublicSumonixRequest } from "@/lib/api/sumonix-public";
import { handleAdminSumonixRequest } from "@/lib/api/sumonix-admin";

test("public sumonix returns reply for valid JSON request", async () => {
  const request = new Request("http://localhost/api/sumonix", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({
      question: "Best shirt under 1500",
      contextPath: "/",
      uiLanguage: "en",
    }),
  });

  const response = await handlePublicSumonixRequest(request, {
    getReply: async (question, context) => ({
      message: `${question} :: ${context.uiLanguage}`,
      actions: [],
      products: [],
    }),
    consumeRateLimit: async () => ({
      allowed: true,
      current: 1,
      remaining: 17,
      retryAfterMs: 0,
      limit: 18,
      storeMode: "memory",
    }),
  });

  assert.equal(response.status, 200);
  assert.deepEqual(await response.json(), {
    message: "Best shirt under 1500 :: en",
    actions: [],
    products: [],
  });
});

test("public sumonix rejects invalid content type", async () => {
  const request = new Request("http://localhost/api/sumonix", {
    method: "POST",
    headers: { "content-type": "text/plain" },
    body: "hello",
  });

  const response = await handlePublicSumonixRequest(request, {
    consumeRateLimit: async () => ({
      allowed: true,
      current: 1,
      remaining: 17,
      retryAfterMs: 0,
      limit: 18,
      storeMode: "memory",
    }),
  });

  assert.equal(response.status, 415);
  assert.deepEqual(await response.json(), { error: "Invalid content type" });
});

test("admin sumonix returns 429 when rate limit is exceeded", async () => {
  const request = new Request("http://localhost/api/admin/sumonix", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ question: "today sales" }),
  });

  const response = await handleAdminSumonixRequest(request, {
    consumeRateLimit: async () => ({
      allowed: false,
      current: 41,
      remaining: 0,
      retryAfterMs: 12_000,
      limit: 40,
      storeMode: "memory",
    }),
  });

  assert.equal(response.status, 429);
  assert.deepEqual(await response.json(), {
    error: "Too many admin SUMONIX requests. Please wait and try again.",
    retry_after_seconds: 12,
  });
});
