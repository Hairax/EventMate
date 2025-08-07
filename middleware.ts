import { NextRequest, NextResponse } from "next/server";

export function middleware(req: NextRequest) {
  const token = req.cookies.get("__session"); // A mejorar con JWT si lo metés
  const isProtectedRoute = req.nextUrl.pathname.startsWith("/events");

  if (isProtectedRoute && !token) {
    return NextResponse.redirect(new URL("/auth/login", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/events/:path*", "/admin/:path*"],
};
