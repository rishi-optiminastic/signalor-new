'use client'

import { createContext, useContext, useMemo, useState, type ReactNode } from 'react'

import { RANGE_DAYS, type Range } from '@/features/catalyst/components/RangeTabs'

/** Friendly date-range labels shown in the Overview toolbar. */
export const RANGE_LABELS = ['Last 7 days', 'Last month', 'Last 3 months', 'Last year'] as const
export type RangeLabel = (typeof RANGE_LABELS)[number]

/** Toolbar label → the canonical Range the data hooks understand. */
const LABEL_TO_RANGE: Record<RangeLabel, Range> = {
  'Last 7 days': '1W',
  'Last month': '1M',
  'Last 3 months': '3M',
  'Last year': '1Y',
}

/** Engine filter options shown in the toolbar. */
export const ENGINE_LABELS = [
  'All engines',
  'ChatGPT',
  'Claude',
  'Gemini',
  'Google',
  'Perplexity',
] as const
export type EngineLabel = (typeof ENGINE_LABELS)[number]

/** Toolbar engine label → the backend engine key ('all' matches everything). */
const LABEL_TO_ENGINE: Record<EngineLabel, string> = {
  'All engines': 'all',
  ChatGPT: 'chatgpt',
  Claude: 'claude',
  Gemini: 'gemini',
  Google: 'google',
  Perplexity: 'perplexity',
}

interface OverviewFiltersValue {
  /** Friendly label shown in the toolbar. */
  rangeLabel: RangeLabel
  setRangeLabel: (label: RangeLabel) => void
  /** Canonical range the data hooks consume. */
  range: Range
  /** Days of history the selected range maps to. */
  days: number

  /** Friendly engine label shown in the toolbar. */
  engineLabel: EngineLabel
  setEngineLabel: (label: EngineLabel) => void
  /** Backend engine key ('all' = no filter). */
  engineKey: string
}

const OverviewFiltersContext = createContext<OverviewFiltersValue | null>(null)

/**
 * Single source of truth for the Overview's date-range and engine filters. The
 * toolbar writes here; every card reads from here, so changing a dropdown
 * actually re-scopes the dashboard instead of only updating a label.
 */
export function OverviewFiltersProvider({ children }: { children: ReactNode }): JSX.Element {
  const [rangeLabel, setRangeLabel] = useState<RangeLabel>('Last 7 days')
  const [engineLabel, setEngineLabel] = useState<EngineLabel>('All engines')

  const value = useMemo<OverviewFiltersValue>(() => {
    const range = LABEL_TO_RANGE[rangeLabel]
    return {
      rangeLabel,
      setRangeLabel,
      range,
      days: RANGE_DAYS[range],
      engineLabel,
      setEngineLabel,
      engineKey: LABEL_TO_ENGINE[engineLabel],
    }
  }, [rangeLabel, engineLabel])

  return <OverviewFiltersContext.Provider value={value}>{children}</OverviewFiltersContext.Provider>
}

/** Read the Overview filters. Falls back to sensible defaults outside a provider. */
export function useOverviewFilters(): OverviewFiltersValue {
  const ctx = useContext(OverviewFiltersContext)
  if (ctx) return ctx
  // Defensive default so a card rendered outside the provider still works.
  return {
    rangeLabel: 'Last 7 days',
    setRangeLabel: () => {},
    range: '1W',
    days: RANGE_DAYS['1W'],
    engineLabel: 'All engines',
    setEngineLabel: () => {},
    engineKey: 'all',
  }
}
