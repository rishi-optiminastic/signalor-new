import { headers } from 'next/headers'

import { BillingHistory } from '@/components/profile/billing-history'
import { DangerZone } from '@/components/profile/danger-zone'
import { EnginesCard } from '@/components/profile/engines-card'
import { PlanBilling } from '@/components/profile/plan-billing'
import { ProfileHeader } from '@/components/profile/profile-header'
import { ProfileTopBar } from '@/components/profile/profile-top-bar'
import { ProjectsList } from '@/components/profile/projects-list'
import { StatTiles } from '@/components/profile/stat-tiles'
import { CatalystThemeProvider } from '@/features/catalyst/components/CatalystThemeProvider'
import { auth } from '@/lib/auth'
import { loadAccountOverview, SAMPLE_ACCOUNT } from '@/services/account.service'

// Per-request data (session + backend), so never statically cached.
export const dynamic = 'force-dynamic'

export default async function ProfilePage(): Promise<JSX.Element> {
  const session = await auth.api.getSession({ headers: await headers() }).catch(() => null)
  const email = session?.user?.email

  const data = email
    ? await loadAccountOverview(email, session?.user?.name).catch(() => SAMPLE_ACCOUNT)
    : SAMPLE_ACCOUNT

  return (
    <CatalystThemeProvider>
      <main className="min-h-svh bg-[var(--cat-canvas)] font-sans">
        <ProfileTopBar />
        <div className="mx-auto max-w-5xl space-y-5 px-5 py-8">
          <ProfileHeader user={data.user} planLabel={data.plan.label} />
          <StatTiles usage={data.usage} />
          <div className="grid gap-5 lg:grid-cols-2">
            <div className="space-y-5">
              <PlanBilling plan={data.plan} />
              <BillingHistory invoices={data.invoices} />
            </div>
            <div className="space-y-5">
              <ProjectsList projects={data.projects} max={data.usage.projects.max} />
              <EnginesCard engines={data.engines} />
            </div>
          </div>
          <DangerZone email={data.user.email} />
        </div>
      </main>
    </CatalystThemeProvider>
  )
}
