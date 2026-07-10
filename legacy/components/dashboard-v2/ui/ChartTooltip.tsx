"use client";

import type { TooltipContentProps } from "recharts";

function fmtLabel(v: unknown): string | null {
  if (v == null) return null;
  if (typeof v === "string" && /\d{4}-\d{2}-\d{2}/.test(v)) {
    const d = new Date(v);
    if (!isNaN(d.getTime())) {
      return d.toLocaleDateString("en-US", { month: "short", day: "numeric", timeZone: "UTC" });
    }
  }
  return String(v);
}

/** Floating glass tooltip shared by the line/area charts. */
export function ChartTooltip({
  active,
  payload,
  label,
  unit = "",
}: Partial<TooltipContentProps<number, string>> & { unit?: string }) {
  if (!active || !payload?.length) return null;
  const p = payload[0];
  const value = typeof p?.value === "number" ? Math.round(p.value) : p?.value;
  // Prefer the data point's own date (interpolated points carry one) over the
  // raw axis label so smoothed series still show a real date.
  const text = fmtLabel((p?.payload as { date?: string } | undefined)?.date ?? label);
  return (
    <div className="sv-glass rounded-lg border border-sv-hair-strong px-3 py-2 shadow-xl">
      {text && <p className="text-[11px] font-medium text-sv-faint">{text}</p>}
      <p className="text-sm font-semibold text-sv-ink tabular-nums">
        {value}
        {unit}
      </p>
    </div>
  );
}
