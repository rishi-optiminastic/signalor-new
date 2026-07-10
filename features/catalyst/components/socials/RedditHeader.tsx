'use client'

import { RedditIcon } from '@/features/catalyst/components/RedditIcon'
import { useRedditProfile } from '@/features/catalyst/hooks/useRedditProfile'

function Chip({ children }: { children: React.ReactNode }): JSX.Element {
  return (
    <span className="inline-flex items-center rounded-md border border-[var(--cat-border)] bg-[var(--cat-card)] px-2.5 py-1.5 text-[12.5px] font-medium text-[var(--cat-ink-2)]">
      {children}
    </span>
  )
}

export function RedditHeader(): JSX.Element {
  const { username, karma, ageDays } = useRedditProfile()
  const handle = username ? `u/${username}` : 'u/your_account'

  return (
    <div className="cat-rise flex shrink-0 flex-wrap items-center gap-3 border-b border-[var(--cat-border)] pb-4">
      <span className="grid h-10 w-10 shrink-0 place-items-center rounded-md bg-[#FF4500] text-white">
        <RedditIcon size={22} className="text-white" />
      </span>
      <div className="min-w-0">
        <h1 className="text-[19px] font-bold tracking-tight text-[var(--cat-ink)]">
          Reddit Roadmap
        </h1>
        <p className="text-[13px] text-[var(--cat-ink-2)]">
          A 20-day plan to warm up your account and grow Signalor’s visibility on Reddit.
        </p>
      </div>
      <div className="ml-auto hidden items-center gap-1.5 sm:flex">
        <Chip>{handle}</Chip>
        {karma && <Chip>{karma} karma</Chip>}
        {ageDays && <Chip>{ageDays}-day account</Chip>}
      </div>
    </div>
  )
}
