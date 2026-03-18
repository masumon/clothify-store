import type { NextRequest } from "next/server";
import { resolvePublicSiteUrl } from "@/lib/site-url";

const MUTATION_METHODS = new Set(["POST", "PUT", "PATCH", "DELETE"]);

function normalizeOrigin(value: string) {
  try {
    return new URL(value).origin.toLowerCase();
  } catch {
    return "";
  }
}

function toForwardedOrigin(request: Request | NextRequest) {
  const proto = request.headers.get("x-forwarded-proto")?.trim();
  const host = request.headers.get("x-forwarded-host")?.trim() || request.headers.get("host")?.trim();
  if (!proto || !host) return "";
  return normalizeOrigin(`${proto}://${host}`);
}

function toAllowedOrigins(request: Request | NextRequest) {
  const allowed = new Set<string>();
  const requestOrigin = normalizeOrigin(request.url);
  const forwardedOrigin = toForwardedOrigin(request);
  const siteUrl = normalizeOrigin(resolvePublicSiteUrl(process.env.NEXT_PUBLIC_SITE_URL));
  const vercelUrl = process.env.VERCEL_URL?.trim();

  if (requestOrigin) allowed.add(requestOrigin);
  if (forwardedOrigin) allowed.add(forwardedOrigin);
  if (siteUrl) allowed.add(siteUrl);
  if (vercelUrl) allowed.add(normalizeOrigin(`https://${vercelUrl}`));

  if (process.env.NODE_ENV !== "production") {
    allowed.add("http://localhost:3000");
    allowed.add("http://127.0.0.1:3000");
  }

  return allowed;
}

export function isAdminMutationMethod(method: string) {
  return MUTATION_METHODS.has(method.toUpperCase());
}

export function validateTrustedAdminMutationRequest(request: Request | NextRequest) {
  if (!isAdminMutationMethod(request.method)) {
    return { ok: true as const };
  }

  const allowedOrigins = toAllowedOrigins(request);
  const origin = normalizeOrigin(request.headers.get("origin") || "");
  const referer = normalizeOrigin(request.headers.get("referer") || "");

  if (origin && allowedOrigins.has(origin)) {
    return { ok: true as const };
  }

  if (!origin && referer && allowedOrigins.has(referer)) {
    return { ok: true as const };
  }

  return {
    ok: false as const,
    status: 403,
    message: "Blocked untrusted admin mutation request.",
  };
}
