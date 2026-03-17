import { NextRequest, NextResponse } from "next/server";
import { isAdminAuthorized, isSessionAuthorized } from "@/lib/admin-auth";

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Allow the login page and auth API to pass through without any auth check
  if (
    pathname === "/admin/login" ||
    pathname.startsWith("/api/admin/auth")
  ) {
    return NextResponse.next();
  }

  const adminUser = process.env.ADMIN_USERNAME;
  const adminPass = process.env.ADMIN_PASSWORD;

  if (!adminUser || !adminPass) {
    return new NextResponse("Admin credentials are not configured on this server.", {
      status: 500,
    });
  }

  // Check session cookie (set by the login page)
  if (isSessionAuthorized(req)) {
    return NextResponse.next();
  }

  // Fall back to HTTP Basic Auth for backward compatibility (e.g. API clients)
  if (isAdminAuthorized(req)) {
    return NextResponse.next();
  }

  // Not authenticated – redirect to the custom login page
  const loginUrl = new URL("/admin/login", req.url);
  loginUrl.searchParams.set("next", pathname);
  return NextResponse.redirect(loginUrl);
}

export const config = {
  matcher: ["/admin/:path*", "/api/admin/:path*"],
};
