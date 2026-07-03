import { BadgeCheck, ChevronRight } from 'lucide-react'

import { BLUE, CURRENT_USER } from '@/features/catalyst/constants'

export function SidebarUser(): JSX.Element {
  return (
    <div className="mt-3.5 flex items-center gap-2.5 border-t border-[var(--cat-border-soft)] pt-3">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={CURRENT_USER.avatar} alt="" className="h-[34px] w-[34px] rounded-full" />
      <span className="min-w-0 flex-1">
        <div className="flex items-center gap-1 text-[13px] font-semibold text-[var(--cat-ink)]">
          {CURRENT_USER.name}
          <BadgeCheck size={13} style={{ color: BLUE }} />
        </div>
        <div className="text-xs text-[var(--cat-ink-3)]">{CURRENT_USER.email}</div>
      </span>
      <ChevronRight size={16} className="text-[var(--cat-ink-3)]" />
    </div>
  )
}
