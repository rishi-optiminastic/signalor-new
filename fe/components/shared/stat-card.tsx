import * as React from "react";

import { Card, CardContent } from "@fe/components/ui/card";
import { Badge } from "@fe/components/ui/badge";
import { cn } from "@fe/lib/utils";

type Trend = "up" | "down" | "flat";

const TREND_VARIANT: Record<Trend, React.ComponentProps<typeof Badge>["variant"]> = {
  up: "success",
  down: "destructive",
  flat: "neutral",
};

/**
 * Metric/stat card: label + big value (+ optional suffix) + optional delta chip.
 *
 * Consumes `ui/Card` for chrome and `ui/Badge` for the delta — no custom styling.
 */
function StatCard({
  label,
  value,
  suffix,
  delta,
  deltaVariant,
  icon,
  className,
}: {
  label: React.ReactNode;
  value: React.ReactNode;
  suffix?: React.ReactNode;
  delta?: { label: React.ReactNode; trend?: Trend };
  /** Override the auto trend→variant mapping. */
  deltaVariant?: React.ComponentProps<typeof Badge>["variant"];
  /** Optional top-right adornment (e.g. an icon). */
  icon?: React.ReactNode;
  className?: string;
}) {
  return (
    <Card data-slot="stat-card" className={cn("h-full", className)}>
      <CardContent className="flex flex-col gap-2">
        <div className="flex items-center justify-between gap-2">
          <span className="text-sm font-semibold text-foreground">{label}</span>
          {icon}
        </div>
        <div className="flex items-end gap-1.5">
          <span className="text-2xl font-bold leading-none tracking-tight tabular-nums text-foreground">
            {value}
          </span>
          {suffix ? <span className="pb-0.5 text-sm text-muted-foreground">{suffix}</span> : null}
        </div>
        {delta ? (
          <Badge variant={deltaVariant ?? TREND_VARIANT[delta.trend ?? "flat"]} className="w-fit">
            {delta.label}
          </Badge>
        ) : null}
      </CardContent>
    </Card>
  );
}

export { StatCard };
