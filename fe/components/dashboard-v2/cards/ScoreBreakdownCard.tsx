"use client";

import { Card, CardHeader } from "@fe/components/dashboard-v2/ui/Card";
import { RingProgress } from "@fe/components/dashboard-v2/ui/Donut";
import { CountUp } from "@fe/components/dashboard-v2/ui/CountUp";
import { PILLARS } from "@fe/components/dashboard-v2/data/constants";
import type { PageScore } from "@fe/lib/api/analyzer";

/** Average a pillar across all analysed pages. */
function avg(pageScores: PageScore[], key: keyof PageScore): number {
  if (!pageScores.length) return 0;
  const sum = pageScores.reduce((acc, p) => acc + (Number(p[key]) || 0), 0);
  return Math.round(sum / pageScores.length);
}

export function ScoreBreakdownCard({ pageScores }: { pageScores: PageScore[] }) {
  const rows = PILLARS.map((p) => ({
    label: p.label,
    color: p.color,
    value: avg(pageScores, p.key as keyof PageScore),
  }));
  const total = pageScores.length ? avg(pageScores, "composite_score") : 0;

  return (
    <Card>
      <CardHeader title="Visibility Score Breakdown" subtitle="How your score is calculated" />

      <div className="mt-5 flex flex-col items-center">
        {/* Total is a single value (not a sum of parts) → one ring, not a
            proportional donut. Each pillar is its own 0-100 score shown as a bar. */}
        <RingProgress value={total} size={140} thickness={14}>
          <span className="text-2xl font-bold tabular-nums">
            <CountUp value={total} suffix="%" />
          </span>
          <span className="text-[11px] text-sv-muted">Total Score</span>
        </RingProgress>

        <ul className="mt-6 w-full space-y-3">
          {rows.map((s) => (
            <li key={s.label} className="flex items-center gap-3 text-[13px]">
              <span className="size-2.5 shrink-0 rounded-sm" style={{ background: s.color }} />
              <span className="w-[116px] shrink-0 truncate text-sv-muted">{s.label}</span>
              <span className="relative h-1.5 flex-1 overflow-hidden rounded-full bg-[var(--sv-track)]">
                <span
                  className="absolute inset-y-0 left-0 rounded-full"
                  style={{ width: `${Math.min(100, Math.max(0, s.value))}%`, background: s.color }}
                />
              </span>
              <span className="w-9 shrink-0 text-right font-semibold tabular-nums">{s.value}%</span>
            </li>
          ))}
        </ul>
      </div>
    </Card>
  );
}
