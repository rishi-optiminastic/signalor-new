import Link from "next/link";
import { cn } from "@fe/lib/utils";

export type Crumb = { name: string; href?: string };

/**
 * Visible breadcrumb trail. Pair with breadcrumbJsonLd() (which drives the SERP
 * breadcrumb rich result) — this renders the human-visible, crawlable version.
 * The last item is treated as the current page (no link).
 */
export function Breadcrumbs({ items, className }: { items: Crumb[]; className?: string }) {
  return (
    <nav aria-label="Breadcrumb" className={className}>
      <ol className="flex flex-wrap items-center gap-1.5 text-sm font-medium text-muted-foreground">
        {items.map((item, index) => {
          const isLast = index === items.length - 1;
          return (
            <li key={item.name} className="flex items-center gap-1.5">
              {item.href && !isLast ? (
                <Link href={item.href} className="transition-colors hover:text-foreground">
                  {item.name}
                </Link>
              ) : (
                <span
                  aria-current={isLast ? "page" : undefined}
                  className={cn(isLast && "text-foreground")}
                >
                  {item.name}
                </span>
              )}
              {!isLast && (
                <span aria-hidden className="text-muted-foreground/50">
                  /
                </span>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
