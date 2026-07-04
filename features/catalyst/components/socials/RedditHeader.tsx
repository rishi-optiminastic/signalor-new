import { MessageCircle } from 'lucide-react'

import { WARMUP } from '@/features/catalyst/reddit-data'

export function RedditHeader(): JSX.Element {
  return (
    <div className="cat-rise flex shrink-0 flex-wrap items-center gap-3 border-b border-[var(--cat-border)] pb-4">
      <span className="grid h-10 w-10 shrink-0 place-items-center rounded-md bg-[#FF4500] text-white">
        <MessageCircle size={20} strokeWidth={2.2} />
      </span>
      <div className="min-w-0">
        <h1 className="text-[19px] font-bold tracking-tight text-[var(--cat-ink)]">
          Reddit Roadmap
        </h1>
        <p className="text-[13px] text-[var(--cat-ink-2)]">
          A 20-day plan to warm up your account and grow Signalor’s visibility on Reddit.
        </p>
      </div>
      <span className="ml-auto hidden rounded-md border border-[var(--cat-border)] bg-[var(--cat-card)] px-3 py-1.5 text-[13px] font-medium text-[var(--cat-ink-2)] sm:inline-flex">
        {WARMUP.handle}
      </span>
    </div>
  )
}
