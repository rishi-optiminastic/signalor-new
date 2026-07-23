'use client'

import { useQuery } from '@tanstack/react-query'

import { getBacklinksFree } from '@/lib/api/analyzer'

export interface Opportunity {
  id: number
  name: string
  category: string
  /** 1 = highest priority. */
  priority: number
  /** High / Med / Low impact label derived from priority. */
  impact: 'High impact' | 'Med impact' | 'Low impact'
  rationale: string
  submitUrl: string
  description: string
}

function impactOf(priority: number): Opportunity['impact'] {
  if (priority <= 1) return 'High impact'
  if (priority <= 3) return 'Med impact'
  return 'Low impact'
}

interface UseOpportunitiesResult {
  data: Opportunity[] | undefined
  isLoading: boolean
  isError: boolean
}

/** Engagement opportunities — free citation/backlink placements to pursue. */
export function useOpportunities(slug: string | undefined): UseOpportunitiesResult {
  const query = useQuery({
    queryKey: ['catalyst', 'opportunities', slug ?? ''],
    enabled: Boolean(slug),
    queryFn: async (): Promise<Opportunity[]> => {
      const { rows } = await getBacklinksFree(slug as string)
      return [...rows]
        .sort((a, b) => a.priority - b.priority)
        .map(r => ({
          id: r.id,
          name: r.name,
          category: r.category,
          priority: r.priority,
          impact: impactOf(r.priority),
          rationale: r.rationale,
          submitUrl: r.submit_url,
          description: r.description,
        }))
    },
  })
  return { data: query.data, isLoading: query.isLoading, isError: query.isError }
}
