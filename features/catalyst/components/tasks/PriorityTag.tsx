import { PRIORITY_COLOR } from '@/features/catalyst/tasks-data'
import type { Priority } from '@/features/catalyst/tasks-data'
import { Flag } from '@/lib/icons'

interface PriorityTagProps {
  priority: Priority
}

export function PriorityTag({ priority }: PriorityTagProps): JSX.Element {
  const color = PRIORITY_COLOR[priority]
  return (
    <span className="inline-flex items-center gap-1.5 text-[13px] whitespace-nowrap text-[var(--cat-ink)]">
      <Flag size={14} strokeWidth={1.8} style={{ color, fill: color }} />
      {priority} Priority
    </span>
  )
}
