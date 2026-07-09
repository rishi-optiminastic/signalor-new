import { z } from 'zod'

import { apiDelete, apiGet, apiPost } from './client'

function normalizeEmail(email: string): string {
  return email.toLowerCase().trim()
}

export type AgencyRole = 'admin' | 'member'

const agencyRoleSchema = z.object({
  agency_email: z.string().nullable(),
  role: z.enum(['admin', 'member']).nullable(),
})
export type AgencyRoleResponse = z.infer<typeof agencyRoleSchema>

const memberSchema = z.object({
  id: z.number(),
  member_email: z.string(),
  role: z.enum(['admin', 'member']),
  status: z.enum(['invited', 'active']),
})
export type AgencyMember = z.infer<typeof memberSchema>

/** GET /api/agency/role/?email= → the caller's agency + role (nulls if none). */
export async function getAgencyRole(email: string): Promise<AgencyRoleResponse> {
  return agencyRoleSchema.parse(
    await apiGet<unknown>('/api/agency/role/', { params: { email: normalizeEmail(email) } }),
  )
}

/** GET /api/agency/members/?email= → the agency's team (admin only). */
export async function getAgencyMembers(email: string): Promise<AgencyMember[]> {
  return z
    .array(memberSchema)
    .parse(
      await apiGet<unknown>('/api/agency/members/', { params: { email: normalizeEmail(email) } }),
    )
}

/** POST /api/agency/members/invite/ → add a teammate by email (admin only). */
export async function inviteAgencyMember(
  email: string,
  memberEmail: string,
): Promise<AgencyMember> {
  return memberSchema.parse(
    await apiPost<unknown>('/api/agency/members/invite/', {
      email: normalizeEmail(email),
      member_email: normalizeEmail(memberEmail),
    }),
  )
}

/** DELETE /api/agency/members/<id>/ → remove a teammate (admin only). */
export async function removeAgencyMember(email: string, memberId: number): Promise<void> {
  await apiDelete<unknown>(`/api/agency/members/${memberId}/`, { email: normalizeEmail(email) })
}
