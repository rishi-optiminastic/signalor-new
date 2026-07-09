"use client";

import { useQuery } from "@tanstack/react-query";
import { motion } from "motion/react";
import { Card, CardHeader } from "@fe/components/dashboard-v2/ui/Card";
import { CountUp } from "@fe/components/dashboard-v2/ui/CountUp";
import { DeltaChip } from "@fe/components/dashboard-v2/ui/StatusPill";
import { getShareOfVoiceCompetitors } from "@fe/lib/api/analyzer";

// Stable gradient palette for the competitor bars.
const GRADIENTS: [string, string][] = [
  ["#60a5fa", "#3b82f6"],
  ["#fb7185", "#ef4444"],
  ["#fdba74", "#f97316"],
  ["#fda4af", "#f43f5e"],
  ["#fde68a", "#f59e0b"],
  ["#e5e7eb", "#a1a1aa"],
];

export function ShareOfVoiceCard({ slug }: { slug: string }) {
  const { data } = useQuery({
    queryKey: ["v2-sov-competitors", slug],
    queryFn: () => getShareOfVoiceCompetitors(slug),
    enabled: !!slug,
  });

  const competitors = (data?.competitors ?? []).slice(0, 6);
  const maxVal = Math.max(1, ...competitors.map((c) => c.value));

  return (
    <Card>
      <CardHeader title="Share of Voice" subtitle="Your brand AI mentions vs competitors" />

      <div className="mt-3 flex items-end gap-2.5">
        <span className="text-4xl font-bold tracking-tight tabular-nums">
          <CountUp value={data?.value ?? 0} decimals={1} suffix="%" />
        </span>
        {data && (data.delta_pct ?? 0) !== 0 && (
          <DeltaChip value={Math.abs(data.delta_pct)} direction={data.direction} />
        )}
        <span className="mb-1 text-xs text-sv-muted">vs previous period</span>
      </div>

      {competitors.length === 0 ? (
        <p className="mt-5 rounded-xl border border-sv-hair bg-sv-card-2 p-4 text-center text-sm text-sv-muted">
          No share-of-voice data yet.
        </p>
      ) : (
        <>
          <ul className="mt-5 space-y-3">
            {competitors.map((c, i) => {
              const [from, to] = GRADIENTS[i % GRADIENTS.length];
              const pct = Math.round((c.value / maxVal) * 100);
              return (
                <li key={c.name} className="flex items-center gap-3">
                  <span className="flex w-[104px] items-center gap-1.5 text-xs text-sv-muted">
                    <span className="size-1.5 rounded-full" style={{ background: to }} />
                    <span className="truncate">{c.name}</span>
                  </span>
                  <span className="relative h-6 flex-1 overflow-hidden rounded-md bg-[var(--sv-track)]">
                    <motion.span
                      className="absolute inset-y-0 left-0 rounded-md"
                      style={{ background: `linear-gradient(90deg, ${from}, ${to})` }}
                      initial={{ width: 0 }}
                      animate={{ width: `${pct}%` }}
                      transition={{
                        duration: 0.9,
                        delay: 0.1 + i * 0.08,
                        ease: [0.22, 1, 0.36, 1],
                      }}
                    />
                    <span
                      className="absolute inset-y-0 flex items-center text-[11px] font-semibold text-white/90"
                      style={{ left: `max(6px, calc(${pct}% - 34px))` }}
                    >
                      {Math.round(c.value)}%
                    </span>
                  </span>
                </li>
              );
            })}
          </ul>

          <div className="mt-3 flex justify-between px-1 text-[10px] text-sv-faint">
            {["0%", "25%", "50%", "75%"].map((t) => (
              <span key={t}>{t}</span>
            ))}
          </div>
        </>
      )}
    </Card>
  );
}
