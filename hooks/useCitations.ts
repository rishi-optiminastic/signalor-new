'use client'

import { useQuery } from '@tanstack/react-query'

import { getCitations } from '@/lib/api/analyzer'

export interface CitationDomain {
  domain: string
  total: number
  isBrand: boolean
  isCompetitor: boolean
  url: string
}

export interface CitationStats {
  total: number
  brand: number
  competitor: number
  other: number
  brandPct: number
  domains: CitationDomain[]
}

interface UseCitationsResult {
  data: CitationStats | undefined
  isLoading: boolean
  isError: boolean
}

/** Citation totals (brand vs competitor vs other) + top domains for a run slug. */
export function useCitations(slug: string | undefined): UseCitationsResult {
  const query = useQuery({
    queryKey: ['catalyst', 'citations', slug ?? ''],
    enabled: Boolean(slug),
    queryFn: async (): Promise<CitationStats> => {
      const c = await getCitations(slug as string)
      const other = Math.max(c.total_citations - c.brand_citations - c.competitor_citations, 0)
      return {
        total: c.total_citations,
        brand: c.brand_citations,
        competitor: c.competitor_citations,
        other,
        brandPct:
          c.total_citations > 0 ? Math.round((c.brand_citations / c.total_citations) * 100) : 0,
        domains: c.domains.map(d => ({
          domain: d.domain,
          total: d.total,
          isBrand: d.is_brand,
          isCompetitor: d.is_competitor,
          url: d.sample_url,
        })),
      }
    },
  })
  return { data: query.data, isLoading: query.isLoading, isError: query.isError }
}
