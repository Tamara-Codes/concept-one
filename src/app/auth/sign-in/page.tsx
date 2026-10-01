"use client";

import { createAuthClient } from "@neondatabase/auth";
import { useEffect, useState } from "react";
import {
  AuthView,
  authLocalization,
  NeonAuthUIProvider,
} from "@neondatabase/auth-ui";

// Browser auth goes through our local API so Neon session cookies stay on the
// application's origin.
const authClient = createAuthClient(
  `${process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3100"}/api/auth`,
);

export default function SignInPage() {
  const [redirectTarget, setRedirectTarget] = useState("/ponuda");

  useEffect(() => {
    const next = new URLSearchParams(window.location.search).get("next");
    if (next?.startsWith("/")) setRedirectTarget(next);
  }, []);

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[var(--color-co-warm)] px-6 py-12">
      <div className="pointer-events-none absolute -left-32 -top-32 h-80 w-80 rounded-full bg-[var(--color-co-accent)]/10 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-40 -right-24 h-96 w-96 rounded-full bg-[var(--color-co-charcoal)]/10 blur-3xl" />

      <section
        className="relative grid w-full max-w-4xl overflow-hidden rounded-[2rem] border border-white/70 bg-white/90 shadow-[0_24px_70px_rgba(34,39,42,0.16)] backdrop-blur"
        style={{ gridTemplateColumns: "1.25fr 0.75fr" }}
      >
        <div
          className="flex flex-col justify-between bg-[var(--color-co-charcoal)] text-white"
          style={{ padding: "3rem" }}
        >
          <div>
            <p className="text-xs font-semibold tracking-[0.34em] text-[var(--color-co-accent)]">
              CONCEPT ONE
            </p>
            <h1
              className="max-w-sm text-3xl font-semibold leading-tight tracking-tight"
              style={{ marginTop: "1.25rem" }}
            >
              Ponude na jednom mjestu.
            </h1>
          </div>
          <p className="mt-12 text-xs text-white/45">Interni portal za Concept One</p>
        </div>

        <div className="flex items-center px-6 py-8 sm:px-8 sm:py-10">
          <NeonAuthUIProvider
            authClient={authClient}
            persistClient
            defaultTheme="light"
            redirectTo={redirectTarget}
            credentials={false}
            signUp={false}
            emailOTP
            localizeErrors={false}
            localization={{
              ...authLocalization,
              SIGN_IN: "Prijava",
              SIGN_IN_ACTION: "Prijavi se",
              SIGN_IN_DESCRIPTION:
                "Unesite odobrenu e-mail adresu. Poslat ćemo vam kod za prijavu.",
              EMAIL: "E-mail",
              EMAIL_PLACEHOLDER: "ime@conceptone.hr",
              EMAIL_OTP: "Jednokratni kod",
              EMAIL_OTP_SEND_ACTION: "Pošalji kod",
              EMAIL_OTP_VERIFY_ACTION: "Potvrdi kod",
              EMAIL_OTP_DESCRIPTION:
                "Unesite odobrenu e-mail adresu kako biste primili kod.",
              EMAIL_OTP_VERIFICATION_SENT:
                "Kod je poslan na vašu e-mail adresu.",
            }}
            className="w-full"
          >
            <AuthView
              path="sign-in"
              redirectTo={redirectTarget}
              classNames={{
                base: "mx-auto w-full max-w-xs border-0 bg-transparent shadow-none",
                header: "px-0 pb-5 pt-0",
                content: "px-0",
                footer: "px-0 pt-5",
                title: "text-2xl font-semibold tracking-tight text-[var(--color-co-charcoal)]",
                description: "mt-2 text-sm text-slate-500",
                form: {
                  base: "gap-5",
                  label: "text-sm font-medium text-[var(--color-co-charcoal)]",
                  input: "h-12 rounded-xl border-slate-200 bg-white shadow-none focus-visible:ring-[var(--color-co-accent)]",
                  button:
                    "!h-12 !rounded-xl !bg-[var(--color-co-charcoal)] !text-sm !font-semibold !text-white hover:!bg-black",
                },
              }}
            />
          </NeonAuthUIProvider>
        </div>
      </section>
    </main>
  );
}
