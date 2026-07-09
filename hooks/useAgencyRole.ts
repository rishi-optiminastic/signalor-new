'use client'

import { useQuery } from '@tanstack/react-query'

import { getAgencyRole, type AgencyRole } from '@/lib/api/agency'
import { useSession } from '@/lib/auth-client'

export interface AgencyRoleState {
  /** The agency's owner email, or undefined if the user isn't on an agency. */
  agencyEmail: string | undefined
  role: AgencyRole | undefined
  isAdmin: boolean
  isMember: boolean
  /** True when the user belongs to an agency in any role. */
  isAgency: boolean
  isLoading: boolean
}

/** Resolves the signed-in user's agency + access role from the backend. */
export function useAgencyRole(): AgencyRoleState {
  const { data: session } = useSession()
  const email = session?.user?.email ?? undefined

  const query = useQuery({
    queryKey: ['agency', 'role', email ?? ''],
    queryFn: () => getAgencyRole(email as string),
    enabled: Boolean(email),
    staleTime: 60_000,
  })

  const role = query.data?.role ?? undefined
  return {
    agencyEmail: query.data?.agency_email ?? undefined,
    role,
    isAdmin: role === 'admin',
    isMember: role === 'member',
    isAgency: Boolean(role),
    isLoading: query.isLoading,
  }
}
