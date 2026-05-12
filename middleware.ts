import { NextResponse, type NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  if (request.nextUrl.pathname === "/") {
    const landingUrl = request.nextUrl.clone();
    landingUrl.pathname = "/landing-cybersphere-v2";

    const response = NextResponse.rewrite(landingUrl);
    response.headers.set("cache-control", "no-store, no-cache, max-age=0, must-revalidate");
    response.headers.set("x-praetor-route", "landing-cybersphere-v2");
    response.headers.set("x-middleware-cache", "no-cache");
    return response;
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/"],
};
