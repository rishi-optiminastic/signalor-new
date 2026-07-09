"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { BarChart3, LineChart as LineIcon } from "lucide-react";
import { Card, CardFooterLink } from "@fe/components/dashboard-v2/ui/Card";
import { CountUp } from "@fe/components/dashboard-v2/ui/CountUp";
import { DeltaChip } from "@fe/components/dashboard-v2/ui/StatusPill";
import { AiModelDots, LogoImg } from "@fe/components/dashboard-v2/ui/LogoImg";
import { ChartTooltip } from "@fe/components/dashboard-v2/ui/ChartTooltip";
import { getRankings, getVisibilitySeries, type RankingRow } from "@fe/lib/api/analyzer";
import { smoothSpline } from "@fe/components/dashboard-v2/data/smooth";
import { cn } from "@fe/lib/utils";

export function VisibilityRankingCard({ slug }: { slug: string }) {
  const [view, setView] = useState<"line" | "bar">("line");

  const { data: series } = useQuery({
    queryKey: ["v2-visibility-series", slug, 30],
    queryFn: () => getVisibilitySeries(slug, 30),
    enabled: !!slug,
  });
  const { data: rankings } = useQuery({
    queryKey: ["v2-rankings", slug],
    queryFn: () => getRankings(slug),
    enabled: !!slug,
  });

  const rows = rankings?.rows ?? [];
  const youRow = rows.find((r) => r.is_you);
  // Headline = the brand's actual current score (always present via rankings),
  // not the windowed series — which is empty when the last analysis predates
  // the window and would otherwise render a misleading 0%.
  const value = Math.round(youRow?.visibility ?? series?.current ?? 0);
  const raw = series?.points ?? [];
  // A trend line needs ≥2 dated points. With a single analysis there's no trend
  // to draw, so render a flat baseline spanning the window (a clean line, not a
  // lone dot) and note it below. With ≥2 points, ease into a soft spline.
  const singlePoint = raw.length === 1;
  const points = singlePoint
    ? [
        { date: `${raw[0].date}~`, score: raw[0].score },
        { date: raw[0].date, score: raw[0].score },
      ]
    : smoothSpline(raw); // ease between real points → soft curve
  const maxScore = Math.max(80, ...raw.map((p) => p.score));
  const lastIndex = points.length - 1;

  return (
    <Card>
      <div className="flex items-start justify-between">
        <div>
          <h2 className="text-[15px] font-semibold tracking-tight">
            LLM Visibility Score &amp; Ranking
          </h2>
          <p className="mt-0.5 text-xs text-sv-muted">
            Your brand visibility &amp; ranking in AI results
          </p>
        </div>
        <div className="flex items-center gap-0.5 rounded-lg border border-sv-hair bg-sv-card-2 p-0.5">
          <ToggleBtn active={view === "line"} onClick={() => setView("line")}>
            <LineIcon className="size-4" />
          </ToggleBtn>
          <ToggleBtn active={view === "bar"} onClick={() => setView("bar")}>
            <BarChart3 className="size-4" />
          </ToggleBtn>
        </div>
      </div>

      <div className="mt-4 flex items-start justify-between">
        <div>
          <div className="flex items-center gap-2.5">
            <span className="text-5xl font-bold tracking-tight tabular-nums">
              <CountUp value={value} suffix="%" />
            </span>
            {series && raw.length > 1 && (
              <DeltaChip value={Math.abs(series.delta_pct)} direction={series.direction} />
            )}
          </div>
          <p className="mt-1 text-xs text-sv-muted">vs previous period</p>
        </div>
        <div className="text-right">
          <span className="text-2xl font-bold tracking-tight">#{rankings?.your_rank ?? "—"}</span>
          <p className="text-xs text-sv-muted">Your rank</p>
        </div>
      </div>

      <div className="mt-2 h-[168px] w-full">
        {raw.length === 0 ? (
          <div className="flex h-full items-center justify-center text-xs text-sv-faint">
            Run more analyses to see your score trend
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={points} margin={{ top: 12, right: 16, bottom: 0, left: -8 }}>
              <defs>
                <linearGradient id="svSplineStroke" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor="#f97316" />
                  <stop offset="45%" stopColor="#f472b6" />
                  <stop offset="80%" stopColor="#a78bfa" />
                  <stop offset="100%" stopColor="#60a5fa" />
                </linearGradient>
                <linearGradient id="svSplineFill" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#f472b6" stopOpacity={0.22} />
                  <stop offset="100%" stopColor="#f472b6" stopOpacity={0} />
                </linearGradient>
              </defs>
              <YAxis
                domain={[0, Math.ceil(maxScore / 20) * 20]}
                axisLine={false}
                tickLine={false}
                width={38}
                tickFormatter={(v) => `${v}%`}
                tick={{ fill: "var(--color-sv-faint)", fontSize: 11 }}
              />
              <XAxis
                dataKey="date"
                type="category"
                ticks={raw.map((p) => p.date)}
                interval={0}
                axisLine={false}
                tickLine={false}
                tick={{ fill: "var(--color-sv-faint)", fontSize: 11 }}
                tickFormatter={(v) => fmtDay(v)}
                dy={6}
              />
              <Tooltip
                cursor={{ stroke: "var(--sv-grid-line)", strokeWidth: 1 }}
                content={<ChartTooltip unit="%" />}
              />
              <Area
                type="monotone"
                dataKey="score"
                stroke="url(#svSplineStroke)"
                strokeWidth={3.5}
                fill="url(#svSplineFill)"
                dot={<EndDot lastIndex={lastIndex} />}
                activeDot={{ r: 5, fill: "#fff", stroke: "var(--color-sv-card)", strokeWidth: 2 }}
                animationDuration={view === "line" ? 1200 : 600}
              />
            </AreaChart>
          </ResponsiveContainer>
        )}
      </div>

      {singlePoint && (
        <p className="-mt-1 text-center text-[11px] text-sv-faint">
          Based on 1 analysis — run again on another day to build your trend line.
        </p>
      )}

      <RankingTable rows={rows} />

      <CardFooterLink label="View full rankings" />
    </Card>
  );
}

