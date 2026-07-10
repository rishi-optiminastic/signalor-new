'use client'

import {
  useMutation,
  useQuery,
  useQueryClient,
  type UseMutationResult,
  type UseQueryResult,
} from '@tanstack/react-query'

import {
  autoPublishAll,
  getBacklinkSchedule,
  getOurBacklinks,
  setBacklinkSchedule,
  type AutoPublishAllResult,
  type BacklinkSchedule,
  type OurBacklinks,
} from '@/lib/api/backlinks'
import { queryKeys } from '@/lib/query-keys'

/** The published auto-backlinks for a run. Disabled until a slug resolves. */
export function useAutoBacklinks(slug: string | null): UseQueryResult<OurBacklinks> {
  return useQuery<OurBacklinks>({
    queryKey: queryKeys.backlinks.auto(slug ?? ''),
    queryFn: () => getOurBacklinks(slug as string),
    enabled: Boolean(slug),
  })
}

/** The daily auto-backlinks schedule state for a run. */
export function useBacklinkSchedule(slug: string | null): UseQueryResult<BacklinkSchedule> {
  return useQuery<BacklinkSchedule>({
    queryKey: queryKeys.backlinks.schedule(slug ?? ''),
    queryFn: () => getBacklinkSchedule(slug as string),
    enabled: Boolean(slug),
  })
}

/** Toggle the daily schedule, writing the fresh state straight into the cache. */
export function useToggleSchedule(
  slug: string | null,
): UseMutationResult<BacklinkSchedule, Error, boolean> {
  const qc = useQueryClient()
  return useMutation<BacklinkSchedule, Error, boolean>({
    mutationFn: (isActive: boolean) => setBacklinkSchedule(slug as string, isActive),
    onSuccess: next => {
      qc.setQueryData(queryKeys.backlinks.schedule(slug ?? ''), next)
    },
  })
}

/**
 * Generate + publish one blog to each of the five satellite sites right now,
 * then refresh the published list so the new backlinks appear.
 */
export function useAutoPublishAll(
  slug: string | null,
): UseMutationResult<AutoPublishAllResult, Error, void> {
  const qc = useQueryClient()
  return useMutation<AutoPublishAllResult, Error, void>({
    mutationFn: () => autoPublishAll(slug as string),
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: queryKeys.backlinks.auto(slug ?? '') })
    },
  })
}
