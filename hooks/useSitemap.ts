'use client'

import { useQuery } from '@tanstack/react-query'
import { Gauge, Sparkles, Timer } from 'lucide-react'

import { GREEN, NEG, YELLOW } from '@/features/catalyst/constants'
import type { AuditFilter, AuditRow, Vital } from '@/features/catalyst/sitemap-data'
import { getSitemap, type SitemapAudit, type SitemapPage } from '@/lib/api/analyzer'

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

function formatMs(ms: number | null | undefined): string {
  if (ms === null || ms === undefined) return '—'
  return ms >= 1000 ? `${(ms / 1000).toFixed(2)}s` : `${Math.round(ms)}ms`
}

function formatBytes(bytes: number): string {
  if (bytes >= 1_000_000) return `${(bytes / 1_000_000).toFixed(1)}MB`
  if (bytes >= 1000) return `${Math.round(bytes / 1000)}KB`
  return `${bytes}B`
}

function formatDate(iso: string | null | undefined): string {
  if (!iso) return '—'
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return '—'
  return `${MONTHS[d.getUTCMonth()]} ${String(d.getUTCDate()).padStart(2, '0')}`
}

/** LCP/FCP/TTFB → 0–1 marker on the threshold bar (good < ~1s). */
function latencyMarker(ms: number | null | undefined): number | null {
  if (ms === null || ms === undefined) return null
  return Math.max(0.02, Math.min(1, ms / 4000))
}

function latencyStatus(ms: number | null | undefined): { status: string; color: string } {
  if (ms === null || ms === undefined) return { status: 'No data', color: '' }
  if (ms < 1000) return { status: 'Good', color: GREEN }
  if (ms < 2500) return { status: 'Fair', color: YELLOW }
  return { status: 'Poor', color: NEG }
}

function toVital(label: string, icon: Vital['icon'], ms: number | null | undefined): Vital {
  const { status, color } = latencyStatus(ms)
  const hasData = ms !== null && ms !== undefined
  return {
    label,
    icon,
    value: hasData ? String(Math.round(ms)) : null,
    unit: hasData ? 'ms' : '',
    marker: latencyMarker(ms),
    status,
    valueColor: color || undefined,
  }
}

function toRow(page: SitemapPage): AuditRow {
  const isWarn = ['warn', 'warning', 'critical', 'error'].includes(page.severity.toLowerCase())
  return {
    path: page.path || '/',
    title: page.title,
    status: page.status_code,
    words: `${page.word_count.toLocaleString('en-US')} words`,
    textRatio: `${Math.round(page.text_ratio * 100)}% text ratio`,
    ttfb: formatMs(page.ttfb_ms),
    ttfbMs: page.ttfb_ms ?? 0,
    files: `${page.resource_count} files`,
    size: formatBytes(page.resource_bytes),
    links: `${page.link_count_total} Links`,
    intExt: `${page.link_count_internal} int / ${page.link_count_external} ext`,
    ai: Math.round(page.ai_score ?? 0),
    crawled: formatDate(page.checked_at),
    warn: isWarn,
  }
}

function buildFilters(audit: SitemapAudit): AuditFilter[] {
  return [
    { label: 'Crawled Pages', count: audit.indexed_count, active: true },
    { label: 'Redirects', count: audit.redirect_count },
    { label: 'Queued', count: audit.queued_count },
    { label: 'Failed', count: audit.failed_count },
  ]
}

export interface SitemapData {
  sitemapUrl: string
  indexed: { value: number; total: number; crawlLimit: string }
  vitals: Vital[]
  filters: AuditFilter[]
  rows: AuditRow[]
}

function adapt(audit: SitemapAudit, pages: SitemapPage[]): SitemapData {
  return {
    sitemapUrl: audit.sitemap_url,
    indexed: {
      value: audit.indexed_count,
      total: audit.total_urls,
      crawlLimit: `${audit.total_urls} / ${audit.crawl_limit}`,
    },
    vitals: [
      toVital('Avg LCP', Timer, audit.avg_lcp_ms),
      toVital('Avg FCP', Sparkles, audit.avg_fcp_ms),
      toVital('Avg TTFB', Gauge, audit.avg_ttfb_ms),
    ],
    filters: buildFilters(audit),
    rows: pages.map(toRow),
  }
}

interface UseSitemapResult {
  data: SitemapData | undefined
  isLoading: boolean
  isError: boolean
}

/** Fetches the sitemap crawl audit for a run slug and adapts it to the UI shapes. */
export function useSitemap(slug: string | undefined): UseSitemapResult {
  const query = useQuery({
    queryKey: queryKeysSitemap(slug),
    enabled: Boolean(slug),
    queryFn: async (): Promise<SitemapData | null> => {
      const res = await getSitemap(slug as string)
      return res.audit ? adapt(res.audit, res.pages) : null
    },
  })
  return {
    data: query.data ?? undefined,
    isLoading: query.isLoading,
    isError: query.isError,
  }
}

function queryKeysSitemap(slug: string | undefined): readonly unknown[] {
  return ['catalyst', 'sitemap', slug ?? '']
}
