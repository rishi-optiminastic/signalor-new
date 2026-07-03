'use client'

import { ChevronRight } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

import { BRAND, BRAND_SOFT, BRAND_STRONG } from '@/features/catalyst/constants'

interface NavItemProps {
  icon: LucideIcon
  label: string
  href: string
  badge?: number
}

function Trailing({ active, badge }: { active: boolean; badge?: number }): JSX.Element | null {
  if (active) return <ChevronRight size={15} className="ml-auto text-[var(--cat-ink-3)]" />
  if (badge) {
    return (
      <span
        className="ml-auto grid h-[18px] min-w-[18px] place-items-center rounded px-1 text-[10px] font-semibold text-white"
        style={{ background: BRAND }}
      >
        {badge}
      </span>
    )
  }
  return null
}

export function NavItem({ icon: Icon, label, href, badge }: NavItemProps): JSX.Element {
  const pathname = usePathname()
  const active =
    href !== '#' && (pathname === href || (href !== '/catalyst' && pathname.startsWith(href)))
  const style = active
    ? { background: BRAND_SOFT, color: BRAND_STRONG }
    : { color: 'var(--cat-ink-2)' }

  return (
    <Link
      href={href}
      className="relative flex items-center gap-3 rounded-md px-2.5 py-2 text-[14px] font-medium transition-colors hover:bg-[var(--cat-hover)]"
      style={style}
    >
      {active && (
        <span
          className="absolute top-1/2 h-5 w-[3px] -translate-y-1/2 rounded-r"
          style={{ left: -14, background: BRAND }}
        />
      )}
      <Icon size={18} strokeWidth={1.8} />
      {label}
      <Trailing active={active} badge={badge} />
    </Link>
  )
}
