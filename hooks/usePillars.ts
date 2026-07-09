'use client'

import { useQuery } from '@tanstack/react-query'

import { getRunDetail, type PageScore, type RunDetail } from '@/lib/api/analyzer'

/** The six GEO scoring pillars, in the order they render around the radar. */
const PILLARS: { key: keyof PageScore; label: string }[] = [
  { key: 'content_score', label: 'Content' },
  { key: 'schema_score', label: 'Schema' },
  { key: 'eeat_score', label: 'E-E-A-T' },
  { key: 'technical_score', label: 'Technical' },
  { key: 'entity_score', label: 'Entity' },
  { key: 'ai_visibility_score', label: 'AI Visibility' },
]

export interface Pillar {
  label: string
  score: number
}

export interface PillarStats {
  composite: number
  pillars: Pillar[]
  strongest: Pillar | undefined
}

/** The brand's own root page (matches the run url); falls back to the first page. */
function brandPage(detail: RunDetail): PageScore | undefined {
  if (detail.page_scores.length === 0) return undefined
  return detail.page_scores.find(p => p.url === detail.url) ?? detail.page_scores[0]
}

function adapt(detail: RunDetail): PillarStats {
  const page = brandPage(detail)
  const pillars: Pillar[] = PILLARS.map(p => ({
    label: p.label,
    score: Math.round((page?.[p.key] as number | null | undefined) ?? 0),
  }))
  const strongest = [...pillars].sort((a, b) => b.score - a.score)[0]
  return {
    composite: Math.round(detail.composite_score ?? 0),
    pillars,
    strongest,
  }
}

interface UsePillarsResult {
  data: PillarStats | undefined
  isLoading: boolean
  isError: boolean
}

/** Per-pillar GEO scores (Content, Schema, E-E-A-T, Technical, Entity, AI Visibility). */
export function usePillars(slug: string | undefined): UsePillarsResult {
  const query = useQuery({
    queryKey: ['catalyst', 'pillars', slug ?? ''],
    enabled: Boolean(slug),
    queryFn: async (): Promise<PillarStats> => adapt(await getRunDetail(slug as string)),
  })
  return { data: query.data, isLoading: query.isLoading, isError: query.isError }
}
