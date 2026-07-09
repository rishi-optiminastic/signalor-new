'use client'

import { Share2, Sparkles, X } from 'lucide-react'

import { AgencyNavSection } from '@/features/catalyst/components/AgencyNavSection'
import { NavGroup } from '@/features/catalyst/components/NavGroup'
import { NavItem } from '@/features/catalyst/components/NavItem'
import { SidebarLogo } from '@/features/catalyst/components/SidebarLogo'
import { SidebarUser } from '@/features/catalyst/components/SidebarUser'
import { WorkspaceSwitcher } from '@/features/catalyst/components/WorkspaceSwitcher'
import {
  MAIN_NAV,
  MONITORING_NAV,
  OPTIMIZATION_NAV,
  SOCIALS_NAV,
  type NavEntry,
} from '@/features/catalyst/constants'
import { useTaskCount } from '@/hooks/useTaskCount'

const SECTION =
  'mt-4 mb-1.5 px-2 text-[11px] font-semibold tracking-wider text-[var(--cat-ink-3)] uppercase'

function NavSection({
  title,
  items,
  collapsed,
}: {
  title: string
  items: NavEntry[]
  collapsed: boolean
}): JSX.Element {
  return (
    <>
      {collapsed ? (
        <div className="mx-1 my-2 h-px bg-[var(--cat-border-soft)]" />
      ) : (
        <div className={SECTION}>{title}</div>
      )}
      <nav className="flex flex-col gap-0.5">
        {items.map(item => (
          <NavItem key={item.label} {...item} collapsed={collapsed} />
        ))}
      </nav>
    </>
  )
}

interface SidebarContentProps {
  collapsed: boolean
  onClose?: () => void
}

/** The full inner sidebar — shared by the desktop rail and the mobile drawer. */
export function SidebarContent({ collapsed, onClose }: SidebarContentProps): JSX.Element {
  const taskCount = useTaskCount()
  // Real open-task count on the Tasks item (hidden when 0), not a hardcoded badge.
  const optimizationNav = OPTIMIZATION_NAV.map(item =>
    item.href === 'tasks' ? { ...item, badge: taskCount || undefined } : item,
  )
  return (
    <>
      <div className="flex items-center pb-0.5">
        <SidebarLogo collapsed={collapsed} />
        {onClose && (
          <button
            type="button"
            onClick={onClose}
            aria-label="Close menu"
            className="ml-auto grid h-7 w-7 place-items-center rounded-md text-[var(--cat-ink-3)] transition-colors hover:bg-[var(--cat-hover)] hover:text-[var(--cat-ink)] lg:hidden"
          >
            <X size={16} />
          </button>
        )}
      </div>
      <WorkspaceSwitcher collapsed={collapsed} />

      <div className="mt-1 -mr-1 flex min-h-0 flex-1 flex-col overflow-x-hidden overflow-y-auto pr-1">
        <NavSection title="Main" items={MAIN_NAV} collapsed={collapsed} />
        {collapsed && <div className="mx-1 my-2 h-px bg-[var(--cat-border-soft)]" />}
        <div className={collapsed ? '' : 'mt-1'}>
          <NavItem icon={Sparkles} label="Growth Agent" href="agent" collapsed={collapsed} />
        </div>
        <NavSection title="Monitoring" items={MONITORING_NAV} collapsed={collapsed} />
        <NavSection title="Optimization" items={optimizationNav} collapsed={collapsed} />
        <AgencyNavSection collapsed={collapsed} />
        {collapsed && <div className="mx-1 my-2 h-px bg-[var(--cat-border-soft)]" />}
        <div className={collapsed ? '' : 'mt-1'}>
          <NavGroup icon={Share2} label="Socials" items={SOCIALS_NAV} collapsed={collapsed} />
        </div>
      </div>

      <SidebarUser collapsed={collapsed} />
    </>
  )
}
