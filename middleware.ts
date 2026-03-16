import { NextRequest, NextResponse } from "next/server";
import { isAdminAuthorized, unauthorizedResponse } from "@/lib/admin-auth";

export function middleware(req: NextRequest) {
  const adminUser = process.env.ADMIN_USERNAME;
  const adminPass = process.env.ADMIN_PASSWORD;

  if (!adminUser || !adminPass) {
    return new NextResponse("Missing admin credentials in environment", {
      status: 500,
    });
  }

  if (isAdminAuthorized(req)) {
    return NextResponse.next();
  }

  return unauthorizedResponse();
}

export const config = {
  matcher: ["/admin/:path*", "/api/admin/:path*"],
};
