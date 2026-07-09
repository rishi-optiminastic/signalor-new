'use client'

import { Users2 } from 'lucide-react'

import { NavItem } from '@/features/catalyst/components/NavItem'
import { useAgencyRole } from '@/hooks/useAgencyRole'

const SECTION =
  'mt-4 mb-1.5 px-2 text-[11px] font-semibold tracking-wider text-[var(--cat-ink-3)] uppercase'

/** Agency-admin-only nav: the Team management page. Hidden for everyone else. */
export function AgencyNavSection({ collapsed }: { collapsed: boolean }): JSX.Element | null {
  const { isAdmin } = useAgencyRole()
  if (!isAdmin) return null

  return (
    <>
      {collapsed ? (
        <div className="mx-1 my-2 h-px bg-[var(--cat-border-soft)]" />
      ) : (
        <div className={SECTION}>Agency</div>
      )}
      <nav className="flex flex-col gap-0.5">
        <NavItem icon={Users2} label="Team" href="/dashboard/team" collapsed={collapsed} />
      </nav>
    </>
  )
}
