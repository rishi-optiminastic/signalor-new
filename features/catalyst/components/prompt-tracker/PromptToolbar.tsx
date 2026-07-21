'use client'

import { ChevronDown } from 'lucide-react'

import { CONTROL_CHIP } from '@/features/catalyst/components/control-styles'
import type { Range } from '@/features/catalyst/components/RangeTabs'

const OPTIONS: { value: Range; label: string }[] = [
  { value: '1D', label: 'Last 24 hours' },
  { value: '1W', label: 'Last 7 days' },
  { value: '1M', label: 'Last 30 days' },
  { value: '3M', label: 'Last 90 days' },
  { value: '1Y', label: 'Last 12 months' },
]

interface PromptToolbarProps {
  range: Range
  onRangeChange: (range: Range) => void
  shown: number
  total: number
}

/** Filter bar: how many prompts are in view + a date-range select (top-bar chip style). */
export function PromptToolbar({
  range,
  onRangeChange,
  shown,
  total,
}: PromptToolbarProps): JSX.Element {
  return (
    <div className="cat-rise mb-3 flex items-center justify-between gap-3">
      <span className="text-[12px] font-medium text-[var(--cat-ink-3)]">
        {shown} of {total} prompts
      </span>
      <div className="relative">
        <select
          aria-label="Date range"
          value={range}
          onChange={e => onRangeChange(e.target.value as Range)}
          className={`${CONTROL_CHIP} appearance-none pr-8`}
        >
          {OPTIONS.map(o => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
        <ChevronDown
          size={14}
          className="pointer-events-none absolute top-1/2 right-2.5 -translate-y-1/2 text-[var(--cat-ink-3)]"
        />
      </div>
    </div>
  )
}
