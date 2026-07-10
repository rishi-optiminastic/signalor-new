'use client'

import { useQuery } from '@tanstack/react-query'

import { getAccountType } from '@legacy/lib/api/account'
import { useSession } from '@legacy/lib/auth-client'

/**
 * The signed-in user's account type (Individual / Brand vs Agency), read from
 * the backend. Defaults to "individual" while loading or when signed out.
 */
export function useAccountType() {
  const { data: session } = useSession()
  const email = session?.user?.email ?? ''

  const { data } = useQuery({
    queryKey: ['account-type', email],
    queryFn: () => getAccountType(email),
    enabled: !!email,
    staleTime: 5 * 60 * 1000,
  })

  return {
    accountType: data?.account_type ?? 'individual',
    isAgency: data?.account_type === 'agency',
    email,
  }
}
