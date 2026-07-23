'use client'

import { createContext, useContext, useMemo, type ReactNode } from 'react'

import { useActiveProject } from '@/hooks/useActiveProject'
import { useAutoFix, type FixState } from '@/hooks/useAutoFix'
import { useRecommendations } from '@/hooks/useRecommendations'

export interface TaskFix {
  state: FixState
  onFix: () => void
}

interface AutoFixContextValue {
  forTask: (recommendationId: number | undefined) => TaskFix | null
}

const AutoFixContext = createContext<AutoFixContextValue | null>(null)

/**
 * Provides per-task Auto-fix affordances to a deep component tree (the Tasks
 * table) without prop-drilling. It resolves the run's fix platform once and
 * cross-references the run's recommendations so a task can be fixed by its
 * linked recommendation id (only auto-fixable ones get a control).
 */
export function AutoFixProvider({ children }: { children: ReactNode }): JSX.Element {
  const { slug, email, activeOrg } = useActiveProject()
  const autofix = useAutoFix({ slug, email, orgId: activeOrg?.id })
  const { data } = useRecommendations(slug)

  const fixMap = useMemo(() => {
    const map = new Map<number, { findingCode: string; auto: boolean }>()
    data?.recommendations.forEach(r => map.set(r.id, { findingCode: r.findingCode, auto: r.auto }))
    return map
  }, [data])

  const value = useMemo<AutoFixContextValue>(
    () => ({
      forTask: recommendationId => {
        if (!recommendationId) return null
        const info = fixMap.get(recommendationId)
        if (!info || !info.auto) return null
        return {
          state: autofix.stateFor(recommendationId, info.findingCode),
          onFix: () => {
            void autofix.runFix({ id: recommendationId, findingCode: info.findingCode })
          },
        }
      },
    }),
    [fixMap, autofix],
  )

  return <AutoFixContext.Provider value={value}>{children}</AutoFixContext.Provider>
}

/** Fix affordance for a task's linked recommendation, or null when not fixable. */
export function useTaskFix(recommendationId: number | undefined): TaskFix | null {
  const ctx = useContext(AutoFixContext)
  return ctx ? ctx.forTask(recommendationId) : null
}
