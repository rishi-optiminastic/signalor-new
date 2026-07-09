'use client'

import { useQuery } from '@tanstack/react-query'
import { Bot, Globe, MessageSquare, Search, Sparkles } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'

import {
  getAiRecommendationSummary,
  getShareOfVoice,
  getVisibilitySeries,
  type AiRecSummary,
  type SovEngine,
  type VisibilitySeries,
} from '@/lib/api/analyzer'
import { queryKeys } from '@/lib/query-keys'

export interface OverallVis {
  score: number
  delta: string
  positive: boolean
  detected: number
  total: number
}
export interface SovBar {
  name: string
  value: number
}
export interface SovMeta {
  avg: string
  prompts: string
  delta: string
  positive: boolean
}
export interface MentionsVis {
  count: number
  delta: string
  positive: boolean
  platforms: number
  trend: number[]
}
export interface SubStat {
  value: string
  label: string
}
export interface PlatformVis {
  key: string
  icon: LucideIcon
  name: string
  score: number
  delta: string
  positive: boolean
  badge: boolean
  substats: [SubStat, SubStat, SubStat]
}
export interface VisibilityData {
  overall: OverallVis
  sov: SovBar[]
  sovMeta: SovMeta
  mentions: MentionsVis
  platforms: PlatformVis[]
}

const ENGINE_META: Record<string, { label: string; icon: LucideIcon }> = {
  chatgpt: { label: 'ChatGPT', icon: MessageSquare },
  claude: { label: 'Claude', icon: MessageSquare },
  gemini: { label: 'Gemini', icon: Sparkles },
  google: { label: 'Google', icon: Search },
  perplexity: { label: 'Perplexity', icon: Search },
  bing: { label: 'Bing', icon: Globe },
}

function engineLabel(engine: string): string {
  return ENGINE_META[engine]?.label ?? engine.charAt(0).toUpperCase() + engine.slice(1)
}
function engineIcon(engine: string): LucideIcon {
  return ENGINE_META[engine]?.icon ?? Bot
}
function round(n: number): number {
  return Math.round(n)
}

function adapt(sov: SovEngine[], series: VisibilitySeries, summary: AiRecSummary): VisibilityData {
  const detected = sov.filter(e => e.mentioned > 0).length
  const avgSov = sov.length ? sov.reduce((a, e) => a + e.sov_pct, 0) / sov.length : 0
  const positive = series.direction === 'up'

  const overall: OverallVis = {
    score: round(series.current),
    delta: `${Math.abs(series.delta_pct).toFixed(1)}%`,
    positive,
    detected,
    total: sov.length || 6,
  }

  const bars: SovBar[] = sov.map(e => ({ name: engineLabel(e.engine), value: round(e.sov_pct) }))
  const sovMeta: SovMeta = {
    avg: `${round(avgSov)}%`,
    prompts: `${summary.mentioned} / ${summary.total} prompts`,
    delta: `${Math.abs(series.delta_pct).toFixed(1)}%`,
    positive,
  }

  const mentions: MentionsVis = {
    count: summary.mentioned,
    delta: `${round(summary.mention_pct)}%`,
    positive: summary.mention_pct >= 0,
    platforms: summary.per_engine.filter(e => e.mentioned > 0).length,
    trend: summary.per_engine.map(e => e.mentioned),
  }

  const platforms: PlatformVis[] = summary.per_engine.map(e => ({
    key: e.engine,
    icon: engineIcon(e.engine),
    name: engineLabel(e.engine),
    score: round(e.recommendation_pct),
    delta: `${round(e.recommendation_pct)}%`,
    positive: e.recommended > 0,
    badge: true,
    substats: [
      { value: String(e.mentioned), label: 'Mentions' },
      { value: String(e.recommended), label: 'Recommended' },
      { value: String(e.cited), label: 'Cited' },
    ],
  }))

  return { overall, sov: bars, sovMeta, mentions, platforms }
}

/** Fetches + adapts the three visibility endpoints for a run slug. */
export function useVisibility(slug: string | undefined): {
  data: VisibilityData | undefined
  isLoading: boolean
  isError: boolean
} {
  const query = useQuery({
    queryKey: queryKeys.catalyst.visibility(slug ?? ''),
    enabled: Boolean(slug),
    queryFn: async (): Promise<VisibilityData> => {
      const [sov, series, summary] = await Promise.all([
        getShareOfVoice(slug as string),
        getVisibilitySeries(slug as string),
        getAiRecommendationSummary(slug as string),
      ])
      return adapt(sov, series, summary)
    },
  })
  return { data: query.data, isLoading: query.isLoading, isError: query.isError }
}
