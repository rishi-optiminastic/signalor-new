"use client";

import { Suspense, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "@fe/lib/auth-client";
import { getOrganizations } from "@fe/lib/api/organizations";
import { getRunList } from "@fe/lib/api/analyzer";
import { routes } from "@fe/lib/config";
import { SignalorLoader } from "@fe/components/ui/signalor-loader";

export default function DashboardPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-background">
          <SignalorLoader size="lg" />
        </div>
      }
    >
      <DashboardRedirect />
    </Suspense>
  );
}

/**
 * This page is just a router:
 * - No session → /sign-in
 * - No org → /onboarding/company-info (first-time onboarding)
 * - Has org + runs → /dashboard/[slug]
 * - Has org, no runs → /onboarding/company-info (start an analysis)
 * Pricing is gated only when the user clicks Launch on onboarding (not here).
 */
function DashboardRedirect() {
  const { data: session, isPending } = useSession();
  const router = useRouter();

  // Guard navigation by destination. better-auth's useSession re-renders this
  // component repeatedly (it refetches the session, toggling isPending), so the
  // effect re-runs constantly. Previously every re-run fired a fresh
  // router.replace() that ABORTED the still-pending navigation before Next could
  // commit it — so we never left /dashboard and the page spun on "Loading..."
  // forever. Requesting each destination at most once lets the first navigation
  // actually commit. Using the target (not a boolean "ran once") keeps this
  // correct under React Strict Mode's mount→unmount→remount in dev.
  const navTargetRef = useRef<string | null>(null);
  const go = (target: string) => {
    if (navTargetRef.current === target) return;
    navTargetRef.current = target;
    router.replace(target);
  };

  useEffect(() => {
    const email = session?.user?.email;
    if (isPending) return;
    if (!session || !email) {
      go(routes.signIn);
      return;
    }

    let cancelled = false;
    (async () => {
      try {
        const orgs = await getOrganizations(email);
        if (cancelled) return;
        if (orgs.length === 0) {
          go(routes.onboardingCompanyInfo);
          return;
        }

        // Search ALL orgs for a usable run, not just orgs[0]. Otherwise a
        // paid user whose first org has no runs (but other orgs do) bounces
        // to onboarding, which bounces them back to /dashboard, forever.
        for (const org of orgs) {
          const runs = await getRunList(email, org.id).catch(() => []);
          if (cancelled) return;
          if (runs.length === 0) continue;
          const bestRun =
            runs.find((r) => r.status === "complete") ??
            runs.find((r) => r.status !== "failed") ??
            runs[0];
          go(routes.dashboardProject(bestRun.slug));
          return;
        }

        // Orgs exist but no runs anywhere → send them to start an analysis via
        // the onboarding flow.
        go(routes.onboardingCompanyInfo);
      } catch {
        if (!cancelled) go(routes.onboardingCompanyInfo);
      }
    })();

    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isPending, session?.user?.email, router]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <SignalorLoader size="lg" label="Loading..." />
    </div>
  );
}
