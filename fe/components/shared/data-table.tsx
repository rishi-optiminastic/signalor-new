"use client";

import * as React from "react";

import { ChevronDownIcon, ChevronUpIcon } from "@fe/components/icons";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@fe/components/ui/table";
import { Skeleton } from "@fe/components/ui/skeleton";
import { EmptyState } from "./empty-state";
import { cn } from "@fe/lib/utils";

type Align = "left" | "right" | "center";

const ALIGN: Record<Align, string> = {
  left: "text-left",
  right: "text-right",
  center: "text-center",
};

export type DataTableColumn<T> = {
  key: string;
  header: React.ReactNode;
  cell: (row: T) => React.ReactNode;
  align?: Align;
  /** Enable client-side sorting for this column (requires `sortValue`). */
  sortable?: boolean;
  sortValue?: (row: T) => string | number;
};

type EmptyConfig = React.ComponentProps<typeof EmptyState>;

/**
 * Generic data table composed entirely from `ui/Table` primitives, with
 * `ui/Skeleton` loading rows and a `shared/EmptyState` empty state. No custom
 * styling — only token alignment/spacing utilities.
 */
function DataTable<T>({
  columns,
  data,
  getRowKey,
  isLoading = false,
  skeletonRows = 6,
  empty,
  className,
}: {
  columns: DataTableColumn<T>[];
  data: T[];
  getRowKey?: (row: T, index: number) => React.Key;
  isLoading?: boolean;
  skeletonRows?: number;
  empty?: EmptyConfig;
  className?: string;
}) {
  const [sort, setSort] = React.useState<{ key: string; dir: "asc" | "desc" } | null>(null);

  const toggleSort = (key: string) =>
    setSort((prev) =>
      prev?.key === key ? { key, dir: prev.dir === "asc" ? "desc" : "asc" } : { key, dir: "asc" },
    );

  const sorted = React.useMemo(() => {
    if (!sort) return data;
    const col = columns.find((c) => c.key === sort.key);
    if (!col?.sortValue) return data;
    const sortValue = col.sortValue;
    return [...data].sort((a, b) => {
      const av = sortValue(a);
      const bv = sortValue(b);
      if (av < bv) return sort.dir === "asc" ? -1 : 1;
      if (av > bv) return sort.dir === "asc" ? 1 : -1;
      return 0;
    });
  }, [data, sort, columns]);

  if (!isLoading && sorted.length === 0 && empty) {
    return <EmptyState {...empty} />;
  }

  return (
    <Table className={className}>
      <TableHeader>
        <TableRow>
          {columns.map((col) => {
            const align = col.align ?? "left";
            const canSort = Boolean(col.sortable && col.sortValue);
            const ariaSort =
              sort?.key === col.key ? (sort.dir === "asc" ? "ascending" : "descending") : "none";
            return (
              <TableHead
                key={col.key}
                className={ALIGN[align]}
                aria-sort={canSort ? ariaSort : undefined}
              >
                {canSort ? (
                  <button
                    type="button"
                    onClick={() => toggleSort(col.key)}
                    className={cn(
                      "inline-flex items-center gap-1 text-inherit",
                      align === "right" && "flex-row-reverse",
                      align === "center" && "justify-center",
                    )}
                  >
                    {col.header}
                    {sort?.key === col.key ? (
                      sort.dir === "asc" ? (
                        <ChevronUpIcon className="size-3" />
                      ) : (
                        <ChevronDownIcon className="size-3" />
                      )
                    ) : null}
                  </button>
                ) : (
                  col.header
                )}
              </TableHead>
            );
          })}
        </TableRow>
      </TableHeader>
      <TableBody>
        {isLoading
          ? Array.from({ length: skeletonRows }).map((_, r) => (
              <TableRow key={`skeleton-${r}`}>
                {columns.map((col) => (
                  <TableCell key={col.key} className={ALIGN[col.align ?? "left"]}>
                    <Skeleton className={cn("h-4 w-24", col.align === "right" && "ml-auto")} />
                  </TableCell>
                ))}
              </TableRow>
            ))
          : sorted.map((row, index) => (
              <TableRow key={getRowKey ? getRowKey(row, index) : index}>
                {columns.map((col) => (
                  <TableCell
                    key={col.key}
                    className={cn(
                      ALIGN[col.align ?? "left"],
                      col.align === "right" && "tabular-nums",
                    )}
                  >
                    {col.cell(row)}
                  </TableCell>
                ))}
              </TableRow>
            ))}
      </TableBody>
    </Table>
  );
}

export { DataTable };
