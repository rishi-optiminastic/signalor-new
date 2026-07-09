"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { RefreshCw } from "lucide-react";
import { useSession } from "@fe/lib/auth-client";
import { config, routes } from "@fe/lib/config";
import { getExportPDFUrl, startAnalysis } from "@fe/lib/api/analyzer";
import { Reveal } from "@fe/components/dashboard-v2/ui/Reveal";
import { DashboardV2Topbar } from "@fe/components/dashboard-v2/DashboardV2Topbar";
import { VisibilityRankingCard } from "@fe/components/dashboard-v2/cards/VisibilityRankingCard";
import { VisibilityTrendCard } from "@fe/components/dashboard-v2/cards/VisibilityTrendCard";
import { CitationCoverageCard } from "@fe/components/dashboard-v2/cards/CitationCoverageCard";
import { ShareOfVoiceCard } from "@fe/components/dashboard-v2/cards/ShareOfVoiceCard";
import { TopSourcesCard } from "@fe/components/dashboard-v2/cards/TopSourcesCard";
import { EngagementCard } from "@fe/components/dashboard-v2/cards/EngagementCard";
import { ScoreBreakdownCard } from "@fe/components/dashboard-v2/cards/ScoreBreakdownCard";
import { useRun } from "./run-context";

export function OverviewV2() {
  const { run } = useRun();
  const { data: session } = useSession();
  const router = useRouter();
  const [reanalyzing, setReanalyzing] = useState(false);

  if (!run) return null;

  const slug = run.slug;
  const email = session?.user?.email ?? "";
  const userName = session?.user?.name || session?.user?.email?.split("@")[0] || "there";
  const brandName = run.display_brand_name || run.brand_name;
  const lastUpdated = fmtUpdated(run.updated_at);

  const onExport = () => {
    if (typeof window !== "undefined") {
      window.open(`${config.apiBaseUrl}${getExportPDFUrl(run.id)}`, "_blank", "noopener");
    }
  };

  const onReanalyze = async () => {
    if (!email || reanalyzing) return;
    setReanalyzing(true);
    try {
      // Re-run the same URL in the same workspace (org-scoped when present).
      const newRun = await startAnalysis({
        url: run.url,
        run_type: "single_page",
        email,
        brand_name: run.brand_name,
        org_id: run.organization_id ?? undefined,
      });
      router.push(routes.dashboardProject(newRun.slug));
    } catch {
      setReanalyzing(false);
    }
  };

  return (
    <>
      <Reveal>
        <DashboardV2Topbar
          userName={userName}
          brandName={brandName}
          lastUpdated={lastUpdated}
          onExport={onExport}
          onReanalyze={onReanalyze}
          reanalyzing={reanalyzing}
        />
      </Reveal>

      <div className="mt-6 grid grid-cols-1 gap-5 xl:grid-cols-12">
        {/* Left column — hero + trend */}
        <div className="min-w-0 space-y-5 xl:col-span-5">
          <Reveal delay={0.05}>
            <VisibilityRankingCard slug={slug} />
          </Reveal>
          <Reveal delay={0.1}>
            <VisibilityTrendCard slug={slug} />
          </Reveal>
        </div>

        {/* Middle column — citation, share of voice, sources */}
        <div className="min-w-0 space-y-5 xl:col-span-4">
          <Reveal delay={0.12}>
            <CitationCoverageCard slug={slug} />
          </Reveal>
          <Reveal delay={0.17}>
            <ShareOfVoiceCard slug={slug} />
          </Reveal>
          <Reveal delay={0.22}>
            <TopSourcesCard slug={slug} />
          </Reveal>
        </div>

        {/* Right column — opportunities, breakdown */}
        <div className="min-w-0 space-y-5 xl:col-span-3">
          <Reveal delay={0.19}>
            <EngagementCard
              recommendations={run.recommendations}
              tasksHref={`/dashboard/${slug}/recommendations`}
            />
          </Reveal>
          <Reveal delay={0.24}>
            <ScoreBreakdownCard pageScores={run.page_scores} />
          </Reveal>
        </div>
      </div>

      <footer className="mt-6 flex items-center justify-center gap-2 pb-2 text-center text-xs text-sv-faint">
        <span>All data is aggregated from AI model responses and public sources.</span>
        <RefreshCw className="size-3" />
      </footer>
    </>
  );
}

function fmtUpdated(iso: string): string | undefined {
  const d = new Date(iso);
  if (isNaN(d.getTime())) return undefined;
  return d.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC",
  });
}
