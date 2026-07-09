import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { Slot } from "radix-ui";

import { cn } from "@fe/lib/utils";

/**
 * Token-based status / category badge.
 *
 * Replaces hand-rolled `<span className="rounded-full border ...">` chips and the
 * `PILLAR_COLORS` / `PRIORITY_CONFIG` constant maps. Every variant resolves to a
 * design token (core tokens or the `--feature-*` palette) — no raw hex / palette stops.
 */
const badgeVariants = cva(
  "inline-flex items-center justify-center gap-1 rounded-full border px-2 py-0.5 text-[11px] font-semibold whitespace-nowrap shrink-0 transition-colors outline-none focus-visible:ring-ring/50 focus-visible:ring-[3px] [&>svg]:size-3 [&>svg]:pointer-events-none",
  {
    variants: {
      variant: {
        neutral: "border-border bg-muted/40 text-muted-foreground",
        primary: "border-primary/20 bg-primary/10 text-primary",
        secondary: "border-border bg-secondary text-secondary-foreground",
        destructive: "border-destructive/20 bg-destructive/10 text-destructive",
        outline: "border-border text-foreground",
        // Semantic / category accents mapped to the existing --feature-* tokens.
        success:
          "border-[var(--feature-emerald)]/25 bg-[var(--feature-emerald-tint)] text-[var(--feature-emerald)]",
        warning:
          "border-[var(--feature-amber)]/25 bg-[var(--feature-amber-tint)] text-[var(--feature-amber)]",
        info: "border-[var(--feature-blue)]/25 bg-[var(--feature-blue-tint)] text-[var(--feature-blue)]",
        violet:
          "border-[var(--feature-violet)]/25 bg-[var(--feature-violet-tint)] text-[var(--feature-violet)]",
      },
    },
    defaultVariants: {
      variant: "neutral",
    },
  },
);

function Badge({
  className,
  variant,
  asChild = false,
  ...props
}: React.ComponentProps<"span"> &
  VariantProps<typeof badgeVariants> & {
    asChild?: boolean;
  }) {
  const Comp = asChild ? Slot.Root : "span";

  return (
    <Comp
      data-slot="badge"
      data-variant={variant}
      className={cn(badgeVariants({ variant }), className)}
      {...props}
    />
  );
}

export { Badge, badgeVariants };
