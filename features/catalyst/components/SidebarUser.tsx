'use client'

import Link from 'next/link'

import { useSession } from '@/lib/auth-client'
import { ChevronRight } from '@/lib/icons'

function initials(name: string): string {
  const parts = name.trim().split(/\s+/)
  return ((parts[0]?.[0] ?? '') + (parts[1]?.[0] ?? '')).toUpperCase() || 'U'
}

function UserAvatar({ name }: { name: string }): JSX.Element {
  return (
    <span className="grid h-[34px] w-[34px] shrink-0 place-items-center rounded-full bg-[#e04a3d] text-[12px] font-semibold text-white">
      {initials(name)}
    </span>
  )
}

/** Bottom user card — links to the profile page, shows the signed-in user. */
export function SidebarUser({ collapsed }: { collapsed?: boolean }): JSX.Element {
  const { data: session } = useSession()
  const name = session?.user?.name?.trim() || 'Your account'
  const email = session?.user?.email ?? 'Manage profile & billing'

  if (collapsed) {
    return (
      <Link
        href="/profile"
        title={name}
        aria-label={name}
        className="mt-3 flex justify-center border-t border-[var(--cat-border-soft)] pt-3"
      >
        <UserAvatar name={name} />
      </Link>
    )
  }

  return (
    <div className="mt-3.5 border-t border-[var(--cat-border-soft)] pt-2.5">
      <Link
        href="/profile"
        className="group flex items-center gap-2.5 rounded-md p-1.5 transition-colors hover:bg-[var(--cat-hover)] focus-visible:ring-2 focus-visible:ring-[rgba(224,74,61,0.4)] focus-visible:outline-none"
      >
        <UserAvatar name={name} />
        <span className="min-w-0 flex-1">
          <span className="block truncate text-[13px] font-semibold text-[var(--cat-ink)]">
            {name}
          </span>
          <span className="block truncate text-xs text-[var(--cat-ink-3)]">{email}</span>
        </span>
        <ChevronRight
          size={16}
          className="shrink-0 text-[var(--cat-ink-3)] transition-transform duration-200 group-hover:translate-x-0.5"
        />
      </Link>
    </div>
  )
}
