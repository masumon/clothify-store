import { NextRequest, NextResponse } from "next/server";
import {
  isAdminAuthorized,
  isLegacyBasicAuthEnabled,
  isSessionAuthorized,
  unauthorizedResponse,
} from "@/lib/admin-auth";
import { validateTrustedAdminMutationRequest } from "@/lib/admin-mutation-guard";

export async function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Allow the login page and auth API to pass through without any auth check
  if (pathname === "/admin/login") {
    return NextResponse.next();
  }

  if (pathname.startsWith("/api/admin/auth")) {
    const mutationCheck = validateTrustedAdminMutationRequest(req);
    if (!mutationCheck.ok) {
      return new NextResponse(mutationCheck.message, { status: mutationCheck.status });
    }
    return NextResponse.next();
  }

  const adminUser = process.env.ADMIN_USERNAME;
  const adminPass = process.env.ADMIN_PASSWORD;

  if (!adminUser || !adminPass) {
    return new NextResponse("Admin credentials are not configured on this server.", {
      status: 500,
    });
  }

  if (pathname.startsWith("/api/admin/")) {
    const mutationCheck = validateTrustedAdminMutationRequest(req);
    if (!mutationCheck.ok) {
      return new NextResponse(mutationCheck.message, { status: mutationCheck.status });
    }
  }

  // Check session cookie (set by the login page)
  if (await isSessionAuthorized(req)) {
    return NextResponse.next();
  }

  // Fall back to HTTP Basic Auth for backward compatibility (e.g. API clients)
  if (isLegacyBasicAuthEnabled() && isAdminAuthorized(req)) {
    return NextResponse.next();
  }

  if (pathname.startsWith("/api/admin/")) {
    return unauthorizedResponse("Unauthorized admin API request.");
  }

  // Not authenticated – redirect to the custom login page
  const loginUrl = new URL("/admin/login", req.url);
  loginUrl.searchParams.set("next", pathname);
  return NextResponse.redirect(loginUrl);
}

export const config = {
  matcher: ["/admin/:path*", "/api/admin/:path*"],
};
