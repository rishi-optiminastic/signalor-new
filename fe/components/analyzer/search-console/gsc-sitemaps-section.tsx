"use client";

import { useEffect, useRef, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { CheckCircle2, ExternalLink, Globe, Loader2, Play, RefreshCw } from "@fe/components/icons";

import { getSitemapAudit, startSitemapAudit } from "@fe/lib/api/analyzer";
import { Skeleton } from "@fe/components/ui/skeleton";
import { fmtDate, fmtNum, prettyUrl } from "./gsc-utils";

export function GscSitemapsSection({ slug }: { slug: string }) {
  const queryClient = useQueryClient();
  const [starting, setStarting] = useState(false);
  const pollRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Only the audit summary is needed here — one page is plenty.
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ["gsc-sitemaps", slug],
    enabled: !!slug,
    queryFn: () => getSitemapAudit(slug, { page: 1, page_size: 1 }),
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
      queryClient.invalidateQueries({ queryKey: ["gsc-sitemaps", slug] });
      queryClient.invalidateQueries({ queryKey: ["gsc-coverage", slug] });
    } catch {
      /* ignore */
    } finally {
      setStarting(false);
    }
  }

  if (isLoading && !data) {
    return <Skeleton className="h-64 w-full" />;
  }

  if (!audit || !audit.sitemap_url) {
    return (
      <div className="rounded-xl border border-dashed border-border bg-card/50 px-6 py-12 text-center">
        <p className="text-sm font-semibold text-foreground">No sitemap found</p>
        <p className="mx-auto mt-1 max-w-sm text-xs text-muted-foreground">
          {error
            ? "Couldn't load the crawl. Retry in a moment."
            : "We couldn't discover a sitemap.xml for this site. Run a crawl to check again."}
        </p>
        <button
          type="button"
          onClick={handleRecrawl}
          disabled={starting}
          className="mt-4 inline-flex items-center gap-1.5 rounded-md bg-primary px-4 py-2 text-xs font-semibold text-primary-foreground transition hover:opacity-90 disabled:opacity-60"
        >
          {starting ? <Loader2 className="size-3.5 animate-spin" /> : <Play className="size-3.5" />}
          Run crawl
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h3 className="text-sm font-semibold text-foreground">Sitemaps</h3>
          <p className="text-xs text-muted-foreground">
            Sitemaps Signalor discovered and crawled for this site.
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

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <Tile
          label="Discovered URLs"
          value={fmtNum(audit.discovered_url_count || audit.total_urls)}
        />
        <Tile label="Crawled" value={fmtNum(audit.total_urls)} />
        <Tile label="Indexed" value={fmtNum(audit.indexed_count)} />
        <Tile label="Errors" value={fmtNum(audit.failed_count)} />
      </div>

      <div className="overflow-x-auto rounded-xl border border-border">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border bg-muted/30 text-left">
              <th className="px-3 py-2.5 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                Sitemap
              </th>
              <th className="w-24 px-3 py-2.5 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                Type
              </th>
              <th className="w-28 px-3 py-2.5 text-right text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                Discovered
              </th>
              <th className="w-32 px-3 py-2.5 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                Last read
              </th>
              <th className="w-24 px-3 py-2.5 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                Status
              </th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b border-border/60 last:border-0 hover:bg-muted/40">
              <td className="max-w-0 px-3 py-2.5">
                <a
                  href={audit.sitemap_url}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-1.5 truncate text-[13px] font-medium text-foreground hover:underline"
                >
                  <Globe className="size-3.5 shrink-0 text-muted-foreground" />
                  <span className="truncate">{prettyUrl(audit.sitemap_url)}</span>
                  <ExternalLink className="size-3 shrink-0 text-muted-foreground" />
                </a>
              </td>
              <td className="px-3 py-2.5 text-xs text-muted-foreground">Sitemap</td>
              <td className="px-3 py-2.5 text-right font-mono text-xs text-foreground">
                {fmtNum(audit.discovered_url_count || audit.total_urls)}
                {audit.truncated ? "+" : ""}
              </td>
              <td className="px-3 py-2.5 text-xs text-muted-foreground">
                {fmtDate(audit.finished_at ?? audit.created_at)}
              </td>
              <td className="px-3 py-2.5">
                <span className="inline-flex items-center gap-1 rounded-full bg-success/10 px-2 py-0.5 text-[10px] font-semibold text-success">
                  <CheckCircle2 className="size-3" />
                  Success
                </span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      {audit.truncated ? (
        <p className="text-[11px] text-muted-foreground">
          This site has more than {fmtNum(audit.total_urls)} URLs — coverage is based on a
          representative sample.
        </p>
      ) : null}
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
