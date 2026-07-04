import { TopbarActions } from '@/features/catalyst/components/TopbarActions'
import { CURRENT_USER } from '@/features/catalyst/constants'

export function Topbar(): JSX.Element {
  return (
    <div className="cat-rise flex shrink-0 flex-wrap items-center gap-x-3 gap-y-3 border-b border-[var(--cat-border)] pb-4">
      <div className="flex min-w-0 items-center gap-2.5">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={CURRENT_USER.avatar} alt="" className="h-[42px] w-[42px] shrink-0 rounded-full" />
        <div className="min-w-0">
          <div className="truncate text-base font-semibold text-[var(--cat-ink)]">
            {CURRENT_USER.name}
          </div>
          <div className="truncate text-[13px] text-[var(--cat-ink-2)]">
            Here&apos;s your AI visibility snapshot 👋
          </div>
        </div>
      </div>
      <div className="ml-auto">
        <TopbarActions />
      </div>
    </div>
  )
}
