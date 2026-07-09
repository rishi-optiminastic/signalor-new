import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@fe/lib/utils";

/**
 * Token-based alert / inline banner. Replaces hand-rolled error/notice `<div>`s.
 * Variants resolve to design tokens (info/success/warning/destructive + neutral).
 */
const alertVariants = cva(
  "relative grid w-full grid-cols-[0_1fr] items-start gap-y-0.5 rounded-xl border px-4 py-3 text-sm has-[>svg]:grid-cols-[calc(theme(spacing.4)+0.75rem)_1fr] has-[>svg]:gap-x-3 [&>svg]:size-4 [&>svg]:translate-y-0.5 [&>svg]:shrink-0",
  {
    variants: {
      variant: {
        neutral: "border-border bg-card text-foreground",
        info: "border-info/25 bg-info/5 text-info",
        success: "border-success/25 bg-success/5 text-success",
        warning: "border-warning/25 bg-warning/5 text-warning",
        destructive: "border-destructive/25 bg-destructive/5 text-destructive",
      },
    },
    defaultVariants: {
      variant: "neutral",
    },
  },
);

function Alert({
  className,
  variant,
  ...props
}: React.ComponentProps<"div"> & VariantProps<typeof alertVariants>) {
  return (
    <div
      data-slot="alert"
      data-variant={variant}
      role="alert"
      className={cn(alertVariants({ variant }), className)}
      {...props}
    />
  );
}

function AlertTitle({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="alert-title"
      className={cn("col-start-2 font-semibold tracking-tight", className)}
      {...props}
    />
  );
}

function AlertDescription({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="alert-description"
      className={cn("col-start-2 text-sm [&_p]:leading-relaxed", className)}
      {...props}
    />
  );
}

export { Alert, AlertTitle, AlertDescription };
