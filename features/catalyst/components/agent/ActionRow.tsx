'use client'

import { ArrowRight, PenLine, X, Zap } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'

import { CATEGORY_META } from '@/features/catalyst/agent-data'
import type { ActionKind, AgentAction } from '@/features/catalyst/agent-data'
import { CreateTaskButton } from '@/features/catalyst/components/agent/CreateTaskButton'
import { Badge } from '@/features/catalyst/components/Badge'
import { useMounted } from '@/hooks/useMounted'
import { useAgentStore } from '@/stores/useAgentStore'

const KIND_CTA: Record<ActionKind, { label: string; icon: LucideIcon }> = {
  auto: { label: 'Auto', icon: Zap },
  draft: { label: 'Draft', icon: PenLine },
  open: { label: 'Review', icon: ArrowRight },
}

function RowActions({
  action,
  onDismiss,
}: {
  action: AgentAction
  onDismiss: () => void
}): JSX.Element {
  const cta = KIND_CTA[action.kind]
  return (
    <div className="flex w-[132px] shrink-0 items-center justify-end gap-1">
      <CreateTaskButton
        task={{
          id: `agent-${action.id}`,
          title: action.title,
          source: 'Growth Agent',
          category: CATEGORY_META[action.category].label,
        }}
        label={cta.label}
        icon={cta.icon}
        brand={action.kind !== 'open'}
      />
      <button
        type="button"
        onClick={onDismiss}
        aria-label="Dismiss"
        className="grid h-8 w-8 place-items-center rounded-md text-[var(--cat-ink-3)] opacity-0 transition-all group-hover:opacity-100 hover:bg-[var(--cat-card)] hover:text-[var(--cat-ink)]"
      >
        <X size={14} />
      </button>
    </div>
  )
}

export function ActionRow({ action }: { action: AgentAction }): JSX.Element | null {
  const mounted = useMounted()
  const dismissed = useAgentStore(s => s.dismissedIds.includes(action.id))
  const dismiss = useAgentStore(s => s.dismiss)
  if (mounted && dismissed) return null
  const Icon = CATEGORY_META[action.category].icon
  return (
    <div className="group flex items-center gap-3 px-4 py-2.5 transition-colors hover:bg-[var(--cat-hover)]">
      <span className="grid h-8 w-8 shrink-0 place-items-center rounded-md bg-[var(--cat-hover)] text-[var(--cat-ink-2)] group-hover:bg-[var(--cat-card)]">
        <Icon size={16} />
      </span>
      <div className="min-w-0 flex-1">
        <p className="truncate text-[13px] font-medium text-[var(--cat-ink)]">{action.title}</p>
        <p className="mt-0.5 truncate text-[11px] text-[var(--cat-ink-3)]">{action.detail}</p>
      </div>
      <span className="hidden w-[70px] shrink-0 text-right text-[12px] font-medium text-[var(--cat-ink-2)] tabular-nums md:block">
        {action.metric}
      </span>
      <div className="flex w-[52px] shrink-0 justify-end">
        <Badge positive>+{action.points}</Badge>
      </div>
      <span className="hidden w-[56px] shrink-0 text-right text-[11px] text-[var(--cat-ink-3)] lg:block">
        {action.effort}
      </span>
      <RowActions action={action} onDismiss={() => dismiss(action.id)} />
    </div>
  )
}
