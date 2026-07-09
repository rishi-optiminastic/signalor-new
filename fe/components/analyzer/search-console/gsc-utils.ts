/**
 * Shared helpers for the Search Console–style page.
 *
 * This feature is a *replica* of Google Search Console built entirely from
 * Signalor's own crawl data (the sitemap audit) plus domain-analytics / rank
 * data — there is no Google integration. These helpers translate the analyzer's
 * raw per-page fields into the familiar GSC vocabulary (coverage states, the
 * "URL is / isn't on Google" verdict, etc).
 */
import type { SitemapAuditPage } from "@fe/lib/api/analyzer";

// ─── Coverage buckets ───────────────────────────────────────────────────────

export type CoverageBucket = "indexed" | "excluded_noindex" | "redirect" | "error" | "discovered";

export const COVERAGE_LABEL: Record<CoverageBucket, string> = {
  indexed: "Indexed",
  excluded_noindex: "Excluded by 'noindex'",
  redirect: "Page with redirect",
  error: "Not found / error",
  discovered: "Discovered – not crawled",
};

/** Hex colours for the donut + legend, keyed by bucket. */
export const COVERAGE_COLOR: Record<CoverageBucket, string> = {
  indexed: "#16a34a", // green-600
  excluded_noindex: "#f59e0b", // amber-500
  redirect: "#3b82f6", // blue-500
  error: "#ef4444", // red-500
  discovered: "#94a3b8", // slate-400
};

/** Classify a single crawled page into a GSC-style coverage bucket. */
export function coverageBucket(page: SitemapAuditPage): CoverageBucket {
  if (page.state === "redirect") return "redirect";
  if (page.state === "queued") return "discovered";
  if (page.state === "failed" || page.status_code >= 400) return "error";
  // state === "crawled" with a 2xx/3xx-ish status
  if (page.is_noindex) return "excluded_noindex";
  return "indexed";
}

// ─── URL inspection verdict ─────────────────────────────────────────────────

export type Verdict = { onGoogle: boolean; label: string; reason: string };

/**
 * GSC-style verdict for a single inspected URL, derived from crawl signals.
 * "On Google" means: successfully crawled, 2xx, and not blocked by noindex.
 */
export function inspectionVerdict(page: SitemapAuditPage): Verdict {
  if (page.state === "failed" || page.status_code >= 400) {
    return {
      onGoogle: false,
      label: "URL is not on Google",
      reason: `Crawl failed${page.status_code ? ` (HTTP ${page.status_code})` : ""}.`,
    };
  }
  if (page.state === "redirect") {
    return {
      onGoogle: false,
      label: "URL is not on Google",
      reason: `Page redirects${page.final_url ? ` to ${page.final_url}` : ""}.`,
    };
  }
  if (page.state === "queued") {
    return {
      onGoogle: false,
      label: "URL is not on Google",
      reason: "Discovered in the sitemap but not yet crawled.",
    };
  }
  if (page.is_noindex) {
    return {
      onGoogle: false,
      label: "URL is not on Google",
      reason: "Page is excluded by a 'noindex' directive.",
    };
  }
  return {
    onGoogle: true,
    label: "URL is on Google",
    reason: "Page was crawled successfully and is indexable.",
  };
}

// ─── Formatting ─────────────────────────────────────────────────────────────

/** Compact integer (1.2K, 3.4M). */
export function fmtNum(n: number | null | undefined): string {
  if (n == null || Number.isNaN(n)) return "—";
  if (Math.abs(n) >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (Math.abs(n) >= 1_000) return `${(n / 1_000).toFixed(1)}K`;
  return String(Math.round(n));
}

export function fmtMs(ms: number | null | undefined): string {
  if (ms == null || Number.isNaN(ms)) return "—";
  if (ms >= 1000) return `${(ms / 1000).toFixed(2)}s`;
  return `${Math.round(ms)}ms`;
}

export function fmtPct(ratio: number | null | undefined, digits = 1): string {
  if (ratio == null || Number.isNaN(ratio)) return "—";
  return `${(ratio * 100).toFixed(digits)}%`;
}

/** Format an ISO timestamp as a stable en-US date (avoids SSR hydration drift). */
export function fmtDate(iso: string | null | undefined): string {
  if (!iso) return "—";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "—";
  return d.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    timeZone: "UTC",
  });
}

/** Strip scheme + trailing slash for a tidy display path. */
export function prettyUrl(url: string): string {
  return url.replace(/^https?:\/\//, "").replace(/\/$/, "");
}
