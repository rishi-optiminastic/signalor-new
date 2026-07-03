import { ChevronDown, Plus, UserRound } from 'lucide-react'

const DROP =
  'inline-flex h-[36px] items-center gap-1.5 rounded-md border border-[var(--cat-border)] bg-[var(--cat-card)] px-3 text-[13px] font-medium text-[var(--cat-ink)] transition-colors hover:bg-[var(--cat-hover)]'

export function TaskToolbarActions(): JSX.Element {
  return (
    <div className="flex items-center gap-2">
      <button className={`${DROP} hidden md:inline-flex`}>
        <UserRound size={15} className="text-[var(--cat-ink-2)]" /> Assignee
        <ChevronDown size={14} className="text-[var(--cat-ink-3)]" />
      </button>
      <button className={`${DROP} hidden sm:inline-flex`}>
        Priority
        <ChevronDown size={14} className="text-[var(--cat-ink-3)]" />
      </button>
      <button className="auth-cta-btn inline-flex h-[36px] shrink-0 items-center gap-2 rounded-md px-3.5 text-[13px] font-semibold text-white">
        <Plus size={16} strokeWidth={2.2} /> Create Task
      </button>
    </div>
  )
}
