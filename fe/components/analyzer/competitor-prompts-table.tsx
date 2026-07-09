"use client";

import { useEffect, useRef, useState } from "react";
import { Loader2 } from "@fe/components/icons";
import {
  getCompetitorPrompts,
  type CompetitorPrompt,
  type CompetitorMention,
} from "@fe/lib/api/analyzer";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@fe/components/ui/tooltip";

// ── Polling config ────────────────────────────────────────────────────────────

const POLL_INTERVAL_MS = 8000;
const MAX_POLL_ATTEMPTS = 12; // ~1.5 min ceiling
const RECENT_COMPLETION_WINDOW_MS = 5 * 60_000;

/** Whether it's worth polling for competitor prompts (generated shortly after a
 * run completes). Avoids the request storm on old/failed runs that will never
 * generate any (see issue #21). Evaluated only inside effects — never render. */
function shouldPoll(runStatus?: string, runUpdatedAt?: string): boolean {
  if (!runStatus || runStatus === "failed") return false; // unknown/failed → never poll
  if (runStatus !== "complete") return true; // actively processing → prompts may still arrive
  if (!runUpdatedAt) return false;
  const ago = Date.now() - new Date(runUpdatedAt).getTime();
  return ago >= 0 && ago < RECENT_COMPLETION_WINDOW_MS; // only briefly after completion
}

// Shared white tooltip style: light bg, dark text, lifted above other layers (z-100).
const TIP_CLS =
  "z-[100] max-w-[240px] border border-border bg-white text-xs font-medium normal-case leading-snug text-foreground shadow-md [--tooltip-arrow-border:var(--border)] [--tooltip-arrow:#ffffff]";

// ── Helpers ──────────────────────────────────────────────────────────────────

function hostOf(url: string): string {
  if (!url) return "";
  try {
    const u = new URL(url.includes("://") ? url : `https://${url}`);
    return u.hostname.replace(/^www\./, "");
  } catch {
    return url.replace(/^www\./, "").split("/")[0];
  }
}

function formatDate(iso: string): string {
  try {
    const d = new Date(iso);
    return d.toLocaleDateString("en-US", { day: "numeric", month: "short" });
  } catch {
    return "";
  }
}

// ── Sub-components ────────────────────────────────────────────────────────────

function BrandLogo({ url, name, size = 22 }: { url: string; name: string; size?: number }) {
  const host = hostOf(url);
  const [failed, setFailed] = useState(false);
  const src = host ? `https://www.google.com/s2/favicons?domain=${host}&sz=${size * 2}` : "";

  if (!host || failed) {
    return (
      <div
        title={name}
        className="flex shrink-0 items-center justify-center rounded-full border border-border/60 bg-muted/50 text-[10px] font-bold text-muted-foreground uppercase"
        style={{ width: size, height: size }}
      >
        {name.charAt(0)}
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={name}
      title={name}
      width={size}
      height={size}
      onError={() => setFailed(true)}
      className="shrink-0 rounded-full border border-border/40 object-contain"
      style={{ width: size, height: size }}
    />
  );
}

function ColHeader({ label, tip }: { label: string; tip: string }) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <span className="cursor-default">{label}</span>
      </TooltipTrigger>
      <TooltipContent side="top" className={TIP_CLS}>
        {tip}
      </TooltipContent>
    </Tooltip>
  );
}

function VisibilityPill({ pct }: { pct: number }) {
  const tint =
    pct >= 60
      ? "bg-success/10 text-success"
      : pct >= 30
        ? "bg-warning/10 text-warning"
        : pct > 0
          ? "bg-destructive/10 text-destructive"
          : "bg-muted text-muted-foreground";
  return (
    <span
      className={`inline-flex min-w-[44px] items-center justify-center rounded-full px-2.5 py-1 text-xs font-semibold tabular-nums ${tint}`}
      title={`${pct}% visibility`}
    >
      {pct}%
    </span>
  );
}

function ScoreBars({ value, color = "#f59e0b" }: { value: number; color?: string }) {
  const dots = 5;
  const filled = Math.max(0, Math.min(dots, Math.round(value * dots)));
  return (
    <div className="flex items-center gap-1" title={`${Math.round(value * 100)}%`}>
      {Array.from({ length: dots }).map((_, i) => (
        <span
          key={i}
          className="h-1.5 w-1.5 rounded-full"
          style={{ backgroundColor: i < filled ? color : "#e5e7eb" }}
        />
      ))}
    </div>
  );
}

