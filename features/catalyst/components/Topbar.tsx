'use client'

import { TopbarActions } from '@/features/catalyst/components/TopbarActions'
import { useActiveProject } from '@/hooks/useActiveProject'
import { useSession } from '@/lib/auth-client'

function Avatar({ image, initial }: { image?: string; initial: string }): JSX.Element {
  if (image) {
    // eslint-disable-next-line @next/next/no-img-element
    return <img src={image} alt="" className="h-[42px] w-[42px] shrink-0 rounded-full" />
  }
  return (
    <span className="grid h-[42px] w-[42px] shrink-0 place-items-center rounded-full bg-[var(--cat-hover)] text-[15px] font-bold text-[var(--cat-ink)]">
      {initial}
    </span>
  )
}

export function Topbar(): JSX.Element {
  const { data: session } = useSession()
  const { activeOrg } = useActiveProject()

  const user = session?.user
  const name = user?.name || user?.email || 'there'
  const initial = (name[0] ?? '?').toUpperCase()
  const subtitle = activeOrg ? `${activeOrg.name} · Welcome back 👋` : 'Welcome back 👋'

  return (
    <div className="cat-rise flex shrink-0 flex-wrap items-center gap-x-3 gap-y-3 border-b border-[var(--cat-border)] pb-4">
      <div className="flex min-w-0 items-center gap-2.5">
        <Avatar image={user?.image ?? undefined} initial={initial} />
        <div className="min-w-0">
          <div className="truncate text-base font-semibold text-[var(--cat-ink)]">{name}</div>
          <div className="truncate text-[13px] text-[var(--cat-ink-2)]">{subtitle}</div>
        </div>
      </div>
      <div className="ml-auto">
        <TopbarActions />
      </div>
    </div>
  )
}
