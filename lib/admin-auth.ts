import { NextRequest, NextResponse } from "next/server";

function decodeBase64(value: string) {
  try {
    return atob(value);
  } catch {
    return "";
  }
}

export function isAdminAuthorized(req: NextRequest) {
  const adminUser = process.env.ADMIN_USERNAME;
  const adminPass = process.env.ADMIN_PASSWORD;

  if (!adminUser || !adminPass) {
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

  return username === adminUser && password === adminPass;
}

export function unauthorizedResponse() {
  return new NextResponse("Unauthorized", {
    status: 401,
    headers: {
      "WWW-Authenticate": 'Basic realm="Clothify Admin"',
    },
  });
}
