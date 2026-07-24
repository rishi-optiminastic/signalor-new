import type { ReactNode } from 'react'

import { MoreHorizontal } from '@/lib/icons'
import type { LucideIcon } from '@/lib/icons'

interface VisCardHeadProps {
  icon: LucideIcon
  title: string
  iconColor?: string
  trailing?: ReactNode
}

export function VisCardHead({
  icon: Icon,
  title,
  iconColor,
  trailing,
}: VisCardHeadProps): JSX.Element {
  return (
    <div className="flex items-center justify-between">
      <span className="flex items-center gap-2 text-[13px] font-semibold text-[var(--cat-ink)]">
        <Icon size={15} style={{ color: iconColor ?? 'var(--cat-ink-2)' }} />
        {title}
      </span>
      <span className="flex items-center gap-2">
        {trailing}
        <MoreHorizontal size={16} className="text-[var(--cat-ink-3)]" />
      </span>
    </div>
  )
}
