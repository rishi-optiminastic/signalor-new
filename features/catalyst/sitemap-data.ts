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

export interface Vital {
  label: string
  icon: LucideIcon
  value: string | null
  unit: string
  marker: number | null // 0–1 position on the threshold bar; null = no data
  status: string
  valueColor?: string
}

export interface AuditFilter {
  label: string
  count: number
  active?: boolean
}

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
  warn: boolean
}
