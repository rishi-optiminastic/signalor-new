"use client";

import { useMemo, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Info, Loader2, RefreshCw } from "@fe/components/icons";

import {
  getDomainAnalytics,
  getPromptTracks,
  refreshDomainAnalytics,
  type DomainAnalyticsSnapshot,
  type PromptTrack,
} from "@fe/lib/api/analyzer";
import { Skeleton } from "@fe/components/ui/skeleton";
import { cn } from "@fe/lib/utils";
import { fmtDate, fmtNum, fmtPct, prettyUrl } from "./gsc-utils";

type PerfTab = "queries" | "pages" | "countries";

function hasDomainData(d: DomainAnalyticsSnapshot | undefined): boolean {
  if (!d) return false;
  return d.top_keywords.length > 0 || d.top_pages.length > 0;
}

export function GscPerformanceSection({ slug }: { slug: string }) {
  const queryClient = useQueryClient();
  const [tab, setTab] = useState<PerfTab>("queries");
  const [refreshing, setRefreshing] = useState(false);

  const domainQuery = useQuery({
    queryKey: ["gsc-domain", slug],
    enabled: !!slug,
    retry: false,
    queryFn: () => getDomainAnalytics(slug),
  });

  const domain = domainQuery.data;
  const domainReady = !domainQuery.isLoading;
  const useDomain = hasDomainData(domain);

  // Fall back to the prompt-tracker (AI-visibility) once domain analytics has
  // resolved empty/errored — it's reliably populated for completed runs and is
  // the closest "queries × position" signal Signalor has without Google.
  const promptsQuery = useQuery({
    queryKey: ["gsc-prompts", slug],
    enabled: !!slug && domainReady && !useDomain,
    retry: false,
    queryFn: () => getPromptTracks(slug),
  });

  async function handleRefresh() {
    if (refreshing) return;
    setRefreshing(true);
    try {
      await refreshDomainAnalytics(slug);
      queryClient.invalidateQueries({ queryKey: ["gsc-domain", slug] });
    } catch {
      /* out-of-credits / upstream 502 — the existing view stays */
    } finally {
      setRefreshing(false);
    }
  }

  if (domainQuery.isLoading) return <PerfSkeleton />;

  if (useDomain && domain) {
    return (
      <DomainPerformance
        domain={domain}
        tab={tab}
        setTab={setTab}
        refreshing={refreshing}
        onRefresh={handleRefresh}
      />
    );
  }

  return (
    <PromptPerformance
      tracks={promptsQuery.data ?? []}
      loading={promptsQuery.isLoading}
      refreshing={refreshing}
      onRefresh={handleRefresh}
    />
  );
}

// ─── Estimated-data banner ──────────────────────────────────────────────────

function EstimatedNote({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-start gap-2 rounded-lg border border-warning/40 bg-warning/60 px-3 py-2 text-[11px] text-warning dark:bg-warning/10">
      <Info className="mt-0.5 size-3.5 shrink-0" />
      <p>{children}</p>
    </div>
  );
}

function TabBar({
  tabs,
  active,
  onChange,
}: {
  tabs: { key: string; label: string }[];
  active: string;
  onChange: (k: string) => void;
}) {
  return (
    <div className="flex flex-wrap items-center gap-1 border-b border-border">
      {tabs.map((t) => (
        <button
          key={t.key}
          type="button"
          onClick={() => onChange(t.key)}
          className={cn(
            "relative -mb-px border-b-2 px-3 py-2.5 text-[13px] font-semibold transition-colors",
            active === t.key
              ? "border-primary text-foreground"
              : "border-transparent text-muted-foreground hover:text-foreground",
          )}
        >
          {t.label}
        </button>
      ))}
    </div>
  );
}

function Tile({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-border bg-card p-3">
      <p className="text-[11px] uppercase tracking-wide text-muted-foreground">{label}</p>
      <p className="mt-1 text-xl font-bold text-foreground">{value}</p>
    </div>
  );
}

function RefreshButton({ refreshing, onRefresh }: { refreshing: boolean; onRefresh: () => void }) {
  return (
    <button
      type="button"
      onClick={onRefresh}
      disabled={refreshing}
      className="auth-cta-btn inline-flex items-center gap-1.5 rounded-md px-3 py-2 text-xs font-semibold text-white shadow-sm transition-all motion-safe:hover:-translate-y-px disabled:opacity-60"
    >
      {refreshing ? (
        <Loader2 className="size-3.5 animate-spin" />
      ) : (
        <RefreshCw className="size-3.5" />
      )}
      Refresh
    </button>
  );
}

