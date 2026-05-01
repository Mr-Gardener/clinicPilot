import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
  const token =
    req.cookies.get("token")?.value ||
    req.headers.get("authorization")?.replace("Bearer ", "");

  const protectedRoutes = ["/superAdmin", "/staff", "/doctor"];

  const isProtected = protectedRoutes.some((route) =>
    req.nextUrl.pathname.startsWith(route)
  );

  if (isProtected && !token) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  console.log("Middleware passed");
  return NextResponse.next();
}

export const config = {
  matcher: ["/superAdmin/:path*", "/staff/:path*", "/doctor/:path*"],
};
