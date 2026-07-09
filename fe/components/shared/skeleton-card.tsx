import * as React from "react";

import { Card, CardContent, CardHeader } from "@fe/components/ui/card";
import { Skeleton } from "@fe/components/ui/skeleton";
import { cn } from "@fe/lib/utils";

/**
 * Loading placeholder that mirrors a standard card. Consumes `ui/Card` chrome
 * and `ui/Skeleton` blocks — no custom styling. Use in place of full-page
 * spinners so the loaded layout matches.
 */
function SkeletonCard({
  lines = 3,
  showHeader = true,
  className,
}: {
  lines?: number;
  showHeader?: boolean;
  className?: string;
}) {
  return (
    <Card data-slot="skeleton-card" className={cn("h-full", className)}>
      {showHeader ? (
        <CardHeader>
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-3 w-48" />
        </CardHeader>
      ) : null}
      <CardContent className="space-y-2">
        {Array.from({ length: lines }).map((_, i) => (
          <Skeleton key={i} className="h-4 w-full" />
        ))}
      </CardContent>
    </Card>
  );
}

export { SkeletonCard };
