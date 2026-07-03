import { z } from 'zod'

import type { AccountType } from '@/stores/useOnboardingStore'

import { apiPost } from './client'

const accountTypeSchema = z.object({
  email: z.string(),
  account_type: z.enum(['individual', 'agency']),
  is_agency: z.boolean().optional(),
})

export type AccountTypeResponse = z.infer<typeof accountTypeSchema>

/** POST /api/account/type/ → persist the Individual/Agency choice, keyed by email. */
export async function setAccountType(
  email: string,
  accountType: AccountType,
): Promise<AccountTypeResponse> {
  const data = await apiPost<unknown>('/api/account/type/', {
    email,
    account_type: accountType,
  })
  return accountTypeSchema.parse(data)
}
