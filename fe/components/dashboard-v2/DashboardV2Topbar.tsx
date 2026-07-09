"use client";

import { Download, Loader2, RefreshCw, Sparkles } from "lucide-react";
import { ThemeToggle } from "@fe/components/dashboard-v2/ThemeToggle";

export function DashboardV2Topbar({
  userName,
  brandName,
  lastUpdated,
  onExport,
  onReanalyze,
  reanalyzing,
}: {
  userName: string;
  brandName?: string;
  lastUpdated?: string;
  onExport?: () => void;
  onReanalyze?: () => void;
  reanalyzing?: boolean;
}) {
  const firstName = userName.split(" ")[0] || userName;
  return (
    <header className="flex flex-col gap-5">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="flex items-center gap-2 text-[26px] font-bold tracking-tight">
            Welcome back, {firstName} <span className="text-2xl">👋</span>
          </h1>
          <p className="mt-1 text-sm text-sv-muted">
            {brandName ? `${brandName}'s ` : "Your "}AI visibility progress at a glance.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <ThemeToggle />
          {onReanalyze && (
            <button
              onClick={onReanalyze}
              disabled={reanalyzing}
              className="sv-focus-ring inline-flex items-center gap-2 rounded-xl border border-sv-hair-strong bg-sv-card-2 px-3.5 py-2 text-sm font-medium transition-colors hover:border-sv-hair-strong hover:bg-sv-elevated disabled:opacity-60"
            >
              {reanalyzing ? (
                <Loader2 className="size-4 animate-spin" />
              ) : (
                <RefreshCw className="size-4" />
              )}
              {reanalyzing ? "Reanalyzing…" : "Reanalyze"}
            </button>
          )}
          <button
            onClick={onExport}
            className="sv-focus-ring inline-flex items-center gap-2 rounded-xl border border-sv-hair-strong bg-sv-card-2 px-3.5 py-2 text-sm font-medium transition-colors hover:border-sv-hair-strong hover:bg-sv-elevated"
          >
            <Download className="size-4" />
            Export Report
          </button>
        </div>
      </div>

      <div className="flex items-center gap-2.5">
        <span className="ml-auto flex items-center gap-1.5 text-xs text-sv-faint">
          <Sparkles className="size-3.5 text-sv-brand" />
          {lastUpdated ? `Last updated ${lastUpdated}` : "Live AI aggregation"}
        </span>
      </div>
    </header>
  );
}
