import assert from "node:assert/strict";
import test from "node:test";
import { handleAdminSupabaseAuth } from "@/lib/api/admin-auth-supabase";

test("admin supabase auth bridge issues session for allowed email", async () => {
  const request = new Request("http://localhost/api/admin/auth/supabase", {
    method: "POST",
    headers: {
      "content-type": "application/json",
      "x-forwarded-for": "203.0.113.7",
    },
    body: JSON.stringify({ access_token: "token-123" }),
  });

  const response = await handleAdminSupabaseAuth(request, {
    getAllowedEmails: () => new Set(["owner@example.com"]),
    getAdminUsername: () => "owner@example.com",
    getSupabaseUser: async () => ({ email: "owner@example.com" }),
    createSessionToken: async () => "signed-admin-session",
    setSessionCookie: (nextResponse, token) => {
      nextResponse.headers.set("x-test-session", token);
    },
    consumeRateLimit: async () => ({
      allowed: true,
      current: 1,
      remaining: 19,
      retryAfterMs: 0,
      limit: 20,
      storeMode: "memory",
    }),
  });

  assert.equal(response.status, 200);
  assert.equal(response.headers.get("x-test-session"), "signed-admin-session");
  assert.deepEqual(await response.json(), { success: true });
});

test("admin supabase auth bridge rejects unknown email", async () => {
  const request = new Request("http://localhost/api/admin/auth/supabase", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ access_token: "token-123" }),
  });

  const response = await handleAdminSupabaseAuth(request, {
    getAllowedEmails: () => new Set(["owner@example.com"]),
    getAdminUsername: () => "owner@example.com",
    getSupabaseUser: async () => ({ email: "staff@example.com" }),
    createSessionToken: async () => "unused",
    consumeRateLimit: async () => ({
      allowed: true,
      current: 1,
      remaining: 19,
      retryAfterMs: 0,
      limit: 20,
      storeMode: "memory",
    }),
  });

  assert.equal(response.status, 403);
  assert.deepEqual(await response.json(), {
    error: "Supabase account is not authorized for admin access.",
  });
});
