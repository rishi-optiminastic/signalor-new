'use client'

import {
  PromptDateFilter,
  type DateFilter,
} from '@/features/catalyst/components/prompt-tracker/PromptDateFilter'

interface PromptToolbarProps {
  filter: DateFilter
  onFilterChange: (filter: DateFilter) => void
  shown: number
  total: number
}

/** Filter bar: how many prompts are in view + a dynamic date filter (all / day / range). */
export function PromptToolbar({
  filter,
  onFilterChange,
  shown,
  total,
}: PromptToolbarProps): JSX.Element {
  return (
    <div className="cat-rise mb-3 flex items-center justify-between gap-3">
      <span className="text-[12px] font-medium text-[var(--cat-ink-3)]">
        {shown} of {total} prompts
      </span>
      <PromptDateFilter filter={filter} onChange={onFilterChange} />
    </div>
  )
}