// ─── Domain-analytics variant ───────────────────────────────────────────────

function DomainPerformance({
  domain,
  tab,
  setTab,
  refreshing,
  onRefresh,
}: {
  domain: DomainAnalyticsSnapshot;
  tab: PerfTab;
  setTab: (t: PerfTab) => void;
  refreshing: boolean;
  onRefresh: () => void;
}) {
  const countries = useMemo(
    () =>
      Object.entries(domain.geo_distribution)
        .map(([country, v]) => ({ country, ...v }))
        .sort((a, b) => b.organic_traffic - a.organic_traffic)
        .slice(0, 25),
    [domain.geo_distribution],
  );

  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h3 className="text-sm font-semibold text-foreground">Search performance</h3>
          <p className="text-xs text-muted-foreground">
            Organic search estimates for {domain.domain}
            {domain.synced_at ? ` · updated ${fmtDate(domain.synced_at)}` : ""}.
          </p>
        </div>
        <RefreshButton refreshing={refreshing} onRefresh={onRefresh} />
      </div>

      <EstimatedNote>
        Estimated from third-party organic-search data — not live Google Search Console clicks.
      </EstimatedNote>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <Tile label="Keywords" value={fmtNum(domain.overview.organic_keywords)} />
        <Tile label="Est. traffic / mo" value={fmtNum(domain.overview.organic_traffic)} />
        <Tile label="Traffic value" value={`$${fmtNum(domain.overview.organic_value_usd)}`} />
        <Tile label="Top pages" value={fmtNum(domain.top_pages.length)} />
      </div>

      <TabBar
        tabs={[
          { key: "queries", label: "Queries" },
          { key: "pages", label: "Pages" },
          { key: "countries", label: "Countries" },
        ]}
        active={tab}
        onChange={(k) => setTab(k as PerfTab)}
      />

      {tab === "queries" ? (
        <DataTable
          empty="No ranking keywords found."
          head={["Query", "Impressions", "Est. clicks", "CTR", "Position"]}
          rows={domain.top_keywords.slice(0, 50).map((k) => {
            const ctr = k.search_volume > 0 ? k.etv / k.search_volume : null;
            return [
              <span key="q" className="font-medium text-foreground">
                {k.keyword}
              </span>,
              fmtNum(k.search_volume),
              fmtNum(k.etv),
              fmtPct(ctr),
              k.position ? `#${k.position}` : "—",
            ];
          })}
          align={[false, true, true, true, true]}
        />
      ) : null}

      {tab === "pages" ? (
        <DataTable
          empty="No top pages found."
          head={["Page", "Traffic", "Keywords", "Value"]}
          rows={domain.top_pages.slice(0, 50).map((p) => [
            <span key="u" className="truncate font-medium text-foreground">
              {prettyUrl(p.url)}
            </span>,
            fmtNum(p.organic_traffic),
            fmtNum(p.organic_keywords),
            `$${fmtNum(p.value_usd)}`,
          ])}
          align={[false, true, true, true]}
        />
      ) : null}

      {tab === "countries" ? (
        <DataTable
          empty="No country data."
          head={["Country", "Traffic", "Keywords", "Value"]}
          rows={countries.map((c) => [
            <span key="c" className="font-medium uppercase text-foreground">
              {c.country}
            </span>,
            fmtNum(c.organic_traffic),
            fmtNum(c.organic_keywords),
            `$${fmtNum(c.organic_value_usd)}`,
          ])}
          align={[false, true, true, true]}
        />
      ) : null}
    </div>
  );
}

// ─── Prompt-tracker (AI-visibility) fallback ────────────────────────────────

