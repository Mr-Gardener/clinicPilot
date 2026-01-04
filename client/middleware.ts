import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
  const token = req.cookies.get("token")?.value;
  const role = req.cookies.get("role")?.value;

  // Protected routes
  const adminRoutes = req.nextUrl.pathname.startsWith("/admin");
  const doctorRoutes = req.nextUrl.pathname.startsWith("/doctor");
  const staffRoutes = req.nextUrl.pathname.startsWith("/staff");

  if (!token) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  if (adminRoutes && role !== "superAdmin") {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  if (doctorRoutes && role !== "doctor") {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  if (staffRoutes && role !== "staff") {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/doctor/:path*", "/staff/:path*"],
};
