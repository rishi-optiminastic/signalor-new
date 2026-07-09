import { z } from 'zod'

import type { AccountType } from '@/stores/useOnboardingStore'

import { apiPost } from './client'

const accountTypeSchema = z.object({
  email: z.string(),
  account_type: z.enum(['individual', 'agency']),
  is_agency: z.boolean().optional(),
})

export type AccountTypeResponse = z.infer<typeof accountTypeSchema>

interface SetAccountTypeExtras {
  /** Agency name — persisted only for agency accounts. */
  agencyName?: string
  /** The person's role/position — persisted only for agency accounts. */
  role?: string
}

/** POST /api/account/type/ → persist the Individual/Agency choice, keyed by email. */
export async function setAccountType(
  email: string,
  accountType: AccountType,
  extras: SetAccountTypeExtras = {},
): Promise<AccountTypeResponse> {
  const data = await apiPost<unknown>('/api/account/type/', {
    email,
    account_type: accountType,
    agency_name: accountType === 'agency' ? (extras.agencyName ?? '') : '',
    role: accountType === 'agency' ? (extras.role ?? '') : '',
  })
  return accountTypeSchema.parse(data)
}

/** The exact phrase the backend requires to confirm a hard account delete. */
export const DELETE_ACCOUNT_CONFIRM = 'delete my account'

/** POST /api/account/delete/ → hard-delete the account + all app data (irreversible). */
export async function deleteAccount(email: string): Promise<void> {
  await apiPost<unknown>('/api/account/delete/', {
    email,
    confirm: DELETE_ACCOUNT_CONFIRM,
  })
}
