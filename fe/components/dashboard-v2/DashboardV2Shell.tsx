"use client";

import type { ReactNode } from "react";
import { DashboardV2Sidebar } from "@fe/components/dashboard-v2/DashboardV2Sidebar";

/**
 * Full-page dashboard chrome for the v2 UI: a fixed sidebar on a dark/creamy
 * canvas with a framed, rounded content panel. Wraps every /dashboard/[slug]
 * page. Presentational — the caller supplies session-derived identity.
 */
export function DashboardV2Shell({
  basePath,
  userName,
  userInitial,
  onOpenSearch,
  children,
}: {
  basePath: string;
  userName: string;
  userInitial: string;
  onOpenSearch?: () => void;
  children: ReactNode;
}) {
  return (
    <div className="sv-shell relative min-h-screen overflow-x-hidden">
      <DashboardV2Sidebar
        basePath={basePath}
        userName={userName}
        userInitial={userInitial}
        onOpenSearch={onOpenSearch}
      />

      <div className="relative z-10 lg:pl-[264px] lg:pt-3">
        <main className="min-h-screen bg-sv-panel px-5 py-6 sm:px-7 lg:rounded-t-[12px] lg:border lg:border-b-0 lg:border-sv-hair">
          <div className="mx-auto max-w-[1360px]">{children}</div>
        </main>
      </div>
    </div>
  );
}