// ── Main Component ────────────────────────────────────────────────────────────

interface CompetitorPromptsTableProps {
  slug: string;
  competitors: Array<{ id: number; name: string; url: string }>;
  yourUrl?: string;
  yourName?: string;
  /** Run status — gates polling so we don't hammer the backend on runs that
   * will never generate competitor prompts (issue #21). */
  runStatus?: string;
  runUpdatedAt?: string;
}

export function CompetitorPromptsTable({
  slug,
  competitors,
  yourUrl,
  yourName,
  runStatus,
  runUpdatedAt,
}: CompetitorPromptsTableProps) {
  const [prompts, setPrompts] = useState<CompetitorPrompt[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Latest prompts, read inside the poll loop without re-subscribing the effect.
  const promptsRef = useRef<CompetitorPrompt[]>(prompts);
  useEffect(() => {
    promptsRef.current = prompts;
  }, [prompts]);

  useEffect(() => {
    setLoading(true);
    getCompetitorPrompts(slug)
      .then((data) => setPrompts(data))
      .catch(() => setError("Failed to load competitive prompts."))
      .finally(() => setLoading(false));
  }, [slug]);

  // Poll for competitor prompts while generation is plausibly in progress. Unlike
  // a setInterval gated on state, this self-scheduling loop evaluates its stop
  // conditions (attempt cap, no-longer-pending, cancel) from the fetch result, so
  // it always terminates — even on a persistent 404 — and never storms (issue #21).
  useEffect(() => {
    if (!shouldPoll(runStatus, runUpdatedAt)) return;
    const current = promptsRef.current;
    const initiallyPending = current.length === 0 || current.some((p) => p.results.length === 0);
    if (!initiallyPending) return;

    let cancelled = false;
    let attempts = 0;
    let timer: ReturnType<typeof setTimeout> | null = null;

    const tick = async () => {
      if (cancelled || attempts >= MAX_POLL_ATTEMPTS) return;
      attempts += 1;
      let stillPending = true;
      try {
        const data = await getCompetitorPrompts(slug);
        if (cancelled) return;
        setPrompts(data);
        stillPending = data.length === 0 || data.some((p) => p.results.length === 0);
      } catch {
        // keep previous data; the attempt still counts toward the cap
        stillPending = true;
      }
      if (!cancelled && stillPending && attempts < MAX_POLL_ATTEMPTS) {
        timer = setTimeout(tick, POLL_INTERVAL_MS);
      }
    };

    timer = setTimeout(tick, POLL_INTERVAL_MS);
    return () => {
      cancelled = true;
      if (timer) clearTimeout(timer);
    };
  }, [slug, runStatus, runUpdatedAt]);

  const isEmpty = !loading && prompts.length === 0;

  return (
    <TooltipProvider delayDuration={150}>
      <div className="space-y-4">
        {/* Header */}
        <div>
          <h3 className="text-base font-semibold text-foreground">Competitive Prompt Insights</h3>
          <p className="mt-0.5 text-[13px] text-muted-foreground">
            AI-generated prompts where competitor brands are likely mentioned in responses.
          </p>
        </div>

        {/* Table */}
        {loading ? (
          <div className="space-y-2">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="h-12 animate-pulse rounded-md bg-muted/40" />
            ))}
          </div>
        ) : isEmpty ? (
          <div className="rounded-lg border border-dashed border-border bg-muted/10 py-10 text-center">
            <p className="text-sm font-medium text-foreground">No competitive prompts yet</p>
            <p className="mt-1 text-[13px] text-muted-foreground">
              Competitive prompts are generated automatically after brand analysis completes.
            </p>
          </div>
        ) : (
          <div className="relative overflow-hidden rounded-xl border border-border/60 bg-card shadow-sm">
            <table className="w-full table-fixed text-left text-sm">
              <thead className="border-b border-border/60 bg-muted/30">
                <tr>
                  {(
                    [
                      [
                        "Average Visibility",
                        "How often your brand appears across AI responses",
                        "w-[130px]",
                      ],
                      ["Prompt", "The search query fired to AI engines", ""],
                      ["Volume", "Estimated search frequency for this query", "w-[90px]"],
                      ["Difficulty", "How competitive this prompt is to rank for", "w-[90px]"],
                      ["Brand Mentions", "Brands detected in AI response text", "w-[160px]"],
                      ["Created", "Date this prompt was generated", "w-[80px]"],
                    ] as [string, string, string][]
                  ).map(([label, tip, cls]) => (
                    <th
                      key={label}
                      className={`px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wide text-muted-foreground ${cls}`}
                    >
                      <ColHeader label={label} tip={tip} />
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {prompts.map((p) => {
                  const hasResults = p.results.length > 0;
                  const visPct = hasResults ? Math.round(p.visibility_pct ?? 0) : 0;
                  const competitorMentions = p.mentioned_competitors_detail ?? [];

                  // Show user's own brand logo when AI mentioned it in any result
                  const ownBrandMentioned =
                    hasResults && yourUrl && yourName && (p.mentions ?? 0) > 0;

                  // Build the full brand mentions list: own brand first, then competitors
                  const allMentions: Array<{ key: string; url: string; name: string }> = [];
                  if (ownBrandMentioned) {
                    allMentions.push({ key: "own", url: yourUrl!, name: yourName! });
                  }
                  competitorMentions.forEach((m: CompetitorMention) => {
                    allMentions.push({ key: String(m.id), url: m.url, name: m.name });
                  });

                  return (
                    <tr
                      key={p.id}
                      className="border-b border-border/40 transition-colors last:border-0 hover:bg-muted/30"
                    >
                      {/* Avg. Vis. */}
                      <td className="px-4 py-3">
                        {!hasResults ? (
                          <Loader2 className="size-5 animate-spin text-muted-foreground/50" />
                        ) : (
                          <VisibilityPill pct={visPct} />
                        )}
                      </td>

                      {/* Prompt — single line, full text in a tooltip on hover */}
                      <td className="max-w-[320px] py-3 pl-4 pr-16">
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <p className="cursor-default truncate text-[13px] font-medium text-foreground">
                              {p.prompt_text}
                            </p>
                          </TooltipTrigger>
                          <TooltipContent
                            side="top"
                            align="start"
                            className="z-[100] max-w-sm border border-border bg-white px-3 py-2 text-[13px] font-medium leading-snug text-foreground shadow-md [--tooltip-arrow-border:var(--border)] [--tooltip-arrow:#ffffff]"
                          >
                            {p.prompt_text}
                          </TooltipContent>
                        </Tooltip>
                      </td>

                      {/* Volume */}
                      <td className="px-4 py-3">
                        {hasResults ? (
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <span className="inline-flex cursor-default">
                                <ScoreBars value={p.factor_authority ?? 0} color="#f59e0b" />
                              </span>
                            </TooltipTrigger>
                            <TooltipContent side="top" className={TIP_CLS}>
                              Volume — how often people ask this query. More dots mean higher search
                              demand for this prompt.
                            </TooltipContent>
                          </Tooltip>
                        ) : (
                          <span className="text-[11px] text-muted-foreground/50">—</span>
                        )}
                      </td>

                      {/* Difficulty */}
                      <td className="px-4 py-3">
                        {hasResults ? (
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <span className="inline-flex cursor-default">
                                <ScoreBars value={p.factor_structural ?? 0} color="#22c55e" />
                              </span>
                            </TooltipTrigger>
                            <TooltipContent side="top" className={TIP_CLS}>
                              Difficulty — how hard it is to get cited for this prompt. More dots
                              mean tougher competition.
                            </TooltipContent>
                          </Tooltip>
                        ) : (
                          <span className="text-[11px] text-muted-foreground/50">—</span>
                        )}
                      </td>

                      {/* Brand Mentions */}
                      <td className="px-4 py-3">
                        {!hasResults ? (
                          <Loader2 className="size-4 animate-spin text-muted-foreground/40" />
                        ) : allMentions.length > 0 ? (
                          <div className="flex items-center gap-1">
                            {allMentions.slice(0, 6).map((m) => (
                              <BrandLogo key={m.key} url={m.url} name={m.name} size={22} />
                            ))}
                            {allMentions.length > 6 && (
                              <span className="text-[10px] text-muted-foreground">
                                +{allMentions.length - 6}
                              </span>
                            )}
                          </div>
                        ) : (
                          <span className="text-[11px] font-medium text-muted-foreground/70">
                            Not mentioned
                          </span>
                        )}
                      </td>

                      {/* Created */}
                      <td className="px-4 py-3 text-xs tabular-nums text-muted-foreground">
                        {formatDate(p.created_at)}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {error && (
          <p className="rounded-md border border-destructive/30 bg-destructive/10 px-3 py-2 text-xs text-destructive">
            {error}
          </p>
        )}
      </div>
    </TooltipProvider>
  );
}
