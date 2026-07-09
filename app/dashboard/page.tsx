'use client'

import { Loader2 } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

import { useActiveProject } from '@/hooks/useActiveProject'

/**
 * Bare `/dashboard` has no brand in the URL — resolve the user's default brand
 * (last-viewed via the store, else their first) and redirect to its slug-scoped
 * dashboard. The layout's DashboardProjectGuard already sends brand-less users
 * to onboarding, so by the time this renders a brand exists.
 */
export default function DashboardIndexPage(): JSX.Element {
  const router = useRouter()
  const { orgSlug } = useActiveProject()

  useEffect(() => {
    if (orgSlug) router.replace(`/dashboard/${orgSlug}`)
  }, [orgSlug, router])

  return (
    <div className="grid min-h-svh place-items-center bg-white">
      <Loader2 className="h-5 w-5 animate-spin text-neutral-400" />
    </div>
  )
}
