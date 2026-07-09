"use client";

import Link from "next/link";
import { useParams, usePathname } from "next/navigation";
import { cn } from "@fe/lib/utils";

/**
 * Tab bar for the consolidated Visibility section. Replaces the separate
 * Sitemap / Search Console / Competitors / Prompts sidebar items — they now live
 * as tabs here. Sitemap folds into Search Console (which has its own Sitemaps
 * sub-tab), so it isn't a top-level tab but keeps the Search Console tab active.
 */
const VIS_TABS = [
  { label: "Visibility", path: "/visibility" },
  { label: "Search Console", path: "/search-console", also: ["/sitemap"] },
  { label: "Competitors", path: "/competitors" },
  { label: "Prompts", path: "/prompts" },
];

/** Dashboard-relative route prefixes that should render the Visibility tab bar. */
export const VISIBILITY_ROUTES = [
  "/visibility",
  "/search-console",
  "/competitors",
  "/prompts",
  "/sitemap",
];

export function VisibilityTabs() {
  const { slug } = useParams<{ slug: string }>();
  const pathname = usePathname();
  const base = `/dashboard/${slug}`;

  return (
    <div className="mb-5 flex items-center gap-1 overflow-x-auto border-b border-border">
      {VIS_TABS.map((tab) => {
        const href = base + tab.path;
        const matchPaths = [tab.path, ...(tab.also ?? [])];
        const active = matchPaths.some(
          (p) => pathname === base + p || pathname.startsWith(`${base + p}/`),
        );
        return (
          <Link
            key={tab.path}
            href={href}
            className={cn(
              "relative whitespace-nowrap px-3.5 py-2.5 text-sm font-medium transition-colors",
              active ? "text-primary" : "text-muted-foreground hover:text-foreground",
            )}
          >
            {tab.label}
            {active ? (
              <span className="absolute inset-x-2.5 -bottom-px h-0.5 rounded-full bg-primary" />
            ) : null}
          </Link>
        );
      })}
    </div>
  );
}
