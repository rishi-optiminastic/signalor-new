'use client'

import { useQuery } from '@tanstack/react-query'
import { Bot, Globe, MessageSquare, Search, Sparkles } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'

import { RANGE_DAYS, type Range } from '@/features/catalyst/components/RangeTabs'
import {
  getShareOfVoice,
  getVisibilitySeries,
  type SovEngine,
  type VisibilitySeries,
} from '@/lib/api/analyzer'

const ENGINE_META: Record<string, { label: string; icon: LucideIcon }> = {
  chatgpt: { label: 'ChatGPT', icon: MessageSquare },
  claude: { label: 'Claude', icon: MessageSquare },
  gemini: { label: 'Gemini', icon: Sparkles },
  google: { label: 'Google', icon: Search },
  perplexity: { label: 'Perplexity', icon: Search },
  bing: { label: 'Bing', icon: Globe },
}

export interface EngineShare {
  key: string
  name: string
  icon: LucideIcon
  value: string
  mentions: number
  positive: boolean
}

export interface GeoScore {
  score: number
  delta: string
  positive: boolean
  points: number[]
  engines: EngineShare[]
}

function engineLabel(engine: string): string {
  return ENGINE_META[engine]?.label ?? engine.charAt(0).toUpperCase() + engine.slice(1)
}

function engineIcon(engine: string): LucideIcon {
  return ENGINE_META[engine]?.icon ?? Bot
}

/** Top-3 engines by share of voice, adapted for the card's footer rows. */
function topEngines(sov: SovEngine[]): EngineShare[] {
  return [...sov]
    .sort((a, b) => b.sov_pct - a.sov_pct)
    .slice(0, 3)
    .map(e => ({
      key: e.engine,
      name: engineLabel(e.engine),
      icon: engineIcon(e.engine),
      value: `${Math.round(e.sov_pct)}%`,
      mentions: e.mentioned,
      positive: e.mentioned > 0,
    }))
}

function adapt(series: VisibilitySeries, sov: SovEngine[]): GeoScore {
  return {
    score: Math.round(series.current),
    delta: `${Math.abs(series.delta_pct).toFixed(1)}%`,
    positive: series.direction === 'up',
    points: series.points.map(p => p.score),
    engines: topEngines(sov),
  }
}

interface UseGeoScoreResult {
  data: GeoScore | undefined
  isLoading: boolean
  isError: boolean
}

/** GEO visibility score + trend for a run slug, scoped to the selected range. */
export function useGeoScore(slug: string | undefined, range: Range): UseGeoScoreResult {
  const query = useQuery({
    queryKey: ['catalyst', 'geo-score', slug ?? '', range],
    enabled: Boolean(slug),
    queryFn: async (): Promise<GeoScore> => {
      const [series, sov] = await Promise.all([
        getVisibilitySeries(slug as string, RANGE_DAYS[range]),
        getShareOfVoice(slug as string),
      ])
      return adapt(series, sov)
    },
  })
  return { data: query.data, isLoading: query.isLoading, isError: query.isError }
}
