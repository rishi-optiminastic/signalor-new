'use client'

import { useEffect, useState } from 'react'

import { BillingHistory } from '@/components/profile/billing-history'
import { PlanBilling } from '@/components/profile/plan-billing'
import { ProfileHeader } from '@/components/profile/profile-header'
import { ProfileTopBar } from '@/components/profile/profile-top-bar'
import { ProjectsList } from '@/components/profile/projects-list'
import { UsageLimits } from '@/components/profile/usage-limits'
import { getAccountOverview, SAMPLE_ACCOUNT } from '@/services/account.service'

export default function ProfilePage(): JSX.Element {
  // Seed with sample data so the page renders instantly (SSR too); refresh from
  // the API in the background once real wiring is enabled.
  const [data, setData] = useState(SAMPLE_ACCOUNT)

  useEffect(() => {
    let active = true
    void getAccountOverview().then(overview => {
      if (active) setData(overview)
    })
    return () => {
      active = false
    }
  }, [])

  return (
    <main className="min-h-svh bg-[#fafafa] font-sans">
      <ProfileTopBar />
      <div className="mx-auto max-w-3xl space-y-5 px-5 py-8">
        <ProfileHeader user={data.user} planLabel={data.plan.label} />
        <UsageLimits usage={data.usage} engines={data.engines} />
        <PlanBilling plan={data.plan} />
        <ProjectsList projects={data.projects} max={data.usage.projects.max} />
        <BillingHistory invoices={data.invoices} />
      </div>
    </main>
  )
}
