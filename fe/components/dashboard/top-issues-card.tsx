"use client";

import { useMemo } from "react";
import Link from "next/link";
import type { Recommendation } from "@fe/lib/api/analyzer";

export function TopIssuesCard({
  slug,
  recommendations,
}: {
  slug: string;
  recommendations: Recommendation[];
}) {
  const topIssues = useMemo(
    () =>
      [...recommendations]
        .filter((r) => r.priority === "critical" || r.priority === "high")
        .slice(0, 3),
    [recommendations],
  );

  return (
    <div className="w-full rounded-xl border border-border bg-card p-3">
      <div className="mb-2 flex items-center justify-between border-b border-border pb-1.5">
        <p className="text-sm font-semibold text-foreground">Top Issues</p>
        <Link
          href={`/dashboard/${slug}/recommendations`}
          className="text-[10px] font-semibold text-primary hover:underline"
        >
          View all
        </Link>
      </div>
      <div className="rounded-lg border border-border bg-muted/10 p-2">
        {topIssues.length > 0 ? (
          <ul className="grid grid-cols-1 gap-1.5 sm:grid-cols-3">
            {topIssues.map((issue) => (
              <li
                key={issue.id}
                className="rounded-md border border-border/70 bg-white px-1.5 py-1"
              >
                <p className="line-clamp-2 text-[10px] font-medium leading-tight text-foreground">
                  {issue.title}
                </p>
                <p className="mt-0.5 text-[10px] uppercase tracking-wide text-muted-foreground">
                  {issue.priority}
                </p>
              </li>
            ))}
          </ul>
        ) : (
          <p className="py-2 text-center text-[10px] text-muted-foreground">No critical issues</p>
        )}
      </div>
    </div>
  );
}
