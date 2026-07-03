import { ChevronDown, UserRound } from 'lucide-react'

import { RELATION_META } from '@/features/catalyst/competitors-data'
import type { Relation } from '@/features/catalyst/competitors-data'

export function RelationPill({ relation }: { relation: Relation }): JSX.Element {
  const meta = RELATION_META[relation]
  if (relation === 'mine') {
    return (
      <span
        className="inline-flex items-center gap-1.5 rounded-md px-2.5 py-1 text-[12px] font-semibold text-white"
        style={{ background: meta.color }}
      >
        <UserRound size={12} /> {meta.label}
      </span>
    )
  }
  return (
    <button
      className="inline-flex items-center gap-1.5 rounded-md border border-[var(--cat-border)] px-2.5 py-1 text-[12px] font-medium transition-colors hover:bg-[var(--cat-hover)]"
      style={{ color: meta.color }}
    >
      {meta.label}
      <ChevronDown size={13} className="text-[var(--cat-ink-3)]" />
    </button>
  )
}
