'use client'

import { MembersTable } from '@/features/catalyst/components/brands/MembersTable'

/** Agency-level team management page body (admin invites/removes teammates). */
export function TeamView(): JSX.Element {
  return (
    <div className="mt-3 flex min-h-0 flex-1 flex-col gap-4 overflow-y-auto pr-0.5">
      <div>
        <h1 className="text-[18px] font-semibold text-[var(--cat-ink)]">Team</h1>
        <p className="mt-0.5 text-[13px] text-[var(--cat-ink-3)]">
          Invite up to 2 teammates. Members work on tasks you assign to them across your brands.
        </p>
      </div>
      <div className="max-w-2xl">
        <MembersTable />
      </div>
    </div>
  )
}
