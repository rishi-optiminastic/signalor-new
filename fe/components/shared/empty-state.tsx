"use client";

import * as React from "react";

import { Button } from "@fe/components/ui/button";
import { cn } from "@fe/lib/utils";

type IconType = React.ComponentType<{ className?: string }>;

/**
 * Standard empty / no-data / error state: icon tile + title + description + CTA.
 *
 * Consumes `ui/Button` for the action — no custom styling (token utilities only).
 */
function EmptyState({
  icon: Icon,
  title,
  description,
  action,
  className,
}: {
  icon?: IconType;
  title: React.ReactNode;
  description?: React.ReactNode;
  action?: {
    label: React.ReactNode;
    onClick?: () => void;
    variant?: React.ComponentProps<typeof Button>["variant"];
  };
  className?: string;
}) {
  return (
    <div
      data-slot="empty-state"
      className={cn("flex flex-col items-center justify-center gap-3 py-16 text-center", className)}
    >
      {Icon ? (
        <div className="flex size-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
          <Icon className="size-6" />
        </div>
      ) : null}
      <div className="space-y-1">
        <h3 className="text-sm font-semibold text-foreground">{title}</h3>
        {description ? (
          <p className="mx-auto max-w-xs text-sm leading-relaxed text-muted-foreground">
            {description}
          </p>
        ) : null}
      </div>
      {action ? (
        <Button size="sm" variant={action.variant ?? "default"} onClick={action.onClick}>
          {action.label}
        </Button>
      ) : null}
    </div>
  );
}

export { EmptyState };
