"use client";

import { cn } from "@fe/lib/utils";

export type PricingAudience = "individual" | "agency";

const OPTIONS: { value: PricingAudience; label: string }[] = [
  { value: "individual", label: "Individual" },
  { value: "agency", label: "Agency" },
];

export function AudienceToggle({
  audience,
  onSelect,
  className,
}: {
  audience: PricingAudience;
  onSelect: (value: PricingAudience) => void;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "inline-flex items-center rounded-full border border-black/10 bg-muted/70 p-0.5",
        className,
      )}
      role="group"
      aria-label="Choose pricing for individuals or agencies"
    >
      {OPTIONS.map((opt) => (
        <button
          key={opt.value}
          type="button"
          onClick={() => onSelect(opt.value)}
          aria-pressed={audience === opt.value}
          className={cn(
            "rounded-full px-4 py-1 text-xs font-semibold transition-all",
            audience === opt.value
              ? "bg-white text-foreground shadow-sm"
              : "text-muted-foreground hover:text-foreground",
          )}
        >
          {opt.label}
        </button>
      ))}
    </div>
  );
}
