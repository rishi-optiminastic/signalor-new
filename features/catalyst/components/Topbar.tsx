import { TopbarActions } from '@/features/catalyst/components/TopbarActions'

export function Topbar(): JSX.Element {
  return (
    <div className="flex shrink-0 flex-wrap items-center gap-x-3 gap-y-3 border-b border-[var(--cat-border)] pb-4">
      <div className="flex min-w-0 items-center gap-2.5">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="https://i.pravatar.cc/80?img=12"
          alt=""
          className="h-[42px] w-[42px] shrink-0 rounded-full"
        />
        <div className="min-w-0">
          <div className="truncate text-base font-semibold text-[var(--cat-ink)]">James Brown</div>
          <div className="truncate text-[13px] text-[var(--cat-ink-2)]">
            Welcome back to Catalyst 👋
          </div>
        </div>
      </div>
      <div className="ml-auto">
        <TopbarActions />
      </div>
    </div>
  )
}
