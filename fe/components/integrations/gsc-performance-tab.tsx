"use client";

import { useEffect, useState } from "react";
import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Button } from "@fe/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@fe/components/ui/card";
import { getGSCData, syncGSCData, type GSCDataSnapshot } from "@fe/lib/api/integrations";

interface GSCPerformanceTabProps {
  email: string;
  analyzedUrl?: string;
}

function fmt(n: number): string {
  return n.toLocaleString("en-US");
}

function pct(n: number): string {
  return `${(n * 100).toFixed(1)}%`;
}

export function GSCPerformanceTab({ email, analyzedUrl }: GSCPerformanceTabProps) {
  const [data, setData] = useState<GSCDataSnapshot | null>(null);
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!email) return;
    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [email, analyzedUrl]);

  async function loadData() {
    try {
      const snapshot = await getGSCData(email, analyzedUrl);
      setData(snapshot);
      setError(null);
    } catch {
      setData(null);
    } finally {
      setLoading(false);
    }
  }

  async function handleSync() {
    setSyncing(true);
    setError(null);
    try {
      await syncGSCData(email);
      const poll = setInterval(async () => {
        try {
          const snapshot = await getGSCData(email, analyzedUrl);
          if (snapshot.sync_status === "complete") {
            setData(snapshot);
            setSyncing(false);
            clearInterval(poll);
          } else if (snapshot.sync_status === "failed") {
            setError(snapshot.error_message || "Sync failed.");
            setSyncing(false);
            clearInterval(poll);
          }
        } catch {
          // still syncing
        }
      }, 3000);

      setTimeout(() => {
        clearInterval(poll);
        setSyncing((s) => {
          if (s) setError("Sync timed out. Try again later.");
          return false;
        });
      }, 60_000);
    } catch {
      setError("Failed to start sync.");
      setSyncing(false);
    }
  }

  if (loading) {
    return (
      <p className="text-sm text-muted-foreground py-8 text-center">
        Loading Search Console data...
      </p>
    );
  }

  if (!data) {
    return (
      <div className="py-8 text-center space-y-3">
        <p className="text-muted-foreground">No Search Console data available yet.</p>
        <Button onClick={handleSync} disabled={syncing} size="sm">
          {syncing ? "Syncing..." : "Sync Now"}
        </Button>
      </div>
    );
  }

  const ago = getTimeAgo(new Date(data.created_at));
  const chartData = data.daily_trend.map((d) => ({
    date: d.date.slice(5), // MM-DD
    clicks: d.clicks,
    impressions: d.impressions,
  }));

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <p className="text-xs text-muted-foreground">
          {data.date_start} → {data.date_end} • updated {ago}
        </p>
        <Button variant="outline" size="sm" onClick={handleSync} disabled={syncing}>
          {syncing ? "Syncing..." : "Refresh Data"}
        </Button>
      </div>

      {error && (
        <div className="rounded-md border border-destructive/50 bg-destructive/10 p-3 text-sm text-destructive">
          {error}
        </div>
      )}

      {analyzedUrl && data.page_match && (
        <div
          className={`rounded-md border p-3 text-sm ${
            data.page_match.found
              ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-600"
              : "border-amber-500/30 bg-amber-500/10 text-amber-600"
          }`}
        >
          {data.page_match.found ? (
            <>
              This page is getting search traffic: {fmt(data.page_match.clicks)} clicks,{" "}
              {fmt(data.page_match.impressions)} impressions, avg position{" "}
              {data.page_match.position.toFixed(1)}.
            </>
          ) : (
            <>The analyzed page has no Search Console data in the last 30 days.</>
          )}
        </div>
      )}

      {/* KPI strip */}
      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        <KPITile label="Total clicks" value={fmt(data.clicks)} />
        <KPITile label="Total impressions" value={fmt(data.impressions)} />
        <KPITile label="Average CTR" value={pct(data.ctr)} />
        <KPITile label="Average position" value={data.position.toFixed(1)} />
      </div>

      {/* Daily trend */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Clicks & impressions (last 30 days)</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                <XAxis dataKey="date" tick={{ fontSize: 11 }} className="fill-muted-foreground" />
                <YAxis yAxisId="left" tick={{ fontSize: 11 }} className="fill-muted-foreground" />
                <YAxis
                  yAxisId="right"
                  orientation="right"
                  tick={{ fontSize: 11 }}
                  className="fill-muted-foreground"
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(var(--card))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "8px",
                    fontSize: "12px",
                  }}
                />
                <Legend />
                <Line
                  yAxisId="left"
                  type="monotone"
                  dataKey="clicks"
                  stroke="hsl(var(--primary))"
                  strokeWidth={2}
                  dot={false}
                  name="Clicks"
                />
                <Line
                  yAxisId="right"
                  type="monotone"
                  dataKey="impressions"
                  stroke="#22c55e"
                  strokeWidth={2}
                  dot={false}
                  name="Impressions"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-6 lg:grid-cols-2">
        <MetricTable
          title="Top queries"
          firstCol="Query"
          rows={data.top_queries.map((q) => ({
            label: q.query,
            clicks: q.clicks,
            impressions: q.impressions,
            ctr: q.ctr,
            position: q.position,
          }))}
        />
        <MetricTable
          title="Top pages"
          firstCol="Page"
          rows={data.top_pages.map((p) => ({
            label: p.page,
            clicks: p.clicks,
            impressions: p.impressions,
            ctr: p.ctr,
            position: p.position,
          }))}
        />
      </div>
    </div>
  );
}

function KPITile({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-border bg-background p-3">
      <p className="text-[11px] uppercase tracking-wide text-muted-foreground">{label}</p>
      <p className="mt-1 text-xl font-semibold text-foreground">{value}</p>
    </div>
  );
}

interface MetricRow {
  label: string;
  clicks: number;
  impressions: number;
  ctr: number;
  position: number;
}

function MetricTable({
  title,
  firstCol,
  rows,
}: {
  title: string;
  firstCol: string;
  rows: MetricRow[];
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        {rows.length === 0 ? (
          <p className="text-sm text-muted-foreground">No data.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border text-left text-xs text-muted-foreground">
                  <th className="py-2 pr-2 font-medium">{firstCol}</th>
                  <th className="py-2 px-2 text-right font-medium">Clicks</th>
                  <th className="py-2 px-2 text-right font-medium">Impr.</th>
                  <th className="py-2 px-2 text-right font-medium">CTR</th>
                  <th className="py-2 pl-2 text-right font-medium">Pos.</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((r, i) => (
                  <tr key={`${r.label}-${i}`} className="border-b border-border/50">
                    <td className="max-w-[220px] truncate py-2 pr-2" title={r.label}>
                      {r.label}
                    </td>
                    <td className="py-2 px-2 text-right tabular-nums">{fmt(r.clicks)}</td>
                    <td className="py-2 px-2 text-right tabular-nums">{fmt(r.impressions)}</td>
                    <td className="py-2 px-2 text-right tabular-nums">{pct(r.ctr)}</td>
                    <td className="py-2 pl-2 text-right tabular-nums">{r.position.toFixed(1)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

function getTimeAgo(date: Date): string {
  const seconds = Math.floor((Date.now() - date.getTime()) / 1000);
  if (seconds < 60) return "just now";
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}
