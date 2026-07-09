import { ArrowDownRight, ArrowUpRight } from "lucide-react";
import { cn } from "@fe/lib/utils";
import type { Impact } from "@fe/components/dashboard-v2/types";

const impactStyles: Record<Impact, string> = {
  high: "text-sv-brand bg-sv-brand-soft",
  medium: "text-sv-amber bg-[rgba(251,191,36,0.12)]",
  low: "text-sv-info bg-[rgba(96,165,250,0.12)]",
};

const impactLabel: Record<Impact, string> = {
  high: "High impact",
  medium: "Med impact",
  low: "Low impact",
};

export function ImpactPill({ impact }: { impact: Impact }) {
  return (
    <span
      className={cn(
        "inline-flex shrink-0 items-center whitespace-nowrap rounded-md px-2 py-0.5 text-[11px] font-medium",
        impactStyles[impact],
      )}
    >
      {impactLabel[impact]}
    </span>
  );
}

const sentimentStyles: Record<Impact, string> = {
  high: "text-sv-pos",
  medium: "text-sv-amber",
  low: "text-sv-neg",
};

export function SentimentLabel({ level }: { level: Impact }) {
  const text = level === "high" ? "High" : level === "medium" ? "Medium" : "Low";
  return <span className={cn("font-medium", sentimentStyles[level])}>{text}</span>;
}

/** Green/red delta chip like "+0.48%" or "-2.5%". */
export function DeltaChip({ value, direction }: { value: number; direction: "up" | "down" }) {
  const up = direction === "up";
  const Icon = up ? ArrowUpRight : ArrowDownRight;
  return (
    <span
      className={cn(
        "inline-flex items-center gap-0.5 rounded-md px-1.5 py-0.5 text-xs font-semibold",
        up ? "text-sv-pos bg-sv-pos-soft" : "text-sv-neg bg-sv-neg-soft",
      )}
    >
      <Icon className="size-3" strokeWidth={2.5} />
      {value}%
    </span>
  );
}
