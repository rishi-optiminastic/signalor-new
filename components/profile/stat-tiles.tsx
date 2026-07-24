import { Activity, FolderKanban, MessageSquare } from '@/lib/icons'
import type { AccountOverview } from '@/services/account.service'

import { TickBar } from './tick-bar'

interface StatTileProps {
  label: string
  value: number
  max?: number
  Icon: typeof Activity
}

function StatTile({ label, value, max, Icon }: StatTileProps): JSX.Element {
  const pct = max ? Math.min(100, Math.round((value / max) * 100)) : null
  return (
    <div className="rounded-xl border border-[var(--cat-border)] bg-[var(--cat-card)] p-4 shadow-[0_1px_2px_rgba(16,24,40,.04)]">
      <div className="flex items-center justify-between">
        <span className="text-xs font-medium text-[var(--cat-ink-2)]">{label}</span>
        <span className="flex h-7 w-7 items-center justify-center rounded-md bg-[var(--cat-hover)] text-[var(--cat-ink-2)]">
          <Icon size={15} strokeWidth={1.8} />
        </span>
      </div>
      <div className="mt-3 flex items-baseline gap-1.5">
        <span className="text-2xl font-semibold tracking-tight text-[var(--cat-ink)] tabular-nums">
          {value}
        </span>
        {max !== undefined && <span className="text-xs text-[var(--cat-ink-3)]">/ {max}</span>}
      </div>
      {pct !== null && (
        <div className="mt-3.5 flex items-center gap-2.5">
          <TickBar value={pct} />
          <span className="text-[11px] font-medium text-[var(--cat-ink-3)] tabular-nums">
            {pct}%
          </span>
        </div>
      )}
    </div>
  )
}

/** Key usage metrics as a row of stat tiles. */
export function StatTiles({ usage }: { usage: AccountOverview['usage'] }): JSX.Element {
  return (
    <div className="grid gap-4 sm:grid-cols-3">
      <StatTile
        label="Projects"
        value={usage.projects.used}
        max={usage.projects.max}
        Icon={FolderKanban}
      />
      <StatTile
        label="Tracked prompts"
        value={usage.prompts.used}
        max={usage.prompts.max}
        Icon={MessageSquare}
      />
      <StatTile label="Runs this month" value={usage.runsThisMonth} Icon={Activity} />
    </div>
  )
}
