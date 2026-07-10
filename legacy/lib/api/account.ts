import { z } from 'zod'

import { apiClient } from './client'

/**
 * Individual (Brand) vs Agency account type. Persisted server-side, keyed by
 * email (mirrors the email-centric payments/profile endpoints). The backend
 * always re-derives the type from its own record for enforcement — this client
 * only reads/sets the user's own choice.
 */
export type AccountType = 'individual' | 'agency'

const accountTypeSchema = z.object({
  email: z.string(),
  account_type: z.enum(['individual', 'agency']),
  is_agency: z.boolean().optional(),
  agency_name: z.string().optional().default(''),
  role: z.string().optional().default(''),
})

export type AccountTypeResponse = z.infer<typeof accountTypeSchema>

export async function getAccountType(email: string): Promise<AccountTypeResponse> {
  const { data } = await apiClient.get('/api/account/type/', { params: { email } })
  return accountTypeSchema.parse(data)
}

export async function setAccountType(
  email: string,
  accountType: AccountType,
  agencyName?: string,
  role?: string,
): Promise<AccountTypeResponse> {
  const { data } = await apiClient.post('/api/account/type/', {
    email,
    account_type: accountType,
    // agency_name/role are only meaningful for agencies; backend ignores them otherwise.
    ...(agencyName ? { agency_name: agencyName } : {}),
    ...(role ? { role } : {}),
  })
  return accountTypeSchema.parse(data)
}
