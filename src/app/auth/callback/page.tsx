"use client";

import { createAuthClient } from "@neondatabase/auth";
import { AuthView, NeonAuthUIProvider } from "@neondatabase/auth-ui";

const authClient = createAuthClient(
  `${process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3101"}/api/auth`,
);

export default function AuthCallbackPage() {
  return (
    <NeonAuthUIProvider authClient={authClient} redirectTo="/ponuda">
      <AuthView path="callback" />
    </NeonAuthUIProvider>
  );
}
