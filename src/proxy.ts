import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const CLUB_HOSTS = new Set([
  "3dman.club",
  "www.3dman.club",
  "club.localhost",
]);

const BOX_HOSTS = new Set([
  "3dmanbox.com",
  "www.3dmanbox.com",
  "box.localhost",
]);

export function proxy(request: NextRequest) {
  const host = (request.headers.get("host") || "").toLowerCase();
  const url = request.nextUrl.clone();
  const path = url.pathname;

  // Don't rewrite API routes or static assets
  if (
    path.startsWith("/api") ||
    path.startsWith("/_next") ||
    path.startsWith("/box") ||
    path.startsWith("/club") ||
    path.includes(".")
  ) {
    return NextResponse.next();
  }

  if (CLUB_HOSTS.has(host)) {
    url.pathname = `/club${path === "/" ? "" : path}`;
    return NextResponse.rewrite(url);
  }

  if (BOX_HOSTS.has(host)) {
    url.pathname = `/box${path === "/" ? "" : path}`;
    return NextResponse.rewrite(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\.).*)"],
};
