"use client";

import Link from "next/link";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  Sparkles,
  Loader2,
  TrendingUp,
  TrendingDown,
  ArrowUpRight,
  RefreshCw,
  Search,
  BarChart3,
  Zap,
} from "@fe/components/icons";

import {
  getOverviewInsights,
  regenerateOverviewInsights,
  type OverviewSignals,
} from "@fe/lib/api/analyzer";
import { cn } from "@fe/lib/utils";

function fmtNum(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}K`;
  return `${Math.round(n)}`;
}

const SEVERITY_DOT: Record<string, string> = {
  high: "bg-destructive",
  medium: "bg-amber-500",
  low: "bg-emerald-500",
};

const PRIORITY_STYLE: Record<string, string> = {
  critical: "bg-destructive/10 text-destructive",
  high: "bg-amber-500/10 text-amber-600",
  medium: "bg-primary/10 text-primary",
  low: "bg-muted text-muted-foreground",
};

function TrendIcon({ dir }: { dir: string }) {
  if (dir === "up") return <TrendingUp className="size-3 text-emerald-600" />;
  if (dir === "down") return <TrendingDown className="size-3 text-destructive" />;
  return null;
}

function Tile({
  label,
  value,
  sub,
}: {
  label: string;
  value: React.ReactNode;
  sub?: React.ReactNode;
}) {
  return (
    <div className="rounded-lg border border-border bg-card px-3.5 py-3">
      <p className="text-[10px] font-semibold uppercase tracking-[0.08em] text-muted-foreground">
        {label}
      </p>
      <p className="mt-1 text-xl font-bold tabular-nums text-foreground">{value}</p>
      {sub ? <p className="mt-0.5 text-[11px] text-muted-foreground">{sub}</p> : null}
    </div>
  );
}

function SignalTiles({ signals, slug }: { signals: OverviewSignals; slug: string }) {
  const { geo, ga, gsc } = signals;
  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
      <Tile
        label="GEO score"
        value={geo.composite_score != null ? Math.round(geo.composite_score) : "—"}
        sub="Composite across pillars"
      />
      {ga ? (
        <Tile
          label="Sessions (30d)"
          value={
            <span className="inline-flex items-center gap-1.5">
              {fmtNum(ga.sessions)} <TrendIcon dir={ga.sessions_trend} />
            </span>
          }
          sub={`${ga.organic_pct}% organic`}
        />
      ) : (
        <ConnectTile slug={slug} label="Analytics" icon={<BarChart3 className="size-4" />} />
      )}
      {gsc ? (
        <>
          <Tile
            label="Search clicks"
            value={fmtNum(gsc.clicks)}
            sub={`${fmtNum(gsc.impressions)} impressions`}
          />
          <Tile
            label="Avg position"
            value={gsc.position ? gsc.position.toFixed(1) : "—"}
            sub={
              gsc.indexed_count != null
                ? `${gsc.indexed_count} indexed${
                    gsc.not_indexed_count != null ? ` · ${gsc.not_indexed_count} not` : ""
                  }`
                : `${(gsc.ctr * 100).toFixed(1)}% CTR`
            }
          />
        </>
      ) : (
        <ConnectTile slug={slug} label="Search Console" icon={<Search className="size-4" />} />
      )}
    </div>
  );
}

function ConnectTile({
  slug,
  label,
  icon,
}: {
  slug: string;
  label: string;
  icon: React.ReactNode;
}) {
  return (
    <Link
      href={`/dashboard/${slug}/settings/integrations`}
      className="flex flex-col justify-center rounded-lg border border-dashed border-border bg-muted/20 px-3.5 py-3 transition hover:border-primary/40 hover:bg-primary/5"
    >
      <span className="flex items-center gap-1.5 text-[11px] font-semibold text-muted-foreground">
        {icon} {label}
      </span>
      <span className="mt-1 inline-flex items-center gap-0.5 text-[12px] font-semibold text-primary">
        Connect <ArrowUpRight className="size-3" />
      </span>
    </Link>
  );
}

export function SearchTrafficInsightsCard({ slug }: { slug: string }) {
  const qc = useQueryClient();
  const { data, isLoading } = useQuery({
    queryKey: ["overview-insights", slug],
    queryFn: () => getOverviewInsights(slug),
    enabled: !!slug,
    refetchInterval: (q) => (q.state.data?.generating ? 4000 : false),
  });

  const regen = useMutation({
    mutationFn: () => regenerateOverviewInsights(slug),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["overview-insights", slug] }),
  });

  const report = data?.report ?? null;
  const generating = !!data?.generating || regen.isPending;
  const busy = generating;

  return (
    <div className="flex w-full flex-col gap-4 rounded-xl border border-border bg-card p-5">
      {/* Header */}
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="flex items-center gap-1.5 text-base font-semibold text-foreground">
            <Sparkles className="size-4 text-primary" />
            Actions to improve your SEO &amp; GEO
          </p>
          <p className="mt-0.5 text-[12px] text-muted-foreground">
            AI insights across your GEO score, Search Console &amp; Analytics
            {data?.generated_at ? (
              <> · updated {new Date(data.generated_at).toLocaleDateString("en-US")}</>
            ) : null}
          </p>
        </div>
        <button
          type="button"
          onClick={() => regen.mutate()}
          disabled={busy}
          className={cn(
            "inline-flex h-9 shrink-0 items-center gap-1.5 rounded-md px-3 text-[13px] font-semibold transition disabled:opacity-60",
            report
              ? "border border-border bg-background text-foreground hover:bg-muted"
              : "bg-primary text-primary-foreground hover:opacity-90",
          )}
        >
          {busy ? (
            <Loader2 className="size-3.5 animate-spin" />
          ) : report ? (
            <RefreshCw className="size-3.5" />
          ) : (
            <Sparkles className="size-3.5" />
          )}
          {busy ? "Analyzing…" : report ? "Refresh" : "Generate insights"}
        </button>
      </div>

      {/* Signal tiles */}
      {isLoading ? (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-[68px] animate-pulse rounded-lg bg-muted/40" />
          ))}
        </div>
      ) : data ? (
        <SignalTiles signals={data.signals_summary} slug={slug} />
      ) : null}

      {/* Insights + tasks */}
      {busy && !report ? (
        <div className="flex items-center gap-2 rounded-lg border border-dashed border-border bg-muted/15 px-4 py-6 text-[13px] text-muted-foreground">
          <Loader2 className="size-4 animate-spin text-primary" />
          Analyzing your data and writing recommendations… this takes a few seconds.
        </div>
      ) : !report ? (
        <div className="rounded-lg border border-dashed border-border bg-muted/15 px-4 py-6 text-center text-[13px] text-muted-foreground">
          Generate AI insights from your score
          {data?.signals_summary.flags.has_ga ? ", Analytics" : ""}
          {data?.signals_summary.flags.has_gsc ? " & Search Console" : ""} data — with specific
          actions you can take.
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {report.summary.headline ? (
            <p className="text-[14px] font-medium leading-relaxed text-foreground">
              {report.summary.headline}
            </p>
          ) : null}

          {report.insights.length ? (
            <div className="flex flex-col gap-2">
              {report.insights.map((ins, i) => (
                <div key={i} className="flex items-start gap-2.5">
                  <span
                    className={cn(
                      "mt-1.5 size-2 shrink-0 rounded-full",
                      SEVERITY_DOT[ins.severity] ?? SEVERITY_DOT.medium,
                    )}
                    aria-hidden
                  />
                  <div className="min-w-0">
                    <p className="text-[13px] font-semibold text-foreground">{ins.title}</p>
                    {ins.detail ? (
                      <p className="text-[12px] leading-relaxed text-muted-foreground">
                        {ins.detail}
                      </p>
                    ) : null}
                  </div>
                </div>
              ))}
            </div>
          ) : null}

          {report.tasks.length ? (
            <div className="rounded-lg border border-border bg-muted/20 p-3">
              <div className="mb-2 flex items-center justify-between">
                <p className="flex items-center gap-1.5 text-[12px] font-semibold text-foreground">
                  <Zap className="size-3.5 text-primary" />
                  {report.tasks.length} action{report.tasks.length === 1 ? "" : "s"} added to Tasks
                </p>
                <Link
                  href={`/dashboard/${slug}/recommendations`}
                  className="inline-flex items-center gap-0.5 text-[12px] font-semibold text-primary hover:underline"
                >
                  View all <ArrowUpRight className="size-3" />
                </Link>
              </div>
              <div className="flex flex-col divide-y divide-border/60">
                {report.tasks.slice(0, 4).map((t, i) => (
                  <div key={i} className="flex items-center gap-2 py-2 first:pt-0 last:pb-0">
                    <span
                      className={cn(
                        "shrink-0 rounded px-1.5 py-0.5 text-[10px] font-semibold uppercase",
                        PRIORITY_STYLE[t.priority] ?? PRIORITY_STYLE.medium,
                      )}
                    >
                      {t.priority}
                    </span>
                    <span className="min-w-0 flex-1 truncate text-[13px] text-foreground">
                      {t.title}
                    </span>
                    {t.impact_estimate ? (
                      <span className="shrink-0 text-[11px] font-medium text-emerald-600">
                        {t.impact_estimate}
                      </span>
                    ) : null}
                  </div>
                ))}
              </div>
            </div>
          ) : null}
        </div>
      )}
    </div>
  );
}
