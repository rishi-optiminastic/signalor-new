import type { LucideIcon } from 'lucide-react'
import type { ReactNode } from 'react'

import { BRAND, BRAND_SOFT } from '@/features/catalyst/constants'

interface AgentPageHeaderProps {
  icon: LucideIcon
  title: string
  subtitle: string
  action?: ReactNode
}

/** Pinned page header shared across the Growth Agent surfaces. */
export function AgentPageHeader({
  icon: Icon,
  title,
  subtitle,
  action,
}: AgentPageHeaderProps): JSX.Element {
  return (
    <div className="cat-rise flex shrink-0 flex-wrap items-center gap-3 border-b border-[var(--cat-border)] pb-4">
      <span
        className="grid h-10 w-10 shrink-0 place-items-center rounded-md"
        style={{ background: BRAND_SOFT }}
      >
        <Icon size={20} style={{ color: BRAND }} />
      </span>
      <div className="min-w-0">
        <h1 className="text-[19px] font-bold tracking-tight text-[var(--cat-ink)]">{title}</h1>
        <p className="text-[13px] text-[var(--cat-ink-2)]">{subtitle}</p>
      </div>
      {action && <div className="ml-auto">{action}</div>}
    </div>
  )
}
