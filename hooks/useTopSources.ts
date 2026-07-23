'use client'

import { useQuery } from '@tanstack/react-query'

import { getTopSources } from '@/lib/api/analyzer'

export interface TopSource {
  name: string
  engine: string
  mentions: number
  /** Visibility-impact label: High / Medium / Low. */
  impact: string
  /** Sparkline series (mention trend). */
  spark: number[]
  /** Sentiment 0–100. */
  sentiment: number
}

interface UseTopSourcesResult {
  data: TopSource[] | undefined
  isLoading: boolean
  isError: boolean
}

/** Top AI sources (which engines mention the brand) + sentiment + sparkline. */
export function useTopSources(slug: string | undefined): UseTopSourcesResult {
  const query = useQuery({
    queryKey: ['catalyst', 'top-sources', slug ?? ''],
    enabled: Boolean(slug),
    queryFn: async (): Promise<TopSource[]> => {
      const { sources } = await getTopSources(slug as string)
      return [...sources].sort((a, b) => b.mentions - a.mentions)
    },
  })
  return { data: query.data, isLoading: query.isLoading, isError: query.isError }
}
