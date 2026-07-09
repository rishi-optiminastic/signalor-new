"use client";

import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  AlertTriangle,
  CheckCircle2,
  ChevronDown,
  ChevronRight,
  ExternalLink,
  XCircle,
} from "@fe/components/icons";

import {
  getSitemapAudit,
  type SitemapAuditPage,
  type SitemapPageSeverity,
} from "@fe/lib/api/analyzer";
import { Skeleton } from "@fe/components/ui/skeleton";
import { cn } from "@fe/lib/utils";
import { fmtNum, prettyUrl } from "./gsc-utils";

type View = "page" | "issue";

type Issue = {
  code: string;
  label: string;
  severity: SitemapPageSeverity;
  pages: number;
  sampleUrl: string;
};

const SEV_ORDER: Record<SitemapPageSeverity, number> = { fail: 0, warn: 1, ok: 2 };

export function GscIssuesSection({
  slug,
  onInspect,
}: {
  slug: string;
  onInspect: (url: string) => void;
}) {
  const [view, setView] = useState<View>("page");

  // One fetch of up to the crawl cap (200) returns every audited page, so we
  // can aggregate findings client-side — same source as the coverage tab.
  const { data, isLoading, error } = useQuery({
    queryKey: ["gsc-issues", slug],
    enabled: !!slug,
    queryFn: () => getSitemapAudit(slug, { page: 1, page_size: 200 }),
  });

  const pages = useMemo(() => data?.pages ?? [], [data]);

  const stats = useMemo(() => {
    let errs = 0;
    let warns = 0;
    let affected = 0;
    for (const p of pages) {
      const real = p.findings.filter((f) => f.severity !== "ok");
      if (real.length) affected += 1;
      for (const f of real) {
        if (f.severity === "fail") errs += 1;
        else warns += 1;
      }
    }
    return { errs, warns, affected, total: pages.length };
  }, [pages]);

  // Pages with at least one real issue, worst-severity first.
  const pagesWithIssues = useMemo(
    () =>
      pages
        .map((p) => ({ page: p, findings: p.findings.filter((f) => f.severity !== "ok") }))
        .filter((x) => x.findings.length > 0)
        .sort(
          (a, b) =>
            SEV_ORDER[a.page.severity] - SEV_ORDER[b.page.severity] ||
            b.findings.length - a.findings.length,
        ),
    [pages],
  );

  const issues = useMemo(() => {
    const map = new Map<string, Issue>();
    for (const p of pages) {
      for (const f of p.findings) {
        if (f.severity === "ok") continue;
        const existing = map.get(f.code);
        if (existing) existing.pages += 1;
        else
          map.set(f.code, {
            code: f.code,
            label: f.label,
            severity: f.severity,
            pages: 1,
            sampleUrl: p.url,
          });
      }
    }
    return Array.from(map.values()).sort(
      (a, b) => SEV_ORDER[a.severity] - SEV_ORDER[b.severity] || b.pages - a.pages,
    );
  }, [pages]);

  if (isLoading && !data) return <Skeleton className="h-72 w-full" />;

  if (error || !data?.audit) {
    return (
      <div className="rounded-xl border border-dashed border-border bg-card/50 px-6 py-12 text-center text-[13px] text-muted-foreground">
        {error ? "Couldn't load issues. Retry in a moment." : "Run a crawl to surface page issues."}
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h3 className="text-sm font-semibold text-foreground">Page issues</h3>
          <p className="text-xs text-muted-foreground">
            SEO and AI-readiness issues found across {fmtNum(stats.total)} crawled pages.
          </p>
        </div>
        {/* View toggle */}
        <div className="inline-flex items-center gap-0.5 rounded-lg border border-border bg-muted/30 p-0.5">
          <ToggleBtn active={view === "page"} onClick={() => setView("page")}>
            By page
          </ToggleBtn>
          <ToggleBtn active={view === "issue"} onClick={() => setView("issue")}>
            By issue
          </ToggleBtn>
        </div>
      </div>

      {/* Summary tiles */}
      <div className="grid grid-cols-3 gap-3">
        <SummaryTile
          tone="error"
          icon={<XCircle className="size-4" />}
          value={fmtNum(stats.errs)}
          label="Errors"
        />
        <SummaryTile
          tone="warn"
          icon={<AlertTriangle className="size-4" />}
          value={fmtNum(stats.warns)}
          label="Warnings"
        />
        <SummaryTile
          tone="ok"
          icon={<CheckCircle2 className="size-4" />}
          value={`${fmtNum(stats.affected)} / ${fmtNum(stats.total)}`}
          label="Pages with issues"
        />
      </div>

      {view === "page" ? (
        <ByPage rows={pagesWithIssues} onInspect={onInspect} />
      ) : (
        <ByIssue issues={issues} onInspect={onInspect} />
      )}
    </div>
  );
}

// ─── By-page (detailed, expandable per page) ────────────────────────────────

function ByPage({
  rows,
  onInspect,
}: {
  rows: { page: SitemapAuditPage; findings: SitemapAuditPage["findings"] }[];
  onInspect: (url: string) => void;
}) {
  // Expand the first few pages by default so the detail is visible immediately.
  const [open, setOpen] = useState<Set<number>>(
    () => new Set(rows.slice(0, 3).map((r) => r.page.id)),
  );

  if (!rows.length) {
    return (
      <div className="rounded-xl border border-dashed border-border bg-card/50 px-5 py-10 text-center text-[13px] text-muted-foreground">
        No issues found — every crawled page passed.
      </div>
    );
  }

  function toggle(id: number) {
    setOpen((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  return (
    <div className="flex flex-col gap-2">
      {rows.map(({ page, findings }) => {
        const isOpen = open.has(page.id);
        const errs = findings.filter((f) => f.severity === "fail").length;
        const warns = findings.filter((f) => f.severity === "warn").length;
        return (
          <div key={page.id} className="overflow-hidden rounded-xl border border-border bg-card">
            <button
              type="button"
              onClick={() => toggle(page.id)}
              className="flex w-full items-center gap-3 px-4 py-3 text-left transition-colors hover:bg-muted/40"
            >
              {isOpen ? (
                <ChevronDown className="size-4 shrink-0 text-muted-foreground" />
              ) : (
                <ChevronRight className="size-4 shrink-0 text-muted-foreground" />
              )}
              <div className="min-w-0 flex-1">
                <p className="truncate text-[13px] font-medium text-foreground">
                  {page.title || prettyUrl(page.url)}
                </p>
                <p className="truncate text-[11px] text-muted-foreground">{prettyUrl(page.url)}</p>
              </div>
              <div className="flex shrink-0 items-center gap-1.5">
                {errs > 0 ? (
                  <span className="inline-flex items-center gap-1 rounded-full bg-destructive/10 px-2 py-0.5 text-[10px] font-semibold text-destructive">
                    <XCircle className="size-3" />
                    {errs}
                  </span>
                ) : null}
                {warns > 0 ? (
                  <span className="inline-flex items-center gap-1 rounded-full bg-warning/10 px-2 py-0.5 text-[10px] font-semibold text-warning">
                    <AlertTriangle className="size-3" />
                    {warns}
                  </span>
                ) : null}
              </div>
            </button>

            {isOpen ? (
              <div className="border-t border-border/60 bg-muted/15 px-4 py-3">
                <ul className="flex flex-col gap-1.5">
                  {[...findings]
                    .sort((a, b) => SEV_ORDER[a.severity] - SEV_ORDER[b.severity])
                    .map((f, i) => (
                      <li key={`${f.code}-${i}`} className="flex items-start gap-2">
                        {f.severity === "fail" ? (
                          <XCircle className="mt-0.5 size-3.5 shrink-0 text-destructive" />
                        ) : (
                          <AlertTriangle className="mt-0.5 size-3.5 shrink-0 text-warning" />
                        )}
                        <span className="text-xs text-foreground">{f.label}</span>
                      </li>
                    ))}
                </ul>
                <button
                  type="button"
                  onClick={() => onInspect(page.url)}
                  className="mt-3 inline-flex items-center gap-1 text-[11px] font-semibold text-primary hover:underline"
                >
                  Inspect page
                  <ExternalLink className="size-3" />
                </button>
              </div>
            ) : null}
          </div>
        );
      })}
    </div>
  );
}

// ─── By-issue (rollup) ──────────────────────────────────────────────────────

function ByIssue({ issues, onInspect }: { issues: Issue[]; onInspect: (url: string) => void }) {
  if (!issues.length) {
    return (
      <div className="rounded-xl border border-dashed border-border bg-card/50 px-5 py-10 text-center text-[13px] text-muted-foreground">
        No issues found — every crawled page passed.
      </div>
    );
  }
  return (
    <div className="overflow-x-auto rounded-xl border border-border">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-border bg-muted/30 text-left">
            <th className="px-3 py-2.5 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
              Issue
            </th>
            <th className="w-28 px-3 py-2.5 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
              Severity
            </th>
            <th className="w-32 px-3 py-2.5 text-right text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
              Pages affected
            </th>
            <th className="w-10 px-3 py-2.5" />
          </tr>
        </thead>
        <tbody>
          {issues.map((iss) => (
            <tr
              key={iss.code}
              className="cursor-pointer border-b border-border/60 transition-colors last:border-0 hover:bg-muted/40"
              onClick={() => onInspect(iss.sampleUrl)}
              title={`Inspect ${prettyUrl(iss.sampleUrl)}`}
            >
              <td className="px-3 py-2.5 text-[13px] font-medium text-foreground">{iss.label}</td>
              <td className="px-3 py-2.5">
                <SeverityPill severity={iss.severity} />
              </td>
              <td className="px-3 py-2.5 text-right font-mono text-xs text-foreground">
                {fmtNum(iss.pages)}
              </td>
              <td className="px-3 py-2.5 text-right">
                <ChevronRight className="ml-auto size-4 text-muted-foreground" />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// ─── Bits ───────────────────────────────────────────────────────────────────

function ToggleBtn({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "rounded-md px-3 py-1.5 text-xs font-semibold transition-colors",
        active
          ? "bg-card text-foreground shadow-sm"
          : "text-muted-foreground hover:text-foreground",
      )}
    >
      {children}
    </button>
  );
}

function SummaryTile({
  tone,
  icon,
  value,
  label,
}: {
  tone: "error" | "warn" | "ok";
  icon: React.ReactNode;
  value: string;
  label: string;
}) {
  const toneCls =
    tone === "error" ? "text-destructive" : tone === "warn" ? "text-warning" : "text-success";
  return (
    <div className="rounded-xl border border-border bg-card p-3">
      <div className={cn("flex items-center gap-1.5", toneCls)}>
        {icon}
        <span className="text-xl font-bold">{value}</span>
      </div>
      <p className="mt-1 text-[11px] uppercase tracking-wide text-muted-foreground">{label}</p>
    </div>
  );
}

function SeverityPill({ severity }: { severity: SitemapPageSeverity }) {
  const map: Record<SitemapPageSeverity, { label: string; cls: string }> = {
    fail: { label: "Error", cls: "bg-destructive/10 text-destructive" },
    warn: { label: "Warning", cls: "bg-warning/10 text-warning" },
    ok: { label: "Notice", cls: "bg-muted text-muted-foreground" },
  };
  const s = map[severity];
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-semibold",
        s.cls,
      )}
    >
      {s.label}
    </span>
  );
}
