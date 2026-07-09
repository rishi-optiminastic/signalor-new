import * as React from "react";

import { cn } from "@fe/lib/utils";

/**
 * Standard page/section header: title + optional description + an actions slot.
 *
 * Composition only — token typography utilities, no custom styling. The `actions`
 * slot is where callers drop `ui/Button`s (kept as a slot because there is no
 * heading primitive to consume).
 */
function PageHeader({
  title,
  description,
  actions,
  className,
}: {
  title: React.ReactNode;
  description?: React.ReactNode;
  actions?: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      data-slot="page-header"
      className={cn("flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between", className)}
    >
      <div className="space-y-1">
        <h1 className="text-xl font-semibold tracking-tight text-foreground sm:text-2xl">
          {title}
        </h1>
        {description ? <p className="text-sm text-muted-foreground">{description}</p> : null}
      </div>
      {actions ? <div className="flex shrink-0 items-center gap-2">{actions}</div> : null}
    </div>
  );
}

export { PageHeader };
