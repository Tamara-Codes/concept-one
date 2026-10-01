import { NextRequest, NextResponse } from "next/server";

import { getAllowedOfferUser } from "@/lib/offer-access";

function isOfferApi(pathname: string) {
  return pathname === "/api/offers" || pathname.startsWith("/api/offers/");
}

export async function proxy(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

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
  matcher: ["/", "/ponuda/:path*", "/api/offers/:path*"],
};
