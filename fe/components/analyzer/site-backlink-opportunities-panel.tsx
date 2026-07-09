"use client";

import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { ExternalLink, Loader2, RefreshCw, Globe, AlertCircle, Sparkles } from "@fe/components/icons";
import {
  getSiteBacklinkOpportunities,
  regenerateSiteBacklinkOpportunities,
  type OpportunityCategory,
  type SiteOpportunity,
} from "@fe/lib/api/analyzer";
import { Button } from "@fe/components/ui/button";
import { cn } from "@fe/lib/utils";

const CATEGORY_LABEL: Record<OpportunityCategory, string> = {
  directory: "Directory",
  review: "Review",
  press: "Press",
  forum: "Community",
  resource: "Resource",
  other: "Other",
};

const CATEGORY_STYLES: Record<OpportunityCategory, string> = {
  directory: "bg-info/10 text-info dark:text-info border-info/20",
  review: "bg-warning/10 text-warning dark:text-warning border-warning/20",
  press:
    "bg-[var(--feature-violet)]/10 text-[var(--feature-violet)] dark:text-[var(--feature-violet)] border-[var(--feature-violet)]/20",
  forum: "bg-success/10 text-success dark:text-success border-success/20",
  resource: "bg-destructive/10 text-destructive dark:text-destructive border-destructive/20",
  other: "bg-muted/10 text-foreground dark:text-muted-foreground border-border/20",
};

const PRIORITY_LABEL: Record<number, string> = {
  1: "High",
  2: "Medium",
  3: "Low",
};

interface Props {
  slug: string;
}

export function SiteBacklinkOpportunitiesPanel({ slug }: Props) {
  const queryClient = useQueryClient();
  const [regenerating, setRegenerating] = useState(false);
  const [regenError, setRegenError] = useState<string | null>(null);

  const queryKey = ["site-backlink-opportunities", slug];
  // Cached across tab switches via QueryClient (5min staleTime, 30min gcTime).
  const {
    data,
    isLoading: loading,
    error: queryError,
  } = useQuery({
    queryKey,
    enabled: !!slug,
    queryFn: () => getSiteBacklinkOpportunities(slug),
  });
  const rows: SiteOpportunity[] = data?.rows ?? [];
  const hasGenerated = !!data?.has_generated;
  const queryErrMsg = queryError
    ? ((queryError as { response?: { data?: { detail?: string } }; message?: string }).response
        ?.data?.detail ??
      (queryError as { message?: string }).message ??
      "Failed to load opportunities")
    : null;
  const error = regenError || queryErrMsg;

  const handleRegenerate = async () => {
    setRegenerating(true);
    setRegenError(null);
    try {
      const res = await regenerateSiteBacklinkOpportunities(slug);
      queryClient.setQueryData(queryKey, { rows: res.rows, has_generated: true });
    } catch (err: unknown) {
      const e = err as {
        response?: { data?: { detail?: string } };
        message?: string;
        code?: string;
      };
      const msg =
        e.code === "ECONNABORTED"
          ? "Generation took too long. Try again, or refresh in a moment."
          : (e.response?.data?.detail ?? e.message ?? "Failed to generate");
      setRegenError(msg);
    } finally {
      setRegenerating(false);
    }
  };

  if (loading) {
    return (
      <div className="rounded-sm border border-border bg-card px-4 py-8">
        <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
          <Loader2 className="size-4 animate-spin" />
          Loading…
        </div>
      </div>
    );
  }

  const isEmpty = rows.length === 0;

  return (
    <div
      className="rounded-sm border border-border bg-card px-4 py-5"
      data-tour-card="backlinks-free-panel"
    >
      <div className="mb-3 flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <Globe className="size-4 text-muted-foreground" />
          <h4 className="text-sm font-medium text-foreground">Where to earn backlinks</h4>
          {rows.length > 0 ? (
            <span className="rounded-full bg-muted px-2 py-0.5 text-[10px] font-medium text-muted-foreground">
              {rows.length}
            </span>
          ) : null}
        </div>
        {(!isEmpty || hasGenerated) && (
          <Button
            variant="ghost"
            size="sm"
            onClick={handleRegenerate}
            disabled={regenerating}
            className="h-7 gap-1.5 text-xs"
          >
            <RefreshCw className={cn("size-3.5", regenerating && "animate-spin")} />
            {regenerating ? "Regenerating…" : "Refresh"}
          </Button>
        )}
      </div>

      {error ? (
        <div className="mb-3 flex items-start gap-2 rounded-md border border-destructive/30 bg-destructive/5 px-3 py-2 text-xs text-destructive">
          <AlertCircle className="mt-0.5 size-3.5 shrink-0" />
          <span>{error}</span>
        </div>
      ) : null}

      {isEmpty ? (
        <div className="rounded-md border border-dashed border-border bg-muted/10 px-4 py-10 text-center">
          <p className="text-sm font-medium text-foreground">No suggestions yet</p>
          <p className="mt-1 text-xs text-muted-foreground">
            Generate a list of sites where you can earn a backlink for this brand. Takes 10–30
            seconds.
          </p>
          <Button
            variant="default"
            size="sm"
            onClick={handleRegenerate}
            disabled={regenerating}
            className="mt-4 h-8 gap-1.5 text-xs"
          >
            {regenerating ? (
              <>
                <Loader2 className="size-3.5 animate-spin" />
                Generating…
              </>
            ) : (
              <>
                <Sparkles className="size-3.5" />
                Generate suggestions
              </>
            )}
          </Button>
        </div>
      ) : (
        <ul className="space-y-2">
          {rows.map((opp, oppIdx) => (
            <OpportunityRow
              key={opp.id}
              opp={opp}
              dataTour={oppIdx === 0 ? "backlinks-free-row" : undefined}
            />
          ))}
        </ul>
      )}

      <p className="mt-3 text-[10px] leading-snug text-muted-foreground">
        Suggestions are AI-generated. Verify each link before submitting, sites change their
        listing/contribution policies over time.
      </p>
    </div>
  );
}

function OpportunityRow({ opp, dataTour }: { opp: SiteOpportunity; dataTour?: string }) {
  return (
    <li
      className="rounded-md border border-border bg-background px-3 py-2.5"
      data-tour-card={dataTour}
    >
      <div className="flex flex-wrap items-center gap-2">
        <a
          href={opp.submit_url}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1 text-sm font-medium text-foreground hover:underline"
        >
          {opp.name}
          <ExternalLink className="size-3 text-muted-foreground" />
        </a>
        <span
          className={cn(
            "rounded-full border px-1.5 py-0.5 text-[10px] font-medium uppercase tracking-wide",
            CATEGORY_STYLES[opp.category],
          )}
        >
          {CATEGORY_LABEL[opp.category]}
        </span>
        <span className="rounded-full bg-muted px-1.5 py-0.5 text-[10px] font-medium text-muted-foreground">
          {PRIORITY_LABEL[opp.priority] ?? "Medium"}
        </span>
      </div>
      {opp.description ? (
        <p className="mt-1 text-xs text-muted-foreground">{opp.description}</p>
      ) : null}
      {opp.rationale ? (
        <p className="mt-0.5 text-[11px] italic text-muted-foreground/80">{opp.rationale}</p>
      ) : null}
    </li>
  );
}
