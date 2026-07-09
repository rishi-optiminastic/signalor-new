"use client";

import { useQuery } from "@tanstack/react-query";
import { Card, CardFooterLink, CardHeader } from "@fe/components/dashboard-v2/ui/Card";
import { Sparkline } from "@fe/components/dashboard-v2/ui/Sparkline";
import { SentimentLabel } from "@fe/components/dashboard-v2/ui/StatusPill";
import { LogoImg } from "@fe/components/dashboard-v2/ui/LogoImg";
import { engineMeta } from "@fe/components/dashboard-v2/data/constants";
import { getTopSources } from "@fe/lib/api/analyzer";

export function TopSourcesCard({ slug }: { slug: string }) {
  const { data } = useQuery({
    queryKey: ["v2-top-sources", slug],
    queryFn: () => getTopSources(slug),
    enabled: !!slug,
  });

  const sources = data?.sources ?? [];

  return (
    <Card>
      <CardHeader
        title="Top Performing AI Sources"
        subtitle="Where your brand is being mentioned"
      />

      {sources.length === 0 ? (
        <p className="mt-4 rounded-xl border border-sv-hair bg-sv-card-2 p-4 text-center text-sm text-sv-muted">
          No source data yet.
        </p>
      ) : (
        <table className="mt-4 w-full border-collapse text-[13px]">
          <thead>
            <tr className="text-[10px] font-medium uppercase tracking-wide text-sv-faint">
              <th className="pb-2 text-left font-medium">Source</th>
              <th className="pb-2 pl-1 text-right font-medium">Ment.</th>
              <th className="pb-2 pl-2 text-right font-medium">Sent.</th>
              <th className="pb-2 pl-2 text-right font-medium">Impact</th>
              <th className="pb-2 pl-2 text-right font-medium">Trend</th>
            </tr>
          </thead>
          <tbody>
            {sources.map((s) => {
              const meta = engineMeta(s.engine || s.name);
              return (
                <tr
                  key={s.name}
                  className="border-t border-sv-hair transition-colors hover:bg-[var(--sv-hover)]"
                >
                  <td className="py-2.5">
                    <div className="flex items-center gap-2">
                      <LogoImg domain={meta.domain} name={s.name} color={meta.color} size={22} />
                      <span className="truncate">{s.name}</span>
                    </div>
                  </td>
                  <td className="py-2.5 pl-1 text-right tabular-nums text-sv-muted">
                    {s.mentions}
                  </td>
                  <td className="py-2.5 pl-2 text-right tabular-nums text-sv-muted">
                    {s.sentiment != null ? `${Math.round(s.sentiment)}%` : "—"}
                  </td>
                  <td className="py-2.5 pl-2 text-right">
                    <SentimentLabel level={s.impact} />
                  </td>
                  <td className="py-2.5 pl-2">
                    <div className="flex justify-end">
                      <Sparkline
                        data={s.spark}
                        width={52}
                        height={22}
                        color={s.impact === "low" ? "#f87171" : "#34d399"}
                      />
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      )}

      <CardFooterLink label="View all sources" />
    </Card>
  );
}
