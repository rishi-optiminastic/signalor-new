import { z } from 'zod'

import { apiClient } from './client'

/** Payload for an Enterprise "Contact Sales" submission. */
export const enterpriseLeadSchema = z.object({
  brand_name: z.string().trim().min(1, 'Brand name is required.'),
  website: z.string().trim().optional().default(''),
  email: z.string().trim().email('Enter a valid email.').optional().or(z.literal('')),
  prompts_required: z.number().int().positive().nullable().optional(),
  brands_count: z.number().int().positive().nullable().optional(),
  current_investment: z.string().trim().optional().default(''),
  support_level: z.string().trim().optional().default(''),
  preferred_currency: z.string().trim().optional().default(''),
  team_size: z.string().trim().optional().default(''),
  ai_engines: z.array(z.string()).optional().default([]),
})

export type EnterpriseLeadPayload = z.infer<typeof enterpriseLeadSchema>

const enterpriseLeadResponseSchema = z.object({
  ok: z.boolean(),
  id: z.number(),
})

export async function submitEnterpriseLead(payload: EnterpriseLeadPayload): Promise<void> {
  const body = enterpriseLeadSchema.parse(payload)
  const { data } = await apiClient.post('/api/enterprise/lead/', body)
  enterpriseLeadResponseSchema.parse(data)
}
