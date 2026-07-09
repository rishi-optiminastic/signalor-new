'use client'

import { useQuery } from '@tanstack/react-query'

import {
  getAiRecommendationSummary,
  getShareOfVoice,
  getVisibilitySeries,
  type AiRecSummary,
  type SovEngine,
  type VisibilitySeries,
} from '@/lib/api/analyzer'

/** Deterministic per-engine colour for legends/bars. */
const ENGINE_COLORS: Record<string, string> = {
  chatgpt: '#10A37F',
  claude: '#D97757',
  gemini: '#4285F4',
  google: '#EA4335',
  perplexity: '#20808D',
  bing: '#008373',
}

const ENGINE_LABELS: Record<string, string> = {
  chatgpt: 'ChatGPT',
  claude: 'Claude',
  gemini: 'Gemini',
  google: 'Google',
  perplexity: 'Perplexity',
  bing: 'Bing',
}

export interface OverviewEngine {
  key: string
  name: string
  color: string
  sovPct: number
  recommendationPct: number
  mentioned: number
  total: number
}

export interface OverviewStats {
  total: number
  mentioned: number
  recommended: number
  cited: number
  mentionPct: number
  recommendationPct: number
  citationPct: number
  avgSov: number
  positive: boolean
  seriesPoints: number[]
  engines: OverviewEngine[]
}

function engineLabel(engine: string): string {
  return ENGINE_LABELS[engine] ?? engine.charAt(0).toUpperCase() + engine.slice(1)
}

function toEngines(sov: SovEngine[], summary: AiRecSummary): OverviewEngine[] {
  const recByEngine = new Map(summary.per_engine.map(e => [e.engine, e.recommendation_pct]))
  return [...sov]
    .sort((a, b) => b.sov_pct - a.sov_pct)
    .map(e => ({
      key: e.engine,
      name: engineLabel(e.engine),
      color: ENGINE_COLORS[e.engine] ?? '#e04a3d',
      sovPct: Math.round(e.sov_pct),
      recommendationPct: Math.round(recByEngine.get(e.engine) ?? 0),
      mentioned: e.mentioned,
      total: e.total,
    }))
}

function adapt(summary: AiRecSummary, sov: SovEngine[], series: VisibilitySeries): OverviewStats {
  const avgSov = sov.length ? sov.reduce((a, e) => a + e.sov_pct, 0) / sov.length : 0
  return {
    total: summary.total,
    mentioned: summary.mentioned,
    recommended: summary.recommended,
    cited: summary.cited,
    mentionPct: Math.round(summary.mention_pct),
    recommendationPct: Math.round(summary.recommendation_pct),
    citationPct: Math.round(summary.citation_pct),
    avgSov: Math.round(avgSov),
    positive: series.direction === 'up',
    seriesPoints: series.points.map(p => p.score),
    engines: toEngines(sov, summary),
  }
}

interface UseOverviewResult {
  data: OverviewStats | undefined
  isLoading: boolean
  isError: boolean
}

/** Shared overview rollup (mention/recommend/cite totals + SoV + trend) for a run
 * slug. All overview cards read this one query, so it fetches only once. */
export function useOverview(slug: string | undefined): UseOverviewResult {
  const query = useQuery({
    queryKey: ['catalyst', 'overview', slug ?? ''],
    enabled: Boolean(slug),
    queryFn: async (): Promise<OverviewStats> => {
      const [summary, sov, series] = await Promise.all([
        getAiRecommendationSummary(slug as string),
        getShareOfVoice(slug as string),
        getVisibilitySeries(slug as string),
      ])
      return adapt(summary, sov, series)
    },
  })
  return { data: query.data, isLoading: query.isLoading, isError: query.isError }
}
