'use client'

import { useQuery } from '@tanstack/react-query'
import { Loader2 } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useEffect, type ReactNode } from 'react'

import { getOrganizations } from '@/lib/api/organizations'
import { useSession } from '@/lib/auth-client'
import { queryKeys } from '@/lib/query-keys'
import { routes } from '@/lib/routes'

function GuardSpinner(): JSX.Element {
  return (
    <div className="grid min-h-svh place-items-center bg-white">
      <Loader2 className="h-5 w-5 animate-spin text-neutral-400" />
    </div>
  )
}

/**
 * Sends an authenticated user with no brand/project to onboarding. The dashboard
 * is only meaningful once a brand exists and an analysis has run; signing in with
 * zero projects should resume onboarding (brand → url → connect → launch), not
 * land on an empty dashboard. Only redirects on a confirmed-empty fetch so a
 * transient backend error never bounces a real user out of the dashboard.
 */
export function DashboardProjectGuard({ children }: { children: ReactNode }): JSX.Element {
  const router = useRouter()
  const { data: session, isPending } = useSession()
  const email = session?.user?.email ?? undefined

  const orgsQuery = useQuery({
    queryKey: queryKeys.catalyst.orgs(email ?? ''),
    queryFn: () => getOrganizations(email as string),
    enabled: Boolean(email),
  })

  const noProjects = orgsQuery.isSuccess && orgsQuery.data.length === 0

  useEffect(() => {
    if (noProjects) router.replace(routes.onboarding)
  }, [noProjects, router])

  // Middleware guards auth; if we somehow have no email, defer to the page.
  if (!email) return isPending ? <GuardSpinner /> : <>{children}</>
  // Hold the empty dashboard back until we know a project exists (or we redirect).
  if (orgsQuery.isLoading || noProjects) return <GuardSpinner />
  return <>{children}</>
}
