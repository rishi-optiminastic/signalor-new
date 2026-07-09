"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { AlertTriangle, CheckCircle2, FileText, Globe, Loader2, Search } from "@fe/components/icons";

import { useSession } from "@fe/lib/auth-client";
import { getGSCAuthUrl, getIntegrationStatus } from "@fe/lib/api/integrations";
import { GSCSiteSelector } from "@fe/components/integrations/gsc-site-selector";
import { GSCPerformanceTab } from "@fe/components/integrations/gsc-performance-tab";
import { Skeleton } from "@fe/components/ui/skeleton";
import { cn } from "@fe/lib/utils";
import { GscCoverageLive } from "./gsc-coverage-live";
import { GscIssuesSection } from "./gsc-issues-section";
import { GscSitemapsLive } from "./gsc-sitemaps-live";
import { GscUrlInspector } from "./gsc-url-inspector";

type Tab = "coverage" | "issues" | "performance" | "sitemaps" | "inspect";

const TABS: { key: Tab; label: string; icon: React.ReactNode }[] = [
  { key: "coverage", label: "Index coverage", icon: <FileText className="size-3.5" /> },
  { key: "issues", label: "Issues", icon: <AlertTriangle className="size-3.5" /> },
  { key: "performance", label: "Performance", icon: <Search className="size-3.5" /> },
  { key: "sitemaps", label: "Sitemaps", icon: <Globe className="size-3.5" /> },
  { key: "inspect", label: "URL inspection", icon: <Search className="size-3.5" /> },
];

export function SearchConsoleShell({ slug }: { slug: string }) {
  const [tab, setTab] = useState<Tab>("coverage");
  const [inspectUrl, setInspectUrl] = useState<string>("");
  const [connecting, setConnecting] = useState(false);

  const { data: session } = useSession();
  const email = session?.user?.email ?? "";
  const searchParams = useSearchParams();
  const queryClient = useQueryClient();

  const { data: integrations = [], isLoading: integrationsLoading } = useQuery({
    queryKey: ["integration-status", email],
    enabled: !!email,
    queryFn: () => getIntegrationStatus(email),
  });

  const gscIntegration = integrations.find(
    (i) => i.provider === "google_search_console" && i.is_active,
  );
  const siteUrl =
    typeof gscIntegration?.metadata?.site_url === "string"
      ? (gscIntegration.metadata.site_url as string)
      : "";

  function refreshIntegrations() {
    if (email) queryClient.invalidateQueries({ queryKey: ["integration-status", email] });
  }

  // The GSC OAuth callback redirects back here with ?gsc=connected — refresh so
  // the connected state + property selector appear without a manual reload.
  useEffect(() => {
    if (searchParams.get("gsc") === "connected") refreshIntegrations();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]);

  async function handleConnect() {
    if (!email || connecting) return;
    setConnecting(true);
    try {
      const returnTo = typeof window !== "undefined" ? window.location.pathname : "/";
      const { auth_url } = await getGSCAuthUrl(email, returnTo);
      window.location.href = auth_url;
    } catch {
      setConnecting(false);
    }
  }

  function inspect(url: string) {
    setInspectUrl(url);
    setTab("inspect");
  }

  // ── Gate: the page is Google Search Console — it requires a Google connection ──
  if (email && integrationsLoading) {
    return (
      <div className="flex flex-col gap-4">
        <Skeleton className="h-40 w-full" />
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  if (!gscIntegration) {
    return <ConnectWall connecting={connecting} onConnect={handleConnect} />;
  }

  // Connected, but no property chosen yet — prompt selection before any data.
  if (!siteUrl) {
    return (
      <div className="flex flex-col gap-6">
        <div className="flex flex-wrap items-center gap-2 rounded-lg border border-emerald-500/25 bg-emerald-500/10 px-3 py-2 text-[12px] text-emerald-800 dark:text-emerald-400">
          <CheckCircle2 className="size-4 shrink-0" />
          <span className="font-semibold">Google account connected</span>
          <span className="text-emerald-700/70 dark:text-emerald-500/70">
            · pick a property to continue
          </span>
        </div>
        <div className="rounded-lg border border-border bg-card p-4">
          <GSCSiteSelector email={email} onSiteSelected={refreshIntegrations} />
        </div>
      </div>
    );
  }

  // ── Connected + property selected — live Search Console data ──
  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-center gap-2 rounded-lg border border-emerald-500/25 bg-emerald-500/10 px-3 py-2 text-[12px] text-emerald-800 dark:text-emerald-400">
        <CheckCircle2 className="size-4 shrink-0" />
        <span className="font-semibold">Live data from Google Search Console</span>
        <span className="text-emerald-700/70 dark:text-emerald-500/70">· {siteUrl}</span>
      </div>

      <div className="flex flex-wrap items-center gap-1 border-b border-border">
        {TABS.map((t) => (
          <button
            key={t.key}
            type="button"
            onClick={() => setTab(t.key)}
            className={cn(
              "relative -mb-px flex items-center gap-1.5 border-b-2 px-3 py-2.5 text-[13px] font-semibold transition-colors",
              tab === t.key
                ? "border-primary text-foreground"
                : "border-transparent text-muted-foreground hover:text-foreground",
            )}
          >
            {t.icon}
            {t.label}
          </button>
        ))}
      </div>

      {tab === "coverage" ? <GscCoverageLive email={email} onInspect={inspect} /> : null}
      {tab === "issues" ? <GscIssuesSection slug={slug} onInspect={inspect} /> : null}
      {tab === "performance" ? <GSCPerformanceTab email={email} /> : null}
      {tab === "sitemaps" ? <GscSitemapsLive email={email} /> : null}
      {tab === "inspect" ? (
        <GscUrlInspector slug={slug} initialUrl={inspectUrl} email={email} />
      ) : null}
    </div>
  );
}

// ─── Connect wall ─────────────────────────────────────────────────────────────

function ConnectWall({ connecting, onConnect }: { connecting: boolean; onConnect: () => void }) {
  return (
    <div className="flex min-h-[60vh] items-center justify-center">
      <div className="mx-auto max-w-md rounded-2xl border border-border bg-card px-8 py-12 text-center shadow-[0_1px_3px_rgba(0,0,0,0.06)] dark:shadow-none">
        <div className="mx-auto flex size-14 items-center justify-center rounded-full bg-primary/10">
          <Search className="size-7 text-primary" />
        </div>
        <h2 className="mt-5 text-lg font-semibold text-foreground">
          Connect Google Search Console
        </h2>
        <p className="mx-auto mt-2 max-w-sm text-[13px] leading-relaxed text-muted-foreground">
          Link your Google account to see live index coverage, search performance, sitemaps, and URL
          inspection straight from Google Search Console.
        </p>
        <button
          type="button"
          onClick={onConnect}
          disabled={connecting}
          className="auth-cta-btn mt-6 inline-flex items-center gap-2 rounded-lg px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-all motion-safe:hover:-translate-y-px disabled:opacity-60"
        >
          {connecting ? <Loader2 className="size-4 animate-spin" /> : <Search className="size-4" />}
          {connecting ? "Redirecting…" : "Connect Search Console"}
        </button>
      </div>
    </div>
  );
}
