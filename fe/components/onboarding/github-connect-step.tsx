"use client";

import { useSearchParams } from "next/navigation";
import { useMutation, useQuery } from "@tanstack/react-query";
import { getOrgGithubInstallUrl, getOrgGithubStatus } from "@fe/lib/api/github";
import { Button } from "@fe/components/ui/button";
import { Github, ArrowRight, ArrowLeft, Loader2, CheckCircle2 } from "@fe/components/icons";

/**
 * Onboarding "Next.js" step — connect the org's GitHub repo so Signalor can open
 * fix PRs. Replaces the old @signalor/nextjs SDK install wizard. Org-scoped
 * because no AnalysisRun (slug) exists yet at this point in onboarding.
 */
export function GithubConnectStep({
  email,
  onBack,
  onSkip,
  onConnected,
}: {
  email: string;
  onBack: () => void;
  onSkip: () => void;
  onConnected: () => void;
}) {
  const params = useSearchParams();
  const justReturned = params.get("github") === "connected";

  const { data: status, isLoading } = useQuery({
    queryKey: ["github-org-status", email],
    queryFn: () => getOrgGithubStatus(email),
    enabled: !!email,
    // Just back from GitHub but the install row may be a beat behind — poll briefly.
    refetchInterval: (q) => (justReturned && !q.state.data?.connected ? 2000 : false),
  });

  const connectMut = useMutation({
    mutationFn: () => getOrgGithubInstallUrl(email),
    onSuccess: (url) => {
      window.location.href = url;
    },
  });

  const panel = "rounded-lg border border-neutral-200 bg-white p-4";
  const backBtn = "h-9 flex-1 rounded-md border-neutral-200 bg-white text-[13px] font-medium";
  const skipBtn =
    "h-9 flex-1 rounded-md border-neutral-200 bg-white text-[13px] font-medium text-muted-foreground hover:text-foreground";

  if (isLoading) {
    return (
      <div
        className={`${panel} flex items-center justify-center gap-2 text-[12px] text-muted-foreground`}
      >
        <Loader2 className="h-4 w-4 animate-spin" /> Checking GitHub connection…
      </div>
    );
  }

  const connected = !!status?.connected;
  const configured = !!status?.configured;

  return (
    <div className="space-y-3">
      {connected ? (
        <div className={`${panel} flex items-start gap-3`}>
          <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-emerald-500" />
          <div className="min-w-0">
            <p className="text-[13px] font-semibold text-foreground">GitHub repo connected</p>
            <p className="mt-0.5 text-[12px] text-muted-foreground">
              Signalor will open fix PRs on{" "}
              <span className="font-medium text-foreground">
                {status?.repo_full_name || "your repo"}
              </span>
              . You review &amp; merge — nothing ships without you.
            </p>
          </div>
        </div>
      ) : (
        <div className={`${panel} flex items-start gap-3`}>
          <Github className="mt-0.5 h-5 w-5 shrink-0 text-foreground" />
          <div className="min-w-0">
            <p className="text-[13px] font-semibold text-foreground">Connect your GitHub repo</p>
            <p className="mt-0.5 text-[12px] leading-relaxed text-muted-foreground">
              Signalor opens Pull Requests that fix your GEO issues — JSON-LD schema,{" "}
              <code className="rounded bg-neutral-100 px-1 py-0.5">llms.txt</code>, AI-crawler rules
              and canonical tags. You review and merge each one.
            </p>
            <p className="mt-1 text-[11px] text-muted-foreground/80">
              Works for sites in a GitHub repo you own. WordPress/Shopify use their own connectors.
            </p>
            {!configured ? (
              <p className="mt-2 text-[11px] text-amber-600">
                GitHub connect isn&apos;t enabled on this server yet — you can skip for now.
              </p>
            ) : (
              <Button
                type="button"
                onClick={() => connectMut.mutate()}
                disabled={connectMut.isPending}
                className="auth-cta-btn mt-3 h-9 gap-1.5 rounded-md text-[13px] font-medium text-white hover:text-white"
              >
                {connectMut.isPending ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Github className="h-4 w-4" />
                )}
                Connect GitHub
              </Button>
            )}
          </div>
        </div>
      )}

      <div className="flex gap-2">
        <Button type="button" variant="outline" className={backBtn} onClick={onBack}>
          <ArrowLeft className="h-4 w-4" /> Back
        </Button>
        {connected ? (
          <Button
            type="button"
            onClick={onConnected}
            className="auth-cta-btn h-9 flex-[2] rounded-md text-[13px] font-medium text-white hover:text-white"
          >
            Continue <ArrowRight className="h-4 w-4" />
          </Button>
        ) : (
          <Button type="button" variant="outline" className={skipBtn} onClick={onSkip}>
            Skip for now
          </Button>
        )}
      </div>
    </div>
  );
}
