"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { getRunList } from "@fe/lib/api/analyzer";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@fe/components/ui/table";
import { Skeleton } from "@fe/components/ui/skeleton";
import { routes } from "@fe/lib/config";
import { cn } from "@fe/lib/utils";

const INITIAL_VISIBLE = 20;
const COMPLETE_STATUSES = ["complete", "completed", "done"];

/** UTC + en-US to avoid SSR/client hydration mismatch (see CLAUDE.md). */
function formatRunDate(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    timeZone: "UTC",
  });
}

function hostname(url: string): string {
  try {
    return new URL(url).hostname.replace(/^www\./, "");
  } catch {
    return url;
  }
}

function ScoreChip({ value }: { value: number | null }) {
  if (value == null) {
    return (
      <span className="inline-flex min-w-9 justify-center rounded-full bg-muted px-2 py-0.5 text-xs font-semibold text-muted-foreground">
        —
      </span>
    );
  }
  const tint =
    value >= 70
      ? "bg-success/10 text-success"
      : value >= 40
        ? "bg-warning/10 text-warning"
        : "bg-destructive/10 text-destructive";
  return (
    <span
      className={cn(
        "inline-flex min-w-9 justify-center rounded-full px-2 py-0.5 text-xs font-semibold",
        tint,
      )}
    >
      {Math.round(value)}
    </span>
  );
}

function StatusBadge({ status }: { status: string }) {
  const s = status.toLowerCase();
  const tint = COMPLETE_STATUSES.includes(s)
    ? "border-success/30 bg-success/10 text-success"
    : s === "failed" || s === "error"
      ? "border-destructive/30 bg-destructive/10 text-destructive"
      : "border-warning/30 bg-warning/10 text-warning";
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border px-2 py-0.5 text-[11px] font-medium capitalize",
        tint,
      )}
    >
      {status}
    </span>
  );
}

const isComplete = (status: string) => COMPLETE_STATUSES.includes(status.toLowerCase());

export function AnalysisHistoryCard({ email }: { email: string }) {
  const [showAll, setShowAll] = useState(false);
  const {
    data: runs = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: ["analysis-run-history", email],
    queryFn: () => getRunList(email),
    enabled: !!email,
  });

  const sorted = useMemo(
    () =>
      [...runs].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()),
    [runs],
  );

  const visible = showAll ? sorted : sorted.slice(0, INITIAL_VISIBLE);

  return (
    <div className="mt-6 overflow-hidden rounded-xl border border-border/60 bg-card shadow-sm">
      <div className="flex items-center justify-between border-b border-border/60 px-6 py-4">
        <div>
          <p className="text-[13px] font-semibold tracking-tight text-foreground">
            Analysis history
          </p>
          <p className="mt-0.5 text-xs font-light text-muted-foreground">
            Every GEO analysis run across your projects.
          </p>
        </div>
        {!isLoading && !error && sorted.length > 0 && (
          <span className="text-xs font-light text-muted-foreground">
            {sorted.length} {sorted.length === 1 ? "run" : "runs"}
          </span>
        )}
      </div>

      <div className="px-2 py-4">
        {isLoading ? (
          <div className="space-y-2">
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="h-10 w-full rounded-md" />
            ))}
          </div>
        ) : error ? (
          <p className="py-6 text-center text-xs font-light text-destructive">
            Couldn&apos;t load analysis history.
          </p>
        ) : sorted.length === 0 ? (
          <p className="py-6 text-center text-xs font-light text-muted-foreground">
            No analysis runs yet.
          </p>
        ) : (
          <>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Domain</TableHead>
                  <TableHead className="text-center">GEO score</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Report</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {visible.map((run) => (
                  <TableRow key={run.id}>
                    <TableCell className="whitespace-nowrap text-xs tabular-nums text-muted-foreground">
                      {formatRunDate(run.created_at)}
                    </TableCell>
                    <TableCell
                      className="max-w-[200px] truncate text-[13px] text-foreground"
                      title={run.url}
                    >
                      {hostname(run.url)}
                    </TableCell>
                    <TableCell className="text-center">
                      <ScoreChip value={run.composite_score} />
                    </TableCell>
                    <TableCell>
                      <StatusBadge status={run.status} />
                    </TableCell>
                    <TableCell className="text-right">
                      {isComplete(run.status) ? (
                        <Link
                          href={routes.dashboardProject(run.slug)}
                          className="text-xs font-semibold text-primary hover:underline"
                        >
                          View report
                        </Link>
                      ) : (
                        <span className="text-xs text-muted-foreground">—</span>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>

            {sorted.length > INITIAL_VISIBLE && (
              <div className="mt-3 text-center">
                <button
                  type="button"
                  onClick={() => setShowAll((v) => !v)}
                  className="text-xs font-semibold text-muted-foreground transition hover:text-foreground"
                >
                  {showAll ? "Show less" : `Show all ${sorted.length}`}
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
