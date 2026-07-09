'use client'

import { useQuery } from '@tanstack/react-query'

import { useActiveProject } from '@/hooks/useActiveProject'
import { getActions } from '@/lib/api/analyzer'

const DONE = new Set(['completed', 'verified'])

/**
 * Number of open (not-done) GEO tasks for the signed-in user, matching the
 * scope of the Tasks board (admin: all agency tasks, member: their assigned,
 * individual: their own). Drives the sidebar badge; 0 hides it.
 */
export function useTaskCount(): number {
  const { email } = useActiveProject()
  const { data } = useQuery({
    queryKey: ['catalyst', 'task-count', email ?? ''],
    enabled: Boolean(email),
    queryFn: async (): Promise<number> => {
      const actions = await getActions(email as string)
      return actions.filter(a => !DONE.has(a.status)).length
    },
  })
  return data ?? 0
}
