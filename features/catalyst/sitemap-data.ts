import { CheckCircle2, Gauge, Sparkles, Timer } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'

import { GREEN, NEG, YELLOW } from '@/features/catalyst/constants'

/* Amber used for "warn" severity + the AI-readiness bars. */
export const WARN_COLOR = '#C2703D'

/** TTFB latency → semantic hue. */
export function ttfbColor(ms: number): string {
  if (ms < 1000) return GREEN
  if (ms < 2500) return YELLOW
  return NEG
}

/* ----------------------------------------------------------- vitals cards */
export const INDEXED = { value: 36, total: 36, crawlLimit: '36 / 200' }

export interface Vital {
  label: string
  icon: LucideIcon
  value: string | null
  unit: string
  marker: number | null // 0–1 position on the threshold bar; null = no data
  status: string
  valueColor?: string
}

export const VITALS: Vital[] = [
  { label: 'Avg LCP', icon: Timer, value: null, unit: '', marker: null, status: 'No data' },
  { label: 'Avg FCP', icon: Sparkles, value: null, unit: '', marker: null, status: 'No data' },
  {
    label: 'Avg TTFB',
    icon: Gauge,
    value: '724',
    unit: 'ms',
    marker: 0.28,
    status: 'Good',
    valueColor: GREEN,
  },
]

export const INDEXED_ICON: LucideIcon = CheckCircle2

/* ------------------------------------------------------------ audit table */
export interface AuditFilter {
  label: string
  count: number
  active?: boolean
}

export const AUDIT_FILTERS: AuditFilter[] = [
  { label: 'Crawled Pages', count: 36, active: true },
  { label: 'Redirects', count: 0 },
  { label: 'Queued', count: 0 },
  { label: 'Failed', count: 0 },
]

export interface AuditRow {
  path: string
  title: string
  status: number
  words: string
  textRatio: string
  ttfb: string
  ttfbMs: number
  files: string
  size: string
  links: string
  intExt: string
  ai: number
  crawled: string
}

export const AUDIT_ROWS: AuditRow[] = [
  {
    path: '/',
    title: 'Signalor: AI Visibility & GEO Platform for AI Search',
    status: 200,
    words: '1,382 words',
    textRatio: '5% text ratio',
    ttfb: '213ms',
    ttfbMs: 213,
    files: '48 files',
    size: '3KB',
    links: '51 Links',
    intExt: '47 int / 4 ext',
    ai: 94,
    crawled: 'Jul 03',
  },
  {
    path: '/integration/wordpress',
    title: 'WordPress plugin, GEO scoring & schema fixes | Signalor.ai',
    status: 200,
    words: '463 words',
    textRatio: '3% text ratio',
    ttfb: '676ms',
    ttfbMs: 676,
    files: '28 files',
    size: '213KB',
    links: '53 Links',
    intExt: '49 int / 4 ext',
    ai: 94,
    crawled: 'Jul 03',
  },
  {
    path: '/integration/shopify',
    title: 'Shopify integration, GEO scoring for Shopify | Signalor.ai',
    status: 200,
    words: '460 words',
    textRatio: '3% text ratio',
    ttfb: '545ms',
    ttfbMs: 545,
    files: '28 files',
    size: '213KB',
    links: '53 Links',
    intExt: '49 int / 4 ext',
    ai: 94,
    crawled: 'Jul 03',
  },
  {
    path: '/pricing',
    title: 'Pricing, GEO + AEO platform plans | Signalor.ai',
    status: 200,
    words: '211 words',
    textRatio: '3% text ratio',
    ttfb: '249ms',
    ttfbMs: 249,
    files: '27 files',
    size: '3KB',
    links: '20 Links',
    intExt: '20 int / 0 ext',
    ai: 90,
    crawled: 'Jul 03',
  },
  {
    path: '/blog',
    title: 'Blog, GEO playbooks, AI visibility research | Signalor.ai',
    status: 200,
    words: '736 words',
    textRatio: '3% text ratio',
    ttfb: '253ms',
    ttfbMs: 253,
    files: '37 files',
    size: '2.9MB',
    links: '56 Links',
    intExt: '52 int / 4 ext',
    ai: 90,
    crawled: 'Jul 03',
  },
  {
    path: '/prompt-tracking/ai-surfaces',
    title: 'AI surfaces, prompt tracking | Signalor.ai',
    status: 200,
    words: '392 words',
    textRatio: '3% text ratio',
    ttfb: '1.21s',
    ttfbMs: 1210,
    files: '27 files',
    size: '213KB',
    links: '48 Links',
    intExt: '44 int / 4 ext',
    ai: 90,
    crawled: 'Jul 03',
  },
  {
    path: '/prompt-tracking/prompt-library',
    title: 'Prompt library, prompt tracking | Signalor.ai',
    status: 200,
    words: '373 words',
    textRatio: '3% text ratio',
    ttfb: '550ms',
    ttfbMs: 550,
    files: '27 files',
    size: '213KB',
    links: '48 Links',
    intExt: '44 int / 4 ext',
    ai: 90,
    crawled: 'Jul 03',
  },
  {
    path: '/integration',
    title: 'Integrations, Shopify & WordPress | Signalor.ai',
    status: 200,
    words: '657 words',
    textRatio: '4% text ratio',
    ttfb: '602ms',
    ttfbMs: 602,
    files: '29 files',
    size: '213KB',
    links: '54 Links',
    intExt: '50 int / 4 ext',
    ai: 90,
    crawled: 'Jul 03',
  },
  {
    path: '/tools/llms-check',
    title: 'Free llms.txt Checker & LLM Readiness Score | Signalor.ai',
    status: 200,
    words: '546 words',
    textRatio: '4% text ratio',
    ttfb: '763ms',
    ttfbMs: 763,
    files: '28 files',
    size: '213KB',
    links: '53 Links',
    intExt: '49 int / 4 ext',
    ai: 90,
    crawled: 'Jul 03',
  },
]
