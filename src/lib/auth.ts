import "server-only";

import { createNeonAuth } from "@neondatabase/neon-js/auth/next/server";

let auth: ReturnType<typeof createNeonAuth> | undefined;

export function getAuth() {
  if (auth) return auth;

  const baseUrl = process.env.NEON_AUTH_BASE_URL;
  const cookieSecret = process.env.NEON_AUTH_COOKIE_SECRET;

  if (!baseUrl) {
    throw new Error("NEON_AUTH_BASE_URL is required to use Concept One authentication");
  }
  if (!cookieSecret || cookieSecret.length < 32) {
    throw new Error("NEON_AUTH_COOKIE_SECRET must be at least 32 characters");
  }

  auth = createNeonAuth({
    baseUrl,
    cookies: {
      secret: cookieSecret,
      sessionDataTtl: 300,
    },
  });

  return auth;
}
