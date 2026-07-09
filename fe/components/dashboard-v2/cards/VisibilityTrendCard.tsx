"use client";

import { useQuery } from "@tanstack/react-query";
import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { ChevronDown } from "lucide-react";
import { Card } from "@fe/components/dashboard-v2/ui/Card";
import { ChartTooltip } from "@fe/components/dashboard-v2/ui/ChartTooltip";
import { getVisibilitySeries } from "@fe/lib/api/analyzer";
import { smoothSpline } from "@fe/components/dashboard-v2/data/smooth";

export function VisibilityTrendCard({ slug }: { slug: string }) {
  const { data } = useQuery({
    queryKey: ["v2-visibility-series", slug, 30],
    queryFn: () => getVisibilitySeries(slug, 30),
    enabled: !!slug,
  });

  const raw = data?.points ?? [];
  const points = smoothSpline(raw); // ease between real points → soft curve

  return (
    <Card>
      <div className="flex items-start justify-between">
        <div>
          <h2 className="text-[15px] font-semibold tracking-tight">Visibility Score Trend</h2>
          <p className="mt-0.5 text-xs text-sv-muted">Your visibility score over time</p>
        </div>
        <button className="sv-focus-ring inline-flex items-center gap-2 rounded-lg border border-sv-hair bg-sv-card-2 px-3 py-1.5 text-xs text-sv-muted transition-colors hover:border-sv-hair-strong">
          Last 30 days
          <ChevronDown className="size-3.5" />
        </button>
      </div>

      <div className="mt-4 h-[150px] w-full">
        {raw.length === 0 ? (
          <div className="flex h-full items-center justify-center text-xs text-sv-faint">
            Not enough history yet
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={points} margin={{ top: 8, right: 8, bottom: 0, left: -12 }}>
              <defs>
                <linearGradient id="svTrendStroke" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor="#f97316" />
                  <stop offset="55%" stopColor="#f472b6" />
                  <stop offset="100%" stopColor="#818cf8" />
                </linearGradient>
                <linearGradient id="svTrendFill" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#818cf8" stopOpacity={0.2} />
                  <stop offset="100%" stopColor="#818cf8" stopOpacity={0} />
                </linearGradient>
              </defs>
              <YAxis
                domain={[0, 100]}
                ticks={[0, 25, 50, 75, 100]}
                tickFormatter={(v) => `${v}%`}
                axisLine={false}
                tickLine={false}
                width={40}
                tick={{ fill: "var(--color-sv-faint)", fontSize: 11 }}
              />
              <XAxis
                dataKey="date"
                type="category"
                ticks={raw.map((p) => p.date)}
                interval={0}
                axisLine={false}
                tickLine={false}
                tickFormatter={(v) => fmtDay(v)}
                tick={{ fill: "var(--color-sv-faint)", fontSize: 11 }}
                dy={6}
              />
              <Tooltip
                cursor={{ stroke: "var(--sv-grid-line)", strokeWidth: 1 }}
                content={<ChartTooltip unit="%" />}
              />
              <Area
                type="monotone"
                dataKey="score"
                stroke="url(#svTrendStroke)"
                strokeWidth={3}
                fill="url(#svTrendFill)"
                dot={false}
                activeDot={{ r: 4, fill: "#fff", stroke: "var(--color-sv-card)", strokeWidth: 2 }}
                animationDuration={1400}
              />
            </AreaChart>
          </ResponsiveContainer>
        )}
      </div>
    </Card>
  );
}

function fmtDay(v: string): string {
  const d = new Date(v);
  if (isNaN(d.getTime())) return v;
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric", timeZone: "UTC" });
}
