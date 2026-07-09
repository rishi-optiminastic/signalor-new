"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";
import {
  AlertTriangle,
  CheckCircle2,
  ExternalLink,
  Loader2,
  Play,
  RefreshCw,
  XCircle,
} from "@fe/components/icons";

import {
  getSitemapAudit,
  startSitemapAudit,
  type SitemapAuditPage,
  type SitemapPageState,
} from "@fe/lib/api/analyzer";
import { Skeleton } from "@fe/components/ui/skeleton";
import { cn } from "@fe/lib/utils";
import {
  COVERAGE_COLOR,
  COVERAGE_LABEL,
  coverageBucket,
  fmtDate,
  fmtNum,
  prettyUrl,
  type CoverageBucket,
} from "./gsc-utils";

type StateTab = { key: SitemapPageState; label: string };

const STATE_TABS: StateTab[] = [
  { key: "crawled", label: "Indexed" },
  { key: "redirect", label: "Redirects" },
  { key: "failed", label: "Errors" },
  { key: "queued", label: "Discovered" },
];

export function GscCoverageSection({
  slug,
  onInspect,
}: {
  slug: string;
  onInspect: (url: string) => void;
}) {
  const queryClient = useQueryClient();
  const [state, setState] = useState<SitemapPageState>("crawled");
  const [starting, setStarting] = useState(false);
  const pollRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ["gsc-coverage", slug, state],
    enabled: !!slug,
    queryFn: () => getSitemapAudit(slug, { state, sort: "-ai_score", page: 1, page_size: 100 }),
  });

  const audit = data?.audit ?? null;
  const isRunning = audit?.status === "running" || audit?.status === "queued";

  useEffect(() => {
    return () => {
      if (pollRef.current) clearTimeout(pollRef.current);
    };
  }, []);

  useEffect(() => {
    if (!isRunning) return;
    if (pollRef.current) clearTimeout(pollRef.current);
    pollRef.current = setTimeout(() => void refetch(), 2200);
  }, [isRunning, data, refetch]);

  async function handleRecrawl() {
    if (starting) return;
    setStarting(true);
    try {
      await startSitemapAudit(slug);
      queryClient.invalidateQueries({ queryKey: ["gsc-coverage", slug] });
      queryClient.invalidateQueries({ queryKey: ["gsc-sitemaps", slug] });
    } catch {
      /* surfaced via the next refetch */
    } finally {
      setStarting(false);
    }
  }

  // Donut + reason breakdown come straight from the audit summary (returned
  // with every call), so they reflect the whole crawl, not just this tab.
  const donut = useMemo(() => {
    if (!audit) return [];
    return [
      { bucket: "indexed" as CoverageBucket, value: audit.indexed_count },
      { bucket: "redirect" as CoverageBucket, value: audit.redirect_count },
      { bucket: "error" as CoverageBucket, value: audit.failed_count },
      { bucket: "discovered" as CoverageBucket, value: audit.queued_count },
    ].filter((d) => d.value > 0);
  }, [audit]);

  if (isLoading && !data) return <CoverageSkeleton />;

  if (!audit) {
    return (
      <WaitingCard
        title="No crawl yet"
        subtitle="Run a crawl to build your index-coverage report from this site's own pages."
        starting={starting}
        onStart={handleRecrawl}
        error={error ? "Couldn't load coverage. Retry in a moment." : null}
      />
    );
  }

  // Audit exists but recorded nothing — a failed crawl or a site with no
  // discoverable sitemap. Show a clear reason + re-crawl rather than a hollow
  // 0% donut and empty tabs.
  if (audit.total_urls === 0 && !isRunning) {
    return (
      <WaitingCard
        title={audit.status === "failed" ? "Crawl couldn't complete" : "No pages crawled"}
        subtitle={
          !audit.sitemap_url
            ? "We couldn't discover a sitemap.xml for this site, so there are no pages to report. Re-crawl to try again."
            : "The last crawl didn't return any pages. This can happen when the site blocks crawlers. Re-crawl to try again."
        }
        starting={starting}
        onStart={handleRecrawl}
        error={null}
      />
    );
  }

  const indexed = audit.indexed_count;
  const notIndexed = audit.redirect_count + audit.failed_count + audit.queued_count;
  const totalKnown = indexed + notIndexed || 1;
  const pages = data?.pages ?? [];

  return (
    <div className="flex flex-col gap-5">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h3 className="text-sm font-semibold text-foreground">Index coverage</h3>
          <p className="text-xs text-muted-foreground">
            How many of your pages are indexable, based on Signalor&apos;s crawl
            {audit.truncated ? ` (sampled — first ${audit.total_urls} URLs)` : ""}. Last crawled{" "}
            {fmtDate(audit.finished_at ?? audit.created_at)}.
          </p>
        </div>
        <button
          type="button"
          onClick={handleRecrawl}
          disabled={starting || isRunning}
          className="auth-cta-btn inline-flex items-center gap-1.5 rounded-md px-3 py-2 text-xs font-semibold text-white shadow-sm transition-all motion-safe:hover:-translate-y-px disabled:opacity-60"
        >
          {starting || isRunning ? (
            <Loader2 className="size-3.5 animate-spin" />
          ) : (
            <RefreshCw className="size-3.5" />
          )}
          {isRunning ? "Crawling…" : "Re-crawl"}
        </button>
      </div>

      {/* Donut + summary */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-[260px_1fr]">
        <div className="rounded-xl border border-border bg-card p-4">
          <div className="relative h-44">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={donut.length ? donut : [{ bucket: "discovered", value: 1 }]}
                  dataKey="value"
                  nameKey="bucket"
                  innerRadius={52}
                  outerRadius={78}
                  paddingAngle={donut.length > 1 ? 2 : 0}
                  strokeWidth={0}
                >
                  {(donut.length
                    ? donut
                    : [{ bucket: "discovered" as CoverageBucket, value: 1 }]
                  ).map((d) => (
                    <Cell key={d.bucket} fill={COVERAGE_COLOR[d.bucket]} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    borderRadius: 8,
                    border: "1px solid var(--border)",
                    fontSize: 12,
                  }}
                  formatter={(value, name) => [
                    fmtNum(typeof value === "number" ? value : Number(value)),
                    COVERAGE_LABEL[name as CoverageBucket] ?? String(name),
                  ]}
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-2xl font-bold text-foreground">
                {Math.round((indexed / totalKnown) * 100)}%
              </span>
              <span className="text-[10px] uppercase tracking-wide text-muted-foreground">
                indexed
              </span>
            </div>
          </div>
          <div className="mt-2 flex items-center justify-around text-center">
            <div>
              <p className="text-lg font-bold text-success">{fmtNum(indexed)}</p>
              <p className="text-[10px] uppercase tracking-wide text-muted-foreground">Indexed</p>
            </div>
            <div className="h-8 w-px bg-border" />
            <div>
              <p className="text-lg font-bold text-destructive">{fmtNum(notIndexed)}</p>
              <p className="text-[10px] uppercase tracking-wide text-muted-foreground">
                Not indexed
              </p>
            </div>
          </div>
        </div>

        {/* Reason breakdown */}
        <div className="rounded-xl border border-border bg-card p-4">
          <p className="mb-3 text-xs font-semibold text-foreground">
            Why pages aren&apos;t indexed
          </p>
          <ul className="flex flex-col gap-2">
            <ReasonRow bucket="indexed" count={audit.indexed_count} total={audit.total_urls} />
            <ReasonRow bucket="redirect" count={audit.redirect_count} total={audit.total_urls} />
            <ReasonRow bucket="error" count={audit.failed_count} total={audit.total_urls} />
            <ReasonRow bucket="discovered" count={audit.queued_count} total={audit.total_urls} />
          </ul>
        </div>
      </div>

      {/* State tabs */}
      <div className="flex flex-wrap items-center gap-1 border-b border-border">
        {STATE_TABS.map((t) => {
          const count =
            t.key === "crawled"
              ? audit.indexed_count
              : t.key === "redirect"
                ? audit.redirect_count
                : t.key === "failed"
                  ? audit.failed_count
                  : audit.queued_count;
          return (
            <button
              key={t.key}
              type="button"
              onClick={() => setState(t.key)}
              className={cn(
                "relative -mb-px flex items-center gap-1.5 border-b-2 px-3 py-2.5 text-[13px] font-semibold transition-colors",
                state === t.key
                  ? "border-primary text-foreground"
                  : "border-transparent text-muted-foreground hover:text-foreground",
              )}
            >
              {t.label}
              <span className="rounded-full bg-muted px-1.5 py-0.5 text-[10px] font-semibold text-muted-foreground">
                {fmtNum(count)}
              </span>
            </button>
          );
        })}
      </div>

      {/* Pages table */}
      <CoverageTable pages={pages} onInspect={onInspect} />
    </div>
  );
}

function ReasonRow({
  bucket,
  count,
  total,
}: {
  bucket: CoverageBucket;
  count: number;
  total: number;
}) {
  const pct = total > 0 ? Math.round((count / total) * 100) : 0;
  return (
    <li className="flex items-center gap-3">
      <span
        className="size-2.5 shrink-0 rounded-sm"
        style={{ backgroundColor: COVERAGE_COLOR[bucket] }}
      />
      <span className="flex-1 text-xs text-foreground">{COVERAGE_LABEL[bucket]}</span>
      <span className="text-xs font-semibold text-foreground">{fmtNum(count)}</span>
      <span className="w-10 text-right text-[11px] text-muted-foreground">{pct}%</span>
    </li>
  );
}

function CoverageTable({
  pages,
  onInspect,
}: {
  pages: SitemapAuditPage[];
  onInspect: (url: string) => void;
}) {
  if (!pages.length) {
    return (
      <div className="rounded-xl border border-dashed border-border bg-card/50 px-5 py-10 text-center text-[13px] text-muted-foreground">
        No pages in this state.
      </div>
    );
  }
  return (
    <div className="overflow-x-auto rounded-xl border border-border">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-border bg-muted/30 text-left">
            <th className="px-3 py-2.5 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
              Page
            </th>
            <th className="w-28 px-3 py-2.5 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
              Coverage
            </th>
            <th className="w-20 px-3 py-2.5 text-right text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
              Status
            </th>
            <th className="w-12 px-3 py-2.5" />
          </tr>
        </thead>
        <tbody>
          {pages.map((p) => {
            const bucket = coverageBucket(p);
            return (
              <tr
                key={p.id}
                className="cursor-pointer border-b border-border/60 transition-colors last:border-0 hover:bg-muted/40"
                onClick={() => onInspect(p.url)}
              >
                <td className="max-w-0 px-3 py-2.5">
                  <p className="truncate text-[13px] font-medium text-foreground">
                    {p.title || prettyUrl(p.url)}
                  </p>
                  <p className="truncate text-[11px] text-muted-foreground">{prettyUrl(p.url)}</p>
                </td>
                <td className="px-3 py-2.5">
                  <CoveragePill bucket={bucket} />
                </td>
                <td className="px-3 py-2.5 text-right font-mono text-xs text-foreground">
                  {p.status_code || "—"}
                </td>
                <td className="px-3 py-2.5 text-right">
                  <ExternalLink className="ml-auto size-3.5 text-muted-foreground" />
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

export function CoveragePill({ bucket }: { bucket: CoverageBucket }) {
  const Icon = bucket === "indexed" ? CheckCircle2 : bucket === "error" ? XCircle : AlertTriangle;
  return (
    <span
      className="inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-semibold"
      style={{
        backgroundColor: `${COVERAGE_COLOR[bucket]}1a`,
        color: COVERAGE_COLOR[bucket],
      }}
    >
      <Icon className="size-3" />
      {COVERAGE_LABEL[bucket]}
    </span>
  );
}

function WaitingCard({
  title,
  subtitle,
  starting,
  onStart,
  error,
}: {
  title: string;
  subtitle: string;
  starting: boolean;
  onStart: () => void;
  error: string | null;
}) {
  return (
    <div className="rounded-xl border border-dashed border-border bg-card/50 px-6 py-12 text-center">
      <p className="text-sm font-semibold text-foreground">{title}</p>
      <p className="mx-auto mt-1 max-w-sm text-xs text-muted-foreground">{subtitle}</p>
      {error ? <p className="mt-2 text-xs text-destructive">{error}</p> : null}
      <button
        type="button"
        onClick={onStart}
        disabled={starting}
        className="mt-4 inline-flex items-center gap-1.5 rounded-md bg-primary px-4 py-2 text-xs font-semibold text-primary-foreground transition hover:opacity-90 disabled:opacity-60"
      >
        {starting ? <Loader2 className="size-3.5 animate-spin" /> : <Play className="size-3.5" />}
        Start crawl
      </button>
    </div>
  );
}

function CoverageSkeleton() {
  return (
    <div className="flex flex-col gap-5">
      <Skeleton className="h-12 w-full" />
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-[260px_1fr]">
        <Skeleton className="h-64" />
        <Skeleton className="h-64" />
      </div>
      <Skeleton className="h-64 w-full" />
    </div>
  );
}
