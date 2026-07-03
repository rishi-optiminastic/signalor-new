'use client'

import { LifeBuoy, Plus, Settings } from 'lucide-react'

import { NavItem } from '@/features/catalyst/components/NavItem'
import { SidebarLogo } from '@/features/catalyst/components/SidebarLogo'
import { SidebarUser } from '@/features/catalyst/components/SidebarUser'
import { ThemeToggle } from '@/features/catalyst/components/ThemeToggle'
import { WorkspaceSwitcher } from '@/features/catalyst/components/WorkspaceSwitcher'
import { CHANNEL_NAV, MAIN_NAV } from '@/features/catalyst/constants'

const SECTION =
  'mt-4 mb-1.5 px-2 text-[11px] font-semibold tracking-wider text-[var(--cat-ink-3)] uppercase'

export function Sidebar(): JSX.Element {
  return (
    <aside className="hidden w-[240px] flex-none flex-col rounded-md border border-[var(--cat-border)] bg-[var(--cat-card)] p-3 shadow-[0_1px_2px_rgba(16,24,40,.05)] lg:flex">
      <SidebarLogo />
      <WorkspaceSwitcher />

      <div className={SECTION}>Main</div>
      <nav className="flex flex-col gap-0.5">
        {MAIN_NAV.map(item => (
          <NavItem key={item.label} {...item} />
        ))}
      </nav>

      <div className={`${SECTION} flex items-center justify-between`}>
        Sales Channels
        <Plus size={15} className="cursor-pointer" />
      </div>
      <nav className="flex flex-col gap-0.5">
        {CHANNEL_NAV.map(item => (
          <NavItem key={item.label} {...item} />
        ))}
      </nav>

      <div className="flex-1" />

      <nav className="flex flex-col gap-0.5">
        <ThemeToggle />
        <NavItem icon={Settings} label="Settings" href="#" />
        <NavItem icon={LifeBuoy} label="Support" href="#" />
      </nav>

      <SidebarUser />
    </aside>
  )
}
