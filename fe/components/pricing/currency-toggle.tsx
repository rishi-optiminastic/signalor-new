"use client";

import { cn } from "@fe/lib/utils";
import type { CurrencyCode, Currency } from "@fe/lib/hooks/use-currency";

const OPTIONS: { code: CurrencyCode; label: string }[] = [
  { code: "GBP", label: "£ GBP" },
  { code: "INR", label: "₹ INR" },
  { code: "USD", label: "$ USD" },
  { code: "EUR", label: "€ EUR" },
];

export function CurrencyToggle({
  currency,
  onSelect,
  className,
}: {
  currency: Currency;
  onSelect: (code: CurrencyCode) => void;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "inline-flex items-center rounded-full border border-black/10 bg-muted/70 p-0.5",
        className,
      )}
      role="group"
      aria-label="Select display currency"
    >
      {OPTIONS.map((opt) => (
        <button
          key={opt.code}
          type="button"
          onClick={() => onSelect(opt.code)}
          aria-pressed={currency.code === opt.code}
          className={cn(
            "rounded-full px-3.5 py-1 text-xs font-semibold transition-all",
            currency.code === opt.code
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
