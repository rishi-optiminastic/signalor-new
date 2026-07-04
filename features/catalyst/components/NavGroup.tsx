'use client'

import { ChevronDown } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { usePathname } from 'next/navigation'
import { useState } from 'react'

import { NavItem } from '@/features/catalyst/components/NavItem'
import type { NavEntry } from '@/features/catalyst/constants'

interface NavGroupProps {
  icon: LucideIcon
  label: string
  items: NavEntry[]
  collapsed: boolean
}

/** A collapsible parent nav row with indented children (e.g. Socials → Reddit). */
export function NavGroup({ icon: Icon, label, items, collapsed }: NavGroupProps): JSX.Element {
  const pathname = usePathname()
  const childActive = items.some(item => pathname.startsWith(item.href))
  const [open, setOpen] = useState(childActive)

  if (collapsed) {
    return (
      <nav className="flex flex-col gap-0.5">
        {items.map(item => (
          <NavItem key={item.label} {...item} collapsed />
        ))}
      </nav>
    )
  }

  return (
    <div>
      <button
        type="button"
        onClick={() => setOpen(o => !o)}
        className="flex w-full items-center gap-3 rounded-md px-2.5 py-2 text-[14px] font-medium text-[var(--cat-ink-2)] transition-colors hover:bg-[var(--cat-hover)]"
      >
        <Icon size={18} strokeWidth={1.8} className="shrink-0" />
        {label}
        <ChevronDown
          size={15}
          className={`ml-auto text-[var(--cat-ink-3)] transition-transform ${open ? 'rotate-180' : ''}`}
        />
      </button>
      {open && (
        <div className="mt-0.5 ml-[19px] flex flex-col gap-0.5 border-l border-[var(--cat-border-soft)] pl-2">
          {items.map(item => (
            <NavItem key={item.label} {...item} collapsed={false} />
          ))}
        </div>
      )}
    </div>
  )
}
