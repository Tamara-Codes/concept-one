import { NextRequest, NextResponse } from "next/server";

import { getAllowedOfferUser } from "@/lib/offer-access";
import { getAuth } from "@/lib/auth";

function isOfferApi(pathname: string) {
  return pathname === "/api/offers" || pathname.startsWith("/api/offers/");
}

export async function proxy(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  const hasAuthVerifier =
    request.nextUrl.searchParams.has("neon_auth_session_verifier") ||
    request.nextUrl.searchParams.has("code");

  // Neon Auth must process the OAuth verifier before the page can read the session.
  // Keep the public marketing site public; only run auth middleware for callback traffic.
  if (pathname === "/auth/callback" || hasAuthVerifier) {
    return getAuth().middleware({ loginUrl: "/auth/sign-in" })(request);
  }

  // The public marketing homepage remains available without signing in.
  if (pathname === "/") return NextResponse.next();

  const allowedUser = await getAllowedOfferUser();

  if (allowedUser) return NextResponse.next();

  if (isOfferApi(pathname)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const signInUrl = new URL("/auth/sign-in", request.url);
  if (pathname !== "/auth/sign-in") {
    signInUrl.searchParams.set("next", pathname);
  }
  return NextResponse.redirect(signInUrl);
}

export const config = {
  matcher: ["/", "/auth/callback", "/ponuda/:path*", "/api/offers/:path*"],
};
