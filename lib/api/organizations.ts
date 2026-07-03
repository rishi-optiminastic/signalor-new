import { z } from 'zod'

import { apiGet, apiPost } from './client'

const organizationSchema = z.object({
  id: z.number(),
  name: z.string(),
  url: z.string(),
  owner_email: z.string(),
  created_at: z.string(),
})

export type Organization = z.infer<typeof organizationSchema>

const checkResponseSchema = z.object({ exists: z.boolean() })

export interface OnboardPayload {
  name: string
  url: string
  email: string
}

function normalizeEmail(email: string): string {
  return email.toLowerCase().trim()
}

/** GET /api/organizations/check/?email= → whether an org already exists. */
export async function checkOrganizationExists(email: string): Promise<boolean> {
  const data = await apiGet<unknown>('/api/organizations/check/', {
    params: { email: normalizeEmail(email) },
  })
  return checkResponseSchema.parse(data).exists
}

/** POST /api/organizations/onboard/ → create the org (single-use onboarding token). */
export async function createOrganization(
  payload: OnboardPayload,
  onboardingToken?: string,
): Promise<Organization> {
  const data = await apiPost<unknown>(
    '/api/organizations/onboard/',
    { ...payload, email: normalizeEmail(payload.email) },
    { headers: onboardingToken ? { 'X-Onboarding-Token': onboardingToken } : undefined },
  )
  return organizationSchema.parse(data)
}