function PromptPerformance({
  tracks,
  loading,
  refreshing,
  onRefresh,
}: {
  tracks: PromptTrack[];
  loading: boolean;
  refreshing: boolean;
  onRefresh: () => void;
}) {
  const summary = useMemo(() => {
    if (!tracks.length) return null;
    const ranked = tracks.filter((t) => t.avg_position > 0);
    const avgPos =
      ranked.length > 0 ? ranked.reduce((s, t) => s + t.avg_position, 0) / ranked.length : 0;
    const avgVis = tracks.reduce((s, t) => s + t.visibility_pct, 0) / tracks.length;
    const totalMentions = tracks.reduce((s, t) => s + t.mentions, 0);
    return { count: tracks.length, avgPos, avgVis, totalMentions, ranked: ranked.length };
  }, [tracks]);

  if (loading) return <PerfSkeleton />;

  if (!tracks.length) {
    return (
      <div className="flex flex-col gap-4">
        <EstimatedNote>
          No search-performance data is synced yet. Once prompts are tracked, this shows where your
          brand appears across AI engines.
        </EstimatedNote>
        <div className="rounded-xl border border-dashed border-border bg-card/50 px-6 py-12 text-center">
          <p className="text-sm font-semibold text-foreground">No performance data yet</p>
          <p className="mx-auto mt-1 max-w-sm text-xs text-muted-foreground">
            Track prompts for this site, or sync organic-search data.
          </p>
          <button
            type="button"
            onClick={onRefresh}
            disabled={refreshing}
            className="mt-4 inline-flex items-center gap-1.5 rounded-md border border-border bg-background px-4 py-2 text-xs font-semibold text-foreground transition hover:bg-muted disabled:opacity-60"
          >
            {refreshing ? (
              <Loader2 className="size-3.5 animate-spin" />
            ) : (
              <RefreshCw className="size-3.5" />
            )}
            Sync organic data
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h3 className="text-sm font-semibold text-foreground">Search performance</h3>
          <p className="text-xs text-muted-foreground">
            Where your brand surfaces across AI engines for tracked queries.
          </p>
        </div>
        <RefreshButton refreshing={refreshing} onRefresh={onRefresh} />
      </div>

      <EstimatedNote>
        Estimated from AI-visibility tracking — positions reflect where your brand surfaces across
        ChatGPT, Claude, Gemini, and Perplexity, not live Google Search Console clicks.
      </EstimatedNote>

      {summary ? (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          <Tile label="Queries" value={fmtNum(summary.count)} />
          <Tile label="Avg visibility" value={fmtPct(summary.avgVis / 100)} />
          <Tile
            label="Avg position"
            value={summary.avgPos > 0 ? `#${summary.avgPos.toFixed(1)}` : "—"}
          />
          <Tile label="Total mentions" value={fmtNum(summary.totalMentions)} />
        </div>
      ) : null}

      <DataTable
        empty="No tracked queries."
        head={["Query", "Visibility", "Avg position", "Mentions"]}
        rows={tracks.map((t) => [
          <span key="q" className="font-medium text-foreground">
            {t.prompt_text}
          </span>,
          fmtPct(t.visibility_pct / 100),
          t.avg_position > 0 ? `#${t.avg_position.toFixed(1)}` : "Not ranked",
          fmtNum(t.mentions),
        ])}
        align={[false, true, true, true]}
      />
    </div>
  );
}

// ─── Generic table ──────────────────────────────────────────────────────────

function DataTable({
  head,
  rows,
  align,
  empty,
}: {
  head: string[];
  rows: React.ReactNode[][];
  align: boolean[]; // true = right-align
  empty: string;
}) {
  if (!rows.length) {
    return (
      <div className="rounded-xl border border-dashed border-border bg-card/50 px-5 py-10 text-center text-[13px] text-muted-foreground">
        {empty}
      </div>
    );
  }
  return (
    <div className="overflow-x-auto rounded-xl border border-border">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-border bg-muted/30">
            {head.map((h, i) => (
              <th
                key={h}
                className={cn(
                  "px-3 py-2.5 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground",
                  align[i] ? "text-right" : "text-left",
                )}
              >
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((r, ri) => (
            <tr key={ri} className="border-b border-border/60 last:border-0 hover:bg-muted/40">
              {r.map((cell, ci) => (
                <td
                  key={ci}
                  className={cn(
                    "max-w-0 px-3 py-2.5 text-[13px] text-foreground",
                    align[ci] ? "text-right font-mono" : "truncate",
                  )}
                >
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function PerfSkeleton() {
  return (
    <div className="flex flex-col gap-4">
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="h-20" />
        ))}
      </div>
      <Skeleton className="h-72 w-full" />
    </div>
  );
}
