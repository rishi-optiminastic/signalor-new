'use client'

import { useEffect } from 'react'

import { useSession } from '@/lib/auth-client'
import { persistAccountType } from '@/services/onboarding.service'

import { clearPendingAccountType, readPendingAccountType } from './pending-account-type'

/**
 * Persists the stashed Individual/Agency choice once the authenticated session
 * email is available. This is the single reliable persistence point for every
 * sign-up path — the email-OTP step also persists inline, but a Google OAuth
 * redirect skips that step, so without this a Google agency signup would stay
 * Individual (is_agency=false → single-brand cap). Idempotent on the backend.
 */
export function usePersistPendingAccountType(): void {
  const { data: session } = useSession()
  const email = session?.user?.email

  useEffect(() => {
    if (!email) return
    const pending = readPendingAccountType()
    if (!pending) return
    void persistAccountType(email, pending.accountType, {
      agencyName: pending.agencyName,
      role: pending.role,
    }).finally(clearPendingAccountType)
  }, [email])
}
