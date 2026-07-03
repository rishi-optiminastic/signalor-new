import type { AccountOverview } from '@/services/account.service'

function initials(name: string): string {
  const parts = name.trim().split(/\s+/)
  return (parts[0]?.[0] ?? '') + (parts[1]?.[0] ?? '')
}

interface ProfileHeaderProps {
  user: AccountOverview['user']
  planLabel: string
}

/** Avatar + identity + account-type / plan badges. */
export function ProfileHeader({ user, planLabel }: ProfileHeaderProps): JSX.Element {
  return (
    <section className="shadow-input flex items-center gap-4 rounded-xl border border-neutral-200 bg-white p-5">
      <span className="bg-foreground flex h-14 w-14 shrink-0 items-center justify-center rounded-full text-lg font-semibold text-white uppercase">
        {initials(user.name)}
      </span>
      <div className="min-w-0 flex-1">
        <h1 className="text-foreground truncate text-lg font-semibold tracking-tight">
          {user.name}
        </h1>
        <p className="truncate text-[13px] text-neutral-500">{user.email}</p>
      </div>
      <div className="flex shrink-0 flex-col items-end gap-1.5">
        <span className="bg-primary/10 text-primary rounded-full px-2.5 py-0.5 text-[11px] font-semibold">
          {planLabel} plan
        </span>
        <span className="rounded-full bg-neutral-100 px-2.5 py-0.5 text-[11px] font-medium text-neutral-500 capitalize">
          {user.accountType}
        </span>
      </div>
    </section>
  )
}
