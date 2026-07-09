"use client";

import { useQuery } from "@tanstack/react-query";
import { Card, CardHeader } from "@fe/components/dashboard-v2/ui/Card";
import { RingProgress } from "@fe/components/dashboard-v2/ui/Donut";
import { CountUp } from "@fe/components/dashboard-v2/ui/CountUp";
import { LogoImg } from "@fe/components/dashboard-v2/ui/LogoImg";
import { engineMeta } from "@fe/components/dashboard-v2/data/constants";
import { getAiRecommendationSummary } from "@fe/lib/api/analyzer";

export function CitationCoverageCard({ slug }: { slug: string }) {
  const { data, isLoading } = useQuery({
    queryKey: ["v2-citation-summary", slug],
    queryFn: () => getAiRecommendationSummary(slug),
    enabled: !!slug,
  });

  const pct = Math.round(data?.citation_pct ?? 0);
  const cited = data?.cited ?? 0;
  const total = data?.total ?? 0;
  const sources = (data?.per_engine ?? [])
    .filter((e) => e.cited > 0 || e.mentioned > 0)
    .map((e) => engineMeta(e.engine));

  return (
    <Card>
      <CardHeader title="Citation Coverage" subtitle="% of AI answers that cite your brand" />
      <div className="mt-4 flex items-center gap-6">
        <RingProgress value={pct} size={116} thickness={12}>
          <span className="text-2xl font-bold tabular-nums">
            <CountUp value={pct} suffix="%" />
          </span>
        </RingProgress>

        <div className="flex-1">
          <p className="text-sm text-sv-muted">
            Cited in <span className="font-semibold text-sv-ink">{cited}</span> of
          </p>
          <p className="text-sm text-sv-muted">
            <span className="font-semibold text-sv-ink">{total}</span> answers
          </p>
          <div className="mt-3 flex items-center gap-1.5">
            {isLoading && sources.length === 0
              ? Array.from({ length: 4 }).map((_, i) => (
                  <span key={i} className="sv-skeleton size-[26px] rounded-lg" />
                ))
              : sources.map((s) => (
                  <LogoImg
                    key={s.label}
                    domain={s.domain}
                    name={s.label}
                    color={s.color}
                    size={26}
                  />
                ))}
          </div>
        </div>
      </div>
    </Card>
  );
}
