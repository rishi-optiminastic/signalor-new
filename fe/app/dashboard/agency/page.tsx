"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { ArrowRight, Globe, Plus, Users } from "@fe/components/icons";
import { useSession } from "@fe/lib/auth-client";
import { useAccountType } from "@fe/lib/hooks/use-account-type";
import { useOrgStore } from "@fe/lib/stores/org-store";
import { getOrganizations, type Organization } from "@fe/lib/api/organizations";
import { getRunList } from "@fe/lib/api/analyzer";
import { routes } from "@fe/lib/config";
import { SignalorLoader } from "@fe/components/ui/signalor-loader";

type BrandCard = {
  org: Organization;
  slug: string | null;
  score: number | null;
};

/**
 * Agency workspace — Profound-style list of every client brand the agency
 * manages, with a single "Add client brand" entry point. Individuals don't
 * have multiple brands, so they're bounced back to their dashboard.
 */
export default function AgencyWorkspacePage() {
  const router = useRouter();
  const { data: session, isPending } = useSession();
  const { isAgency, accountType } = useAccountType();
  const { setActiveOrg } = useOrgStore();
  const email = session?.user?.email ?? "";

  // Only agencies belong here. Wait until the session + account type resolve
  // before deciding, so we don't flash-redirect an agency on first paint.
  useEffect(() => {
    if (isPending || !email) return;
    if (accountType === "individual" && !isAgency) {
      router.replace(routes.dashboard);
    }
  }, [isPending, email, isAgency, accountType, router]);

  const { data: brands, isLoading } = useQuery({
    queryKey: ["agency-brands", email],
    enabled: !!email,
    queryFn: async (): Promise<BrandCard[]> => {
      const orgs = await getOrganizations(email);
      return Promise.all(
        orgs.map(async (org) => {
          const runs = await getRunList(email, org.id).catch(() => []);
          const best =
            runs.find((r) => r.status === "complete") ??
            runs.find((r) => r.status !== "failed") ??
            runs[0];
          return {
            org,
            slug: best?.slug ?? null,
            score: best?.composite_score ?? null,
          };
        }),
      );
    },
  });

  function openBrand(card: BrandCard) {
    setActiveOrg(card.org);
    if (card.slug) {
      router.push(routes.dashboardProject(card.slug));
    } else {
      // No analysis yet for this brand — start one via onboarding.
      router.push(routes.onboardingCompanyInfo);
    }
  }

  if (!email && !isPending) {
    router.replace(routes.signIn);
    return null;
  }

  return (
    <div className="relative min-h-screen">
      <div className="relative z-20 mx-auto flex w-full max-w-5xl flex-col gap-8 px-4 py-6 md:px-8">
        <header className="glass-card flex flex-wrap items-center justify-between gap-3 rounded-lg px-4 py-3">
          <div className="flex items-center gap-3">
            <span className="flex h-9 w-9 items-center justify-center rounded-md bg-foreground text-white">
              <Users className="h-4 w-4" />
            </span>
            <div>
              <h1 className="text-lg font-semibold">Agency workspace</h1>
              <p className="text-xs text-muted-foreground">
                Manage every client brand from one place.
              </p>
            </div>
          </div>
          <button
            onClick={() => router.push(routes.onboardingCompanyInfo)}
            className="auth-cta-btn flex h-9 items-center gap-1.5 rounded-md px-3 text-[13px] font-medium text-white hover:text-white"
          >
            <Plus className="h-3.5 w-3.5" />
            Add client brand
          </button>
        </header>

        {isLoading ? (
          <div className="flex flex-1 items-center justify-center py-20">
            <SignalorLoader size="lg" />
          </div>
        ) : !brands || brands.length === 0 ? (
          <div className="glass-card flex flex-col items-center gap-3 rounded-lg px-6 py-16 text-center">
            <span className="flex h-12 w-12 items-center justify-center rounded-full bg-muted text-muted-foreground">
              <Globe className="h-5 w-5" />
            </span>
            <p className="text-sm font-medium">No client brands yet</p>
            <p className="max-w-sm text-xs text-muted-foreground">
              Add your first client brand to start tracking its AI visibility.
            </p>
            <button
              onClick={() => router.push(routes.onboardingCompanyInfo)}
              className="auth-cta-btn mt-1 flex h-9 items-center gap-1.5 rounded-md px-4 text-[13px] font-medium text-white hover:text-white"
            >
              <Plus className="h-3.5 w-3.5" />
              Add client brand
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {brands.map((card) => (
              <button
                key={card.org.id}
                onClick={() => openBrand(card)}
                className="glass-card group flex flex-col gap-3 rounded-lg p-4 text-left transition-colors hover:border-foreground/40"
              >
                <div className="flex items-center gap-2">
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-muted text-muted-foreground">
                    <Globe className="h-4 w-4" />
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold">{card.org.name}</p>
                    {card.org.url && (
                      <p className="truncate text-xs text-muted-foreground">{card.org.url}</p>
                    )}
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-muted-foreground">
                    {card.score != null ? (
                      <>
                        Score{" "}
                        <span className="font-semibold text-foreground">
                          {Math.round(card.score)}
                        </span>
                      </>
                    ) : (
                      "No analysis yet"
                    )}
                  </span>
                  <ArrowRight className="h-3.5 w-3.5 text-muted-foreground transition-transform group-hover:translate-x-0.5" />
                </div>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
