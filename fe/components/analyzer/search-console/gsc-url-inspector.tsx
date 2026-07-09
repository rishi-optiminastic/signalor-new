"use client";

import { useEffect, useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { AlertTriangle, CheckCircle2, Loader2, Search, XCircle } from "@fe/components/icons";

import { getSitemapAudit, type SitemapAuditPage } from "@fe/lib/api/analyzer";
import { inspectGSCUrl, type GSCInspection } from "@fe/lib/api/integrations";
import { Input } from "@fe/components/ui/input";
import { Skeleton } from "@fe/components/ui/skeleton";
import { cn } from "@fe/lib/utils";
import { fmtDate, fmtMs, inspectionVerdict, prettyUrl } from "./gsc-utils";

/** Normalise a URL for matching: drop scheme, www., trailing slash, lowercase. */
function norm(u: string): string {
  return u
    .trim()
    .replace(/^https?:\/\//i, "")
    .replace(/^www\./i, "")
    .replace(/\/+$/, "")
    .toLowerCase();
}

export function GscUrlInspector({
  slug,
  initialUrl,
  email,
}: {
  slug: string;
  initialUrl?: string;
  /** When set, the page is connected to live Search Console — run the real URL Inspection API. */
  email?: string;
}) {
  const [input, setInput] = useState(initialUrl ?? "");
  const [submitted, setSubmitted] = useState(initialUrl ?? "");

  // Pull the whole crawl once and match client-side — robust to scheme/www
  // differences and lets us suggest close matches.
  const { data, isLoading } = useQuery({
    queryKey: ["gsc-inspect-pages", slug],
    enabled: !!slug,
    queryFn: () => getSitemapAudit(slug, { page: 1, page_size: 200 }),
  });

  // Live URL Inspection from Google (only when a property is connected).
  const liveInspect = useQuery({
    queryKey: ["gsc-live-inspect", email, submitted],
    enabled: !!email && !!submitted,
    retry: false,
    queryFn: () => inspectGSCUrl(email as string, submitted),
  });

  const pages = useMemo(() => data?.pages ?? [], [data]);

  // When the parent deep-links a URL (coverage/issues row), inspect it.
  useEffect(() => {
    if (initialUrl) {
      setInput(initialUrl);
      setSubmitted(initialUrl);
    }
  }, [initialUrl]);

  const { match, suggestions } = useMemo(() => {
    if (!submitted || !pages.length) return { match: null, suggestions: [] as SitemapAuditPage[] };
    const target = norm(submitted);
    const exact = pages.find((p) => norm(p.url) === target);
    if (exact) return { match: exact, suggestions: [] as SitemapAuditPage[] };
    // No exact hit — offer pages whose URL contains the typed fragment.
    const sugg = pages
      .filter((p) => norm(p.url).includes(target) || target.includes(norm(p.url)))
      .slice(0, 8);
    return { match: null, suggestions: sugg };
  }, [submitted, pages]);

  function submit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitted(input.trim());
  }

  return (
    <div className="flex flex-col gap-5">
      <div>
        <h3 className="text-sm font-semibold text-foreground">URL inspection</h3>
        <p className="text-xs text-muted-foreground">
          Check the crawl status of any page crawled for this site.
        </p>
      </div>

      <form onSubmit={submit} className="flex items-center gap-2">
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="https://example.com/page"
            className="pl-9"
            list="gsc-url-options"
          />
          {/* Native autocomplete from the crawled URLs */}
          <datalist id="gsc-url-options">
            {pages.slice(0, 200).map((p) => (
              <option key={p.id} value={p.url} />
            ))}
          </datalist>
        </div>
        <button
          type="submit"
          disabled={!input.trim() || isLoading}
          className="inline-flex items-center gap-1.5 rounded-md bg-primary px-4 py-2 text-[13px] font-semibold text-primary-foreground transition hover:opacity-90 disabled:opacity-60"
        >
          {isLoading ? (
            <Loader2 className="size-3.5 animate-spin" />
          ) : (
            <Search className="size-3.5" />
          )}
          Inspect
        </button>
      </form>

      {/* Live verdict straight from Google Search Console (when connected). */}
      {email && submitted ? (
        liveInspect.isLoading ? (
          <Skeleton className="h-24 w-full" />
        ) : liveInspect.data ? (
          <LiveInspection result={liveInspect.data} />
        ) : null
      ) : null}

      {isLoading ? (
        <Skeleton className="h-64 w-full" />
      ) : !submitted ? (
        <EmptyHint
          pages={pages}
          onPick={(u) => {
            setInput(u);
            setSubmitted(u);
          }}
        />
      ) : match ? (
        <InspectionResult page={match} />
      ) : suggestions.length ? (
        <Suggestions
          query={submitted}
          items={suggestions}
          onPick={(u) => {
            setInput(u);
            setSubmitted(u);
          }}
        />
      ) : (
        <NotFound query={submitted} />
      )}
    </div>
  );
}

function EmptyHint({
  pages,
  onPick,
}: {
  pages: SitemapAuditPage[];
  onPick: (url: string) => void;
}) {
  if (!pages.length) {
    return (
      <div className="rounded-xl border border-dashed border-border bg-card/50 px-5 py-10 text-center text-[13px] text-muted-foreground">
        Enter a URL above to inspect its index status.
      </div>
    );
  }
  return (
    <div className="rounded-xl border border-border bg-card p-4">
      <p className="mb-2 text-xs font-semibold text-foreground">Pages in this crawl</p>
      <ul className="flex flex-col divide-y divide-border/60">
        {pages.slice(0, 10).map((p) => (
          <li key={p.id}>
            <button
              type="button"
              onClick={() => onPick(p.url)}
              className="flex w-full items-center gap-2 py-2 text-left text-xs text-foreground transition-colors hover:text-primary"
            >
              <Search className="size-3.5 shrink-0 text-muted-foreground" />
              <span className="truncate">{prettyUrl(p.url)}</span>
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

function Suggestions({
  query,
  items,
  onPick,
}: {
  query: string;
  items: SitemapAuditPage[];
  onPick: (url: string) => void;
}) {
  return (
    <div className="rounded-xl border border-border bg-card p-5">
      <p className="text-[13px] font-semibold text-foreground">No exact match for that URL</p>
      <p className="mt-1 text-xs text-muted-foreground">
        We don&apos;t have <span className="font-mono">{prettyUrl(query)}</span> in the crawl. Did
        you mean one of these?
      </p>
      <ul className="mt-3 flex flex-col divide-y divide-border/60">
        {items.map((p) => (
          <li key={p.id}>
            <button
              type="button"
              onClick={() => onPick(p.url)}
              className="flex w-full items-center gap-2 py-2 text-left text-xs text-foreground transition-colors hover:text-primary"
            >
              <Search className="size-3.5 shrink-0 text-muted-foreground" />
              <span className="truncate">{prettyUrl(p.url)}</span>
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

function NotFound({ query }: { query: string }) {
  return (
    <div className="rounded-xl border border-border bg-card px-5 py-8 text-center">
      <XCircle className="mx-auto size-7 text-muted-foreground" />
      <p className="mt-2 text-[13px] font-semibold text-foreground">URL not in the last crawl</p>
      <p className="mx-auto mt-1 max-w-md text-xs text-muted-foreground">
        We have no crawl data for <span className="font-mono">{prettyUrl(query)}</span>. URL
        inspection only covers pages crawled for the current site — check the domain matches this
        workspace, or re-crawl from the Index coverage tab.
      </p>
    </div>
  );
}

function LiveInspection({ result }: { result: GSCInspection }) {
  const Icon = result.on_google ? CheckCircle2 : XCircle;
  return (
    <div className="flex flex-col gap-3 rounded-xl border border-primary/30 bg-primary/5 p-4">
      <div className="flex items-center gap-2">
        <span className="inline-flex items-center gap-1 rounded-full bg-primary/15 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-primary">
          Live · Google Search Console
        </span>
      </div>
      <div className="flex items-center gap-3">
        <Icon
          className={cn("size-6 shrink-0", result.on_google ? "text-emerald-600" : "text-rose-500")}
        />
        <div className="min-w-0">
          <p className="text-[14px] font-semibold text-foreground">
            {result.on_google ? "URL is on Google" : "URL is not on Google"}
          </p>
          <p className="truncate text-[12px] text-muted-foreground">
            {result.coverage_state || result.verdict}
          </p>
        </div>
      </div>
      <ul className="flex flex-col divide-y divide-border/60">
        <Row label="Coverage" value={result.coverage_state || "—"} />
        <Row
          label="Indexing"
          value={result.indexing_state || "—"}
          ok={result.indexing_state === "INDEXING_ALLOWED" ? true : undefined}
        />
        <Row
          label="robots.txt"
          value={result.robots_txt_state || "—"}
          ok={result.robots_txt_state === "ALLOWED" ? true : undefined}
        />
        <Row
          label="Last crawled"
          value={result.last_crawl_time ? fmtDate(result.last_crawl_time) : "Not crawled"}
        />
        {result.google_canonical ? (
          <Row label="Google-selected canonical" value={prettyUrl(result.google_canonical)} />
        ) : null}
      </ul>
    </div>
  );
}

function InspectionResult({ page }: { page: SitemapAuditPage }) {
  const verdict = inspectionVerdict(page);
  const Icon = verdict.onGoogle ? CheckCircle2 : XCircle;

  return (
    <div className="flex flex-col gap-4">
      {/* Verdict banner */}
      <div
        className={cn(
          "flex items-center gap-3 rounded-xl border px-4 py-3.5",
          verdict.onGoogle
            ? "border-success/30 bg-success/5"
            : "border-destructive/30 bg-destructive/5",
        )}
      >
        <Icon
          className={cn("size-6 shrink-0", verdict.onGoogle ? "text-success" : "text-destructive")}
        />
        <div className="min-w-0">
          <p className="text-sm font-semibold text-foreground">{verdict.label}</p>
          <p className="truncate text-xs text-muted-foreground">{verdict.reason}</p>
        </div>
      </div>

      <p className="truncate text-xs text-muted-foreground">
        Inspecting <span className="font-mono text-foreground">{prettyUrl(page.url)}</span>
      </p>

      {/* Coverage details */}
      <Group title="Coverage">
        <Row label="Crawl status" value={`HTTP ${page.status_code || "—"}`} />
        <Row
          label="Indexing allowed"
          ok={!page.is_noindex}
          value={page.is_noindex ? "No — 'noindex'" : "Yes"}
        />
        <Row
          label="Canonical"
          value={page.has_canonical ? prettyUrl(page.final_url || page.url) : "Not declared"}
        />
        <Row label="Last crawled" value={fmtDate(page.checked_at)} />
        {page.redirect_count > 0 ? (
          <Row
            label="Redirects"
            value={`${page.redirect_count} hop(s) → ${prettyUrl(page.final_url)}`}
          />
        ) : null}
      </Group>

      {/* Enhancements */}
      <Group title="Page details">
        <Row label="Title" value={page.title || "Missing"} ok={!!page.title} />
        <Row
          label="Meta description"
          value={page.meta_description ? "Present" : "Missing"}
          ok={!!page.meta_description}
        />
        <Row
          label="H1"
          value={page.h1_count === 1 ? "1 (good)" : String(page.h1_count)}
          ok={page.h1_count === 1}
        />
        <Row label="Word count" value={String(page.word_count)} />
        <Row
          label="Structured data"
          value={page.jsonld_count > 0 ? `${page.jsonld_count} block(s)` : "None"}
          ok={page.jsonld_count > 0}
        />
      </Group>

      {/* AI crawlability */}
      <Group title="AI crawlers">
        <Row
          label="GPTBot"
          ok={page.robots_allows_gptbot}
          value={page.robots_allows_gptbot ? "Allowed" : "Blocked"}
        />
        <Row
          label="ClaudeBot"
          ok={page.robots_allows_claudebot}
          value={page.robots_allows_claudebot ? "Allowed" : "Blocked"}
        />
        <Row
          label="PerplexityBot"
          ok={page.robots_allows_perplexitybot}
          value={page.robots_allows_perplexitybot ? "Allowed" : "Blocked"}
        />
      </Group>

      {/* Performance */}
      {page.lcp_ms || page.fcp_ms || page.ttfb_ms ? (
        <Group title="Performance">
          <Row label="LCP" value={fmtMs(page.lcp_ms)} />
          <Row label="FCP" value={fmtMs(page.fcp_ms)} />
          <Row label="TTFB" value={fmtMs(page.ttfb_ms)} />
        </Group>
      ) : null}

      {/* Findings */}
      {page.findings.length ? (
        <Group title="Issues found">
          {page.findings.map((f, i) => (
            <li key={`${f.code}-${i}`} className="flex items-start gap-2 py-1.5">
              <AlertTriangle
                className={cn(
                  "mt-0.5 size-3.5 shrink-0",
                  f.severity === "fail" ? "text-destructive" : "text-warning",
                )}
              />
              <span className="text-xs text-foreground">{f.label}</span>
            </li>
          ))}
        </Group>
      ) : null}
    </div>
  );
}

function Group({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-xl border border-border bg-card p-4">
      <p className="mb-2 text-xs font-semibold text-foreground">{title}</p>
      <ul className="flex flex-col divide-y divide-border/60">{children}</ul>
    </div>
  );
}

function Row({ label, value, ok }: { label: string; value: string; ok?: boolean }) {
  return (
    <li className="flex items-center justify-between gap-3 py-1.5">
      <span className="text-xs text-muted-foreground">{label}</span>
      <span
        className={cn(
          "max-w-[60%] truncate text-right text-xs font-medium",
          ok === undefined ? "text-foreground" : ok ? "text-success" : "text-destructive",
        )}
      >
        {value}
      </span>
    </li>
  );
}
