"use client";

import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";
import { CheckCircle2, ExternalLink, Loader2 } from "@fe/components/icons";

import { getGSCCoverage } from "@fe/lib/api/integrations";
import { Skeleton } from "@fe/components/ui/skeleton";
import { fmtDate, fmtNum, prettyUrl } from "./gsc-utils";

/**
 * Link to the property's Search Console. Google's SPA only serves the
 * `/search-console` entry path on a cold click — deep sub-routes like
 * `/search-console/inspect?...` hard-404 on direct navigation, so we open the
 * property here and copy the URL for pasting into the inspection bar instead.
 * The `resource_id` keeps the literal `sc-domain:` colon (valid in a query).
 */
function gscPropertyLink(property: string): string {
  return `https://search.google.com/search-console?resource_id=${property}`;
}

export function GscCoverageLive({
  email,
  onInspect,
}: {
  email: string;
  onInspect: (url: string) => void;
}) {
  const { data, isLoading, error } = useQuery({
    queryKey: ["gsc-coverage-live", email],
    enabled: !!email,
    retry: false,
    queryFn: () => getGSCCoverage(email),
    // While Google is being inspected URL-by-URL in the background, poll until done.
    refetchInterval: (query) =>
      query.state.data?.sync_status === "syncing" || query.state.data?.sync_status === "pending"
        ? 5000
        : false,
  });

  const isVerifying =
    !!data &&
    (data.sync_status === "syncing" || data.sync_status === "pending") &&
    data.checked_count === 0;

  const hasResults = !!data && data.checked_count > 0;

  const donut = useMemo(() => {
    if (!hasResults) return [];
    return [
      { bucket: "indexed", value: data!.indexed_count, color: "#16a34a" },
      { bucket: "needs", value: data!.not_indexed_count, color: "#f59e0b" },
    ].filter((d) => d.value > 0);
  }, [hasResults, data]);

  if (isLoading) return <CoverageSkeleton />;

  if (error || !data) {
    return (
      <div className="rounded-xl border border-dashed border-border bg-card/50 px-6 py-12 text-center text-[13px] text-muted-foreground">
        Couldn&apos;t load index coverage from Google. Retry in a moment.
      </div>
    );
  }

  // First-time load: the per-URL inspection pass is still running, no cache yet.
  if (isVerifying) {
    return (
      <div className="flex flex-col items-center justify-center gap-3 rounded-xl border border-dashed border-border bg-card/50 px-6 py-16 text-center">
        <Loader2 className="size-6 animate-spin text-primary" />
        <p className="text-[14px] font-semibold text-foreground">
          Verifying index status with Google
        </p>
        <p className="max-w-sm text-[12px] leading-relaxed text-muted-foreground">
          We&apos;re inspecting each page in your sitemap through Search Console to get the real
          Indexed / Not-indexed split. This runs once and can take a minute — it&apos;ll appear here
          automatically.
        </p>
      </div>
    );
  }

  const total = data.indexed_count + data.not_indexed_count;
  const indexedPct = total > 0 ? Math.round((data.indexed_count / total) * 100) : 0;

  return (
    <div className="flex flex-col gap-5">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="text-[15px] font-semibold text-foreground">Index coverage</h3>
          <p className="text-[12px] text-muted-foreground">
            Real Indexed / Not-indexed status from Search Console URL inspection
            {data.checked_at ? ` · checked ${fmtDate(data.checked_at)}` : ""}.
          </p>
        </div>
        {data.sync_status === "syncing" ? (
          <span className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-2.5 py-1 text-[11px] font-medium text-primary">
            <Loader2 className="size-3 animate-spin" />
            Refreshing
          </span>
        ) : null}
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-[260px_1fr]">
        {/* Indexed vs needs-indexing donut */}
        <div className="rounded-xl border border-border bg-card p-4">
          <div className="relative h-44">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={donut}
                  dataKey="value"
                  nameKey="bucket"
                  innerRadius={52}
                  outerRadius={78}
                  paddingAngle={donut.length > 1 ? 2 : 0}
                  strokeWidth={0}
                >
                  {donut.map((d) => (
                    <Cell key={d.bucket} fill={d.color} />
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
                    name === "indexed" ? "Indexed" : "Not indexed",
                  ]}
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-2xl font-bold text-foreground">{indexedPct}%</span>
              <span className="text-[10px] uppercase tracking-wide text-muted-foreground">
                indexed
              </span>
            </div>
          </div>
          <div className="mt-2 flex items-center justify-around text-center">
            <div>
              <p className="text-lg font-bold text-emerald-600">{fmtNum(data.indexed_count)}</p>
              <p className="text-[10px] uppercase tracking-wide text-muted-foreground">Indexed</p>
            </div>
            <div className="h-8 w-px bg-border" />
            <div>
              <p className="text-lg font-bold text-amber-600">{fmtNum(data.not_indexed_count)}</p>
              <p className="text-[10px] uppercase tracking-wide text-muted-foreground">
                Not indexed
              </p>
            </div>
            <div className="h-8 w-px bg-border" />
            <div>
              <p className="text-lg font-bold text-foreground">{fmtNum(data.checked_count)}</p>
              <p className="text-[10px] uppercase tracking-wide text-muted-foreground">Checked</p>
            </div>
          </div>
        </div>

        {/* Indexed pages */}
        <div className="rounded-xl border border-border bg-card p-4">
          <p className="mb-1 text-[12px] font-semibold text-foreground">
            Indexed ({fmtNum(data.indexed_count)})
          </p>
          <p className="mb-3 text-[11px] text-muted-foreground">
            On Google per URL inspection. Search metrics are from the last 90 days.
          </p>
          <IndexedTable pages={data.pages.slice(0, 100)} onInspect={onInspect} />
        </div>
      </div>

      {/* Needs indexing */}
      <div className="rounded-xl border border-border bg-card p-4">
        <p className="mb-1 text-[12px] font-semibold text-foreground">
          Not indexed ({fmtNum(data.not_indexed_count)})
        </p>
        <p className="mb-3 text-[11px] text-muted-foreground">
          Submitted in your sitemap but not on Google — the reason is Google&apos;s own coverage
          verdict. Click a row to inspect it here, or hit &ldquo;Request indexing&rdquo; to open
          Search Console with the URL copied (paste it into the bar at the top, then Request
          indexing).
        </p>
        <NotIndexedList
          pages={data.not_indexed.slice(0, 200)}
          property={data.property}
          onInspect={onInspect}
        />
      </div>
    </div>
  );
}

function IndexedTable({
  pages,
  onInspect,
}: {
  pages: { url: string; clicks: number; impressions: number; ctr: number; position: number }[];
  onInspect: (url: string) => void;
}) {
  if (!pages.length) {
    return (
      <div className="rounded-xl border border-dashed border-border bg-card/50 px-5 py-10 text-center text-[13px] text-muted-foreground">
        No indexed pages found in your sitemap.
      </div>
    );
  }
  return (
    <div className="max-h-[420px] overflow-auto rounded-xl border border-border">
      <table className="w-full text-sm">
        <thead className="sticky top-0 bg-muted/30">
          <tr className="border-b border-border text-left">
            <th className="px-3 py-2.5 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
              Page
            </th>
            <th className="w-24 px-3 py-2.5 text-right text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
              Impr.
            </th>
            <th className="w-20 px-3 py-2.5 text-right text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
              Clicks
            </th>
            <th className="w-20 px-3 py-2.5 text-right text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
              Pos.
            </th>
            <th className="w-10 px-3 py-2.5" />
          </tr>
        </thead>
        <tbody>
          {pages.map((p) => (
            <tr
              key={p.url}
              className="cursor-pointer border-b border-border/60 transition-colors last:border-0 hover:bg-muted/40"
              onClick={() => onInspect(p.url)}
              title={`Inspect ${prettyUrl(p.url)}`}
            >
              <td className="max-w-0 px-3 py-2.5">
                <p className="flex items-center gap-1.5 truncate text-[13px] font-medium text-foreground">
                  <CheckCircle2 className="size-3.5 shrink-0 text-emerald-600" />
                  <span className="truncate">{prettyUrl(p.url)}</span>
                </p>
              </td>
              <td className="px-3 py-2.5 text-right font-mono text-[12px] text-foreground">
                {fmtNum(p.impressions)}
              </td>
              <td className="px-3 py-2.5 text-right font-mono text-[12px] text-foreground">
                {fmtNum(p.clicks)}
              </td>
              <td className="px-3 py-2.5 text-right font-mono text-[12px] text-foreground">
                {p.position ? p.position.toFixed(1) : "—"}
              </td>
              <td className="px-3 py-2.5 text-right">
                <ExternalLink className="ml-auto size-3.5 text-muted-foreground" />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function NotIndexedList({
  pages,
  property,
  onInspect,
}: {
  pages: { url: string; reason: string }[];
  property: string;
  onInspect: (url: string) => void;
}) {
  if (!pages.length) {
    return (
      <div className="rounded-xl border border-dashed border-border bg-card/50 px-5 py-10 text-center text-[13px] text-muted-foreground">
        Every submitted page is indexed — nothing needs indexing.
      </div>
    );
  }
  return (
    <div className="max-h-[420px] overflow-auto rounded-xl border border-border">
      <table className="w-full text-sm">
        <tbody>
          {pages.map((p) => (
            <tr
              key={p.url}
              className="group border-b border-border/60 transition-colors last:border-0 hover:bg-muted/40"
            >
              <td
                className="max-w-0 cursor-pointer px-3 py-2.5"
                onClick={() => onInspect(p.url)}
                title={`Inspect ${prettyUrl(p.url)}`}
              >
                <p className="flex items-center gap-1.5 truncate text-[13px] font-medium text-foreground">
                  <span className="size-2 shrink-0 rounded-full bg-amber-500" aria-hidden />
                  <span className="truncate">{prettyUrl(p.url)}</span>
                </p>
              </td>
              <td className="hidden whitespace-nowrap px-3 py-2.5 text-[12px] text-muted-foreground sm:table-cell">
                {p.reason || "Not indexed"}
              </td>
              <td className="w-px whitespace-nowrap px-3 py-2.5 text-right">
                {property ? (
                  <a
                    href={gscPropertyLink(property)}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(e) => {
                      e.stopPropagation();
                      navigator.clipboard?.writeText(p.url).catch(() => {});
                    }}
                    title="Opens Search Console and copies this URL — paste it into the inspection bar at the top, then click Request indexing"
                    className="inline-flex items-center gap-1 text-[12px] font-medium text-primary hover:underline"
                  >
                    Request indexing
                    <ExternalLink className="size-3" />
                  </a>
                ) : null}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function CoverageSkeleton() {
  return (
    <div className="flex flex-col gap-5">
      <Skeleton className="h-10 w-full" />
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-[260px_1fr]">
        <Skeleton className="h-64" />
        <Skeleton className="h-64" />
      </div>
    </div>
  );
}
