'use client'

import { useQuery } from '@tanstack/react-query'

import { RANGE_DAYS, type Range } from '@/features/catalyst/components/RangeTabs'
import { engineLabel } from '@/features/catalyst/engine-logos'
import {
  getShareOfVoice,
  getVisibilitySeries,
  type SovEngine,
  type VisibilitySeries,
} from '@/lib/api/analyzer'
import type { LucideIcon } from '@/lib/icons'
import { Bot, Globe, MessageSquare, Search, Sparkles } from '@/lib/icons'

const ENGINE_ICONS: Record<string, LucideIcon> = {
  chatgpt: MessageSquare,
  claude: MessageSquare,
  gemini: Sparkles,
  google: Search,
  perplexity: Search,
  bing: Globe,
}

export interface EngineShare {
  key: string
  name: string
  icon: LucideIcon
  value: string
  /** Share of voice as a number (0–100), for meters. */
  pct: number
  mentions: number
  positive: boolean
}

export interface GeoScore {
  score: number
  /** Previous analysis's score, for the "why did it change" reason. */
  previous: number
  delta: string
  positive: boolean
  points: number[]
  engines: EngineShare[]
  totalPrompts: number
  totalMentions: number
}

/**
 * A one-line, data-backed explanation of the score movement (up or down) built
 * from the current vs previous score and this period's mention coverage. Deeper
 * pillar-level attribution needs the backend to expose the previous run's pillar
 * scores; this is the honest "why" from data already on the card.
 */
export function scoreReason(d: GeoScore): string {
  const diff = d.score - d.previous
  // Only a genuinely non-zero engine can be "strongest" — never "Strongest on X (0%)".
  const top = d.engines.find(e => e.pct > 0)
  const strongest = top ? ` Strongest on ${top.name} (${top.value}).` : ''
  // Don't claim citations that don't exist: distinguish "cited" from "not cited yet".
  const coverage =
    d.totalMentions > 0
      ? ` Cited in ${d.totalMentions} of ${d.totalPrompts} AI answers.`
      : d.totalPrompts > 0
        ? ` Not cited in any of ${d.totalPrompts} tracked answers yet.`
        : ''
  if (diff === 0) return `No change from ${d.previous} last analysis.${coverage}${strongest}`
  if (diff > 0) return `Up ${diff} from ${d.previous} last analysis.${coverage}${strongest}`
  return `Down ${Math.abs(diff)} from ${d.previous} last analysis.${coverage}${strongest}`
}

function engineIcon(engine: string): LucideIcon {
  return ENGINE_ICONS[engine] ?? Bot
}

/** All engines sorted by share of voice, adapted for card/detail rows. */
function adaptEngines(sov: SovEngine[]): EngineShare[] {
  return [...sov]
    .sort((a, b) => b.sov_pct - a.sov_pct)
    .map(e => ({
      key: e.engine,
      name: engineLabel(e.engine),
      icon: engineIcon(e.engine),
      value: `${Math.round(e.sov_pct)}%`,
      pct: Math.round(e.sov_pct),
      mentions: e.mentioned,
      positive: e.mentioned > 0,
    }))
}

function adapt(series: VisibilitySeries, sov: SovEngine[]): GeoScore {
  return {
    score: Math.round(series.current),
    previous: Math.round(series.previous),
    delta: `${Math.abs(series.delta_pct).toFixed(1)}%`,
    positive: series.direction === 'up',
    points: series.points.map(p => p.score),
    engines: adaptEngines(sov).slice(0, 3),
    totalPrompts: sov.reduce((sum, e) => sum + e.total, 0),
    totalMentions: sov.reduce((sum, e) => sum + e.mentioned, 0),
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

/** Same shape as GeoScore, but with every engine (not just the top 3). */
export type GeoDetail = GeoScore

function adaptDetail(series: VisibilitySeries, sov: SovEngine[]): GeoDetail {
  return {
    ...adapt(series, sov),
    engines: adaptEngines(sov),
  }
}

interface UseGeoDetailResult {
  data: GeoDetail | undefined
  isLoading: boolean
  isError: boolean
}

/** Full GEO breakdown for the details page: trend + every engine's share. */
export function useGeoDetail(slug: string | undefined, range: Range): UseGeoDetailResult {
  const query = useQuery({
    queryKey: ['catalyst', 'geo-detail', slug ?? '', range],
    enabled: Boolean(slug),
    queryFn: async (): Promise<GeoDetail> => {
      const [series, sov] = await Promise.all([
        getVisibilitySeries(slug as string, RANGE_DAYS[range]),
        getShareOfVoice(slug as string),
      ])
      return adaptDetail(series, sov)
    },
  })
  return { data: query.data, isLoading: query.isLoading, isError: query.isError }
}
