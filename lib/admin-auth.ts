import { NextRequest, NextResponse } from "next/server";

export const ADMIN_SESSION_COOKIE = "admin_session";
export const ADMIN_SESSION_TTL_SECONDS = 60 * 60 * 24 * 7;

type SessionPayload = {
  sub: string;
  exp: number;
  iat: number;
  v: 1;
};

function decodeBase64(value: string) {
  try {
    return atob(value);
  } catch {
    return "";
  }
}

function encodeBase64Url(input: Uint8Array) {
  let binary = "";
  for (const byte of input) {
    binary += String.fromCharCode(byte);
  }
  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/g, "");
}

function decodeBase64Url(input: string) {
  try {
    const normalized = input.replace(/-/g, "+").replace(/_/g, "/");
    const padded = normalized + "=".repeat((4 - (normalized.length % 4)) % 4);
    const binary = atob(padded);
    const bytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i += 1) {
      bytes[i] = binary.charCodeAt(i);
    }
    return bytes;
  } catch {
    return null;
  }
}

function getAdminCredentials() {
  const username = process.env.ADMIN_USERNAME;
  const password = process.env.ADMIN_PASSWORD;
  if (!username || !password) return null;
  return { username, password };
}

function getSessionSecret() {
  const configuredSecret = process.env.ADMIN_SESSION_SECRET?.trim();
  if (configuredSecret) return configuredSecret;
  return "";
}

function safeCompare(left: string, right: string) {
  if (left.length !== right.length) return false;
  let diff = 0;
  for (let i = 0; i < left.length; i += 1) {
    diff |= left.charCodeAt(i) ^ right.charCodeAt(i);
  }
  return diff === 0;
}

async function signValue(input: string, secret: string) {
  const encoder = new TextEncoder();
  const key = await crypto.subtle.importKey(
    "raw",
    encoder.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );
  const signature = await crypto.subtle.sign("HMAC", key, encoder.encode(input));
  return new Uint8Array(signature);
}

async function verifySignature(input: string, providedSignature: string, secret: string) {
  const parsed = decodeBase64Url(providedSignature);
  if (!parsed) return false;
  const expected = await signValue(input, secret);
  if (parsed.length !== expected.length) return false;
  let diff = 0;
  for (let i = 0; i < parsed.length; i += 1) {
    diff |= parsed[i] ^ expected[i];
  }
  return diff === 0;
}

function parseSessionPayload(rawPayload: string) {
  const payloadBytes = decodeBase64Url(rawPayload);
  if (!payloadBytes) return null;
  try {
    const decoded = new TextDecoder().decode(payloadBytes);
    const parsed = JSON.parse(decoded) as SessionPayload;
    if (
      !parsed ||
      typeof parsed.sub !== "string" ||
      typeof parsed.exp !== "number" ||
      typeof parsed.iat !== "number" ||
      parsed.v !== 1
    ) {
      return null;
    }
    return parsed;
  } catch {
    return null;
  }
}

export async function createAdminSessionToken(subject: string, ttlSeconds = ADMIN_SESSION_TTL_SECONDS) {
  const secret = getSessionSecret();
  if (!secret) {
    throw new Error("Admin session secret is not configured.");
  }

  const now = Math.floor(Date.now() / 1000);
  const payload: SessionPayload = {
    sub: subject,
    iat: now,
    exp: now + ttlSeconds,
    v: 1,
  };

  const payloadBytes = new TextEncoder().encode(JSON.stringify(payload));
  const encodedPayload = encodeBase64Url(payloadBytes);
  const signatureBytes = await signValue(encodedPayload, secret);
  const encodedSignature = encodeBase64Url(signatureBytes);
  return `${encodedPayload}.${encodedSignature}`;
}

export async function isAdminSessionTokenValid(token: string) {
  const creds = getAdminCredentials();
  const secret = getSessionSecret();
  if (!creds || !secret || !token) return false;

  const [payloadPart, signaturePart] = token.split(".");
  if (!payloadPart || !signaturePart) return false;

  const signatureValid = await verifySignature(payloadPart, signaturePart, secret);
  if (!signatureValid) return false;

  const payload = parseSessionPayload(payloadPart);
  if (!payload) return false;

  const now = Math.floor(Date.now() / 1000);
  if (payload.exp <= now) return false;

  return safeCompare(payload.sub, creds.username);
}

export function setAdminSessionCookie(
  response: NextResponse,
  token: string,
  maxAgeSeconds = ADMIN_SESSION_TTL_SECONDS
) {
  response.cookies.set(ADMIN_SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: maxAgeSeconds,
    path: "/",
  });
}

export function clearAdminSessionCookie(response: NextResponse) {
  response.cookies.set(ADMIN_SESSION_COOKIE, "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 0,
    path: "/",
  });
}

export function isAdminAuthorized(req: NextRequest) {
  if (!isLegacyBasicAuthEnabled()) {
    return false;
  }

  const creds = getAdminCredentials();
  if (!creds) {
    return false;
  }

  const header = req.headers.get("authorization") || "";
  if (!header.startsWith("Basic ")) {
    return false;
  }

  const encoded = header.slice(6).trim();
  const decoded = decodeBase64(encoded);
  const separatorIndex = decoded.indexOf(":");

  if (separatorIndex < 0) {
    return false;
  }

  const username = decoded.slice(0, separatorIndex);
  const password = decoded.slice(separatorIndex + 1);

  return safeCompare(username, creds.username) && safeCompare(password, creds.password);
}

export async function isSessionAuthorized(req: NextRequest) {
  const sessionCookie = req.cookies.get(ADMIN_SESSION_COOKIE);
  if (!sessionCookie?.value) {
    return false;
  }

  return isAdminSessionTokenValid(sessionCookie.value);
}

export function isLegacyBasicAuthEnabled() {
  return process.env.NODE_ENV !== "production";
}

export function unauthorizedResponse(message = "Unauthorized") {
  const headers =
    process.env.NODE_ENV !== "production"
      ? {
          "WWW-Authenticate": 'Basic realm="Clothify Admin"',
        }
      : undefined;

  return new NextResponse(message, {
    status: 401,
    headers,
  });
}
