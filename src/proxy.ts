import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// 3dman.club routes rewrite to /club/* so they get the club layout.
// 3dmanbox.com stays on the root tree (new design).
const CLUB_HOSTS = new Set(["3dman.club", "www.3dman.club", "club.localhost"]);

export function proxy(request: NextRequest) {
  const host = (request.headers.get("host") || "").toLowerCase().split(":")[0];
  const url = request.nextUrl.clone();
  const path = url.pathname;

  // Skip API, static assets, and routes that already explicitly target /club
  if (
    path.startsWith("/api") ||
    path.startsWith("/_next") ||
    path.startsWith("/club") ||
    path.includes(".")
  ) {
    return NextResponse.next();
  }

  if (CLUB_HOSTS.has(host)) {
    url.pathname = `/club${path === "/" ? "" : path}`;
    return NextResponse.rewrite(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\.).*)"],
};