function RankingTable({ rows }: { rows: RankingRow[] }) {
  return (
    <div className="mt-4 overflow-hidden rounded-xl border border-sv-hair">
      <div className="flex items-center justify-between bg-sv-card-2 px-3.5 py-2 text-[11px] font-medium uppercase tracking-wide text-sv-faint">
        <span>Rank</span>
        <span className="hidden sm:inline">Sources</span>
      </div>
      {rows.length === 0 ? (
        <p className="px-3.5 py-4 text-center text-xs text-sv-faint">No competitor data yet.</p>
      ) : (
        <ul className="divide-y divide-sv-hair">
          {rows.map((r) => (
            <li
              key={`${r.rank}-${r.company}`}
              className={cn(
                "flex items-center gap-3 px-3.5 py-2.5 transition-colors hover:bg-[var(--sv-hover)]",
                r.is_you && "bg-sv-brand-soft/40",
              )}
            >
              <span className="w-4 text-sm font-semibold text-sv-muted tabular-nums">{r.rank}</span>
              <LogoImg domain={r.domain} name={r.company} color={r.color} size={26} />
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium">
                  {r.company}
                  {r.is_you && <span className="ml-1.5 text-xs text-sv-brand">You</span>}
                </p>
                <p className="text-xs text-sv-faint">
                  <span style={{ color: r.color }}>{Math.round(r.visibility)}% Visibility</span>
                  {r.sentiment != null && (
                    <>
                      {" · "}
                      {Math.round(r.sentiment)} Sentiment
                    </>
                  )}
                </p>
              </div>
              <div className="text-right">
                <p className="text-sm font-semibold tabular-nums">{r.avg_position || "—"}</p>
                <p className="text-[11px] text-sv-faint">Avg. Position</p>
              </div>
              <span className="hidden sm:block">
                <AiModelDots />
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function ToggleBtn({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "sv-focus-ring grid size-7 place-items-center rounded-md transition-colors",
        active ? "bg-sv-elevated text-sv-ink" : "text-sv-faint hover:text-sv-muted",
      )}
    >
      {children}
    </button>
  );
}

// Recharts clones this element per point, injecting cx/cy/index and keeping our
// lastIndex prop — so we render the marker only on the final point.
function EndDot({
  cx,
  cy,
  index,
  lastIndex,
}: {
  cx?: number;
  cy?: number;
  index?: number;
  lastIndex?: number;
}) {
  if (index !== lastIndex || cx == null || cy == null) return null;
  return (
    <g>
      <circle cx={cx} cy={cy} r={9} fill="#a78bfa" opacity={0.18} />
      <circle cx={cx} cy={cy} r={5} fill="#fff" stroke="var(--color-sv-brand)" strokeWidth={2} />
    </g>
  );
}

function fmtDay(v: string): string {
  // v is an ISO date; show "Jun 3"
  const d = new Date(v);
  if (isNaN(d.getTime())) return v;
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric", timeZone: "UTC" });
}
