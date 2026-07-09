"use client";

import { Suspense, useEffect, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useSession, signOut } from "@fe/lib/auth-client";
import { checkOrganizationExists } from "@fe/lib/api/organizations";
import { setAccountType } from "@fe/lib/api/account";
import { isWorkEmail } from "@fe/lib/work-email";
import { SIGNUP_DETAILS_KEY } from "@fe/lib/stores/onboarding-store";
import { routes } from "@fe/lib/config";

const CALLBACK_TIMEOUT_MS = 10_000;

function CallbackResolver() {
  const { data: session, isPending } = useSession();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [timedOut, setTimedOut] = useState(false);

  // Timeout: if session never arrives, redirect to sign-in
  useEffect(() => {
    const timer = setTimeout(() => setTimedOut(true), CALLBACK_TIMEOUT_MS);
    return () => clearTimeout(timer);
  }, []);

  const callbackEmail = session?.user?.email;
  useEffect(() => {
    if (timedOut && !callbackEmail) {
      router.replace(routes.signIn);
    }
  }, [timedOut, callbackEmail, router]);

  // Resolve once per email — better-auth re-renders churn `session` and
  // would otherwise re-fire checkOrganizationExists (and signOut) on every
  // render before the redirect completes.
  const resolvedRef = useRef(false);
  useEffect(() => {
    if (isPending || !callbackEmail) return;
    if (resolvedRef.current) return;
    resolvedRef.current = true;

    const mode = searchParams.get("mode") || "sign-in";
    // Account type chosen at sign-up step 1, carried across the Google redirect.
    const accountType = searchParams.get("type") === "agency" ? "agency" : "individual";

    async function resolve() {
      // Agency accounts must use a work email; a personal Google account is
      // rejected here (post-callback is the only place we learn the address).
      if (mode === "sign-up" && accountType === "agency" && !isWorkEmail(callbackEmail!)) {
        await signOut().catch(() => {});
        router.replace(`${routes.signUp}?error=work-email`);
        return;
      }

      const hasOrg = await checkOrganizationExists(callbackEmail!).catch(() => false);

      if (mode === "sign-up") {
        // Persist the chosen type before entering onboarding (best-effort).
        if (accountType === "agency") {
          // The agency name was captured before the Google redirect and mirrored
          // to sessionStorage (the in-memory store doesn't survive the round-trip).
          let agencyName = "";
          let role = "";
          try {
            const raw = sessionStorage.getItem(SIGNUP_DETAILS_KEY);
            if (raw) {
              const d = JSON.parse(raw);
              agencyName = d.agencyName || "";
              role = d.userRole || "";
            }
          } catch {
            /* ignore */
          }
          await setAccountType(
            callbackEmail!,
            "agency",
            agencyName || undefined,
            role || undefined,
          ).catch(() => {});
        }
        router.replace(hasOrg ? routes.dashboard : routes.onboardingCompanyInfo);
      } else {
        if (hasOrg) {
          router.replace(routes.dashboard);
        } else {
          await signOut().catch(() => {});
          router.replace(`${routes.signUp}?error=no-account`);
        }
      }
    }

    // Fire-and-forget, but never let a rejection surface as an uncaught error —
    // fall back to sign-in instead.
    resolve().catch(() => router.replace(routes.signIn));
  }, [callbackEmail, isPending, router, searchParams]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-transparent">
      {/* <p className="text-muted-foreground">Setting up your account...</p> */}
    </div>
  );
}

export default function AuthCallbackPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center">
          <p className="text-muted-foreground">Loading...</p>
        </div>
      }
    >
      <CallbackResolver />
    </Suspense>
  );
}
