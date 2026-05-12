import { NextResponse, type NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const response = NextResponse.next();

  if (request.nextUrl.pathname === "/") {
    response.headers.set("cache-control", "no-store, no-cache, max-age=0, must-revalidate");
    response.headers.set("x-praetor-route", "landing-cybersphere-v2");
  }

  return response;
}

export const config = {
  matcher: ["/"],
};
