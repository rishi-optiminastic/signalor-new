"use client";

import Link from "next/link";
import { useParams, usePathname } from "next/navigation";
import { cn } from "@fe/lib/utils";

/**
 * Tab bar for the Tasks section. The standalone "Blog Agent" sidebar item now
 * lives here as the "Blogs & Articles" tab alongside the recommendations list.
 */
const TASKS_TABS = [
  { label: "Tasks", path: "/recommendations" },
  { label: "Blogs & Articles", path: "/blog-agent" },
];

/** Dashboard-relative route prefixes that should render the Tasks tab bar. */
export const TASKS_ROUTES = ["/recommendations", "/blog-agent"];

export function TasksTabs() {
  const { slug } = useParams<{ slug: string }>();
  const pathname = usePathname();
  const base = `/dashboard/${slug}`;

  return (
    <div className="mb-5 flex items-center gap-1 overflow-x-auto border-b border-border">
      {TASKS_TABS.map((tab) => {
        const href = base + tab.path;
        const active = pathname === href || pathname.startsWith(`${href}/`);
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
