import { Loader2 } from 'lucide-react'
import type { ReactNode } from 'react'

interface DataStateProps {
  isLoading: boolean
  isError?: boolean
  isEmpty?: boolean
  emptyTitle?: string
  emptyHint?: string
  children: ReactNode
}

function Centered({ children }: { children: ReactNode }): JSX.Element {
  return (
    <div className="flex min-h-[200px] flex-1 flex-col items-center justify-center gap-2 text-center">
      {children}
    </div>
  )
}

/**
 * Shared loading / error / empty wrapper for catalyst pages. Renders `children`
 * only when data is present — replacing the old hardcoded fallbacks.
 */
export function DataState({
  isLoading,
  isError,
  isEmpty,
  emptyTitle = 'No data yet',
  emptyHint = 'Run an analysis for this project to populate this page.',
  children,
}: DataStateProps): JSX.Element {
  if (isLoading) {
    return (
      <Centered>
        <Loader2 className="h-5 w-5 animate-spin text-[var(--cat-ink-3)]" />
        <p className="text-[13px] text-[var(--cat-ink-3)]">Loading…</p>
      </Centered>
    )
  }
  if (isError) {
    return (
      <Centered>
        <p className="text-[13px] font-medium text-[var(--cat-ink)]">Couldn’t load data</p>
        <p className="max-w-sm text-[12px] text-[var(--cat-ink-3)]">
          The backend didn’t respond. Check that the analysis API is reachable and try again.
        </p>
      </Centered>
    )
  }
  if (isEmpty) {
    return (
      <Centered>
        <p className="text-[13px] font-medium text-[var(--cat-ink)]">{emptyTitle}</p>
        <p className="max-w-sm text-[12px] text-[var(--cat-ink-3)]">{emptyHint}</p>
      </Centered>
    )
  }
  return <>{children}</>
}
