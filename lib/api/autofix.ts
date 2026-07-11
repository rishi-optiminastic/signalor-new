import { z } from 'zod'

import { apiGet, apiPost } from './client'

/**
 * CMS Auto-Fix — the backend generates fix content with an LLM and pushes it
 * through the connected store's plugin/app (WordPress plugin or Shopify app).
 * Platforms without a write path (Webflow/Framer, and theme-owned Shopify
 * homepage content) come back as status "manual" with a copy-paste walkthrough.
 * See ranking-be `apps.analyzer` AutoFix* views + `auto_fix.py`.
 */

// LLM generation/apply can take ~2 minutes; override the client's 10s default.
const LONG_TIMEOUT_MS = 120_000
function longTimeout(): AbortSignal {
  return AbortSignal.timeout(LONG_TIMEOUT_MS)
}

export const autoFixResultSchema = z.object({
  recommendation_id: z.number(),
  status: z.enum(['success', 'partial', 'failed', 'verified', 'manual']),
  message: z.string().optional().default(''),
  fix_type: z.string().optional().default(''),
  generated_content: z.string().nullable().optional(),
})
export type AutoFixResult = z.infer<typeof autoFixResultSchema>

export const fixPreviewSchema = z.object({
  status: z.enum(['preview', 'error', 'manual']),
  fix_type: z.string().optional().default(''),
  recommendation_id: z.number(),
  recommendation_title: z.string().optional().default(''),
  original: z.string().optional().default(''),
  preview: z.string().optional().default(''),
  full_content: z.string().optional().default(''),
  target_post_id: z.union([z.number(), z.string()]).nullable().optional(),
  target_type: z.string().nullable().optional(),
  message: z.string().optional().default(''),
})
export type FixPreview = z.infer<typeof fixPreviewSchema>

function base(slug: string): string {
  return `/api/analyzer/runs/s/${slug}/auto-fix`
}

export interface ApplyAutoFixInput {
  slug: string
  recommendationIds: number[]
  email: string
  orgId?: number
}

/** Generate + push fixes for the given recommendations (WordPress/Shopify). */
export async function applyAutoFix(input: ApplyAutoFixInput): Promise<AutoFixResult[]> {
  const data = await apiPost<unknown>(
    `${base(input.slug)}/`,
    { recommendation_ids: input.recommendationIds, email: input.email, org_id: input.orgId },
    { signal: longTimeout() },
  )
  return z.array(autoFixResultSchema).parse(data)
}

/** Previously-applied fix status for the run's recommendations. */
export async function getAutoFixStatus(slug: string): Promise<AutoFixResult[]> {
  return z.array(autoFixResultSchema).parse(await apiGet<unknown>(`${base(slug)}/`))
}

/** Generate a preview of the fix content without writing anything. */
export async function previewFix(
  slug: string,
  recommendationId: number,
  email: string,
): Promise<FixPreview> {
  const data = await apiPost<unknown>(
    `${base(slug)}/preview/`,
    { recommendation_id: recommendationId, email },
    { signal: longTimeout() },
  )
  return fixPreviewSchema.parse(data)
}

export interface ApproveFixInput {
  slug: string
  recommendationId: number
  content: string
  fixType: string
}

/** Approve previewed content and push it to the connected store. */
export async function approveFix(input: ApproveFixInput): Promise<AutoFixResult> {
  const data = await apiPost<unknown>(`${base(input.slug)}/approve/`, {
    recommendation_id: input.recommendationId,
    content: input.content,
    fix_type: input.fixType,
  })
  return autoFixResultSchema.parse(data)
}

/** Re-fetch the live page and heuristically verify a fix was applied. */
export async function verifyFix(slug: string, recommendationId: number): Promise<AutoFixResult> {
  const data = await apiPost<unknown>(`${base(slug)}/verify/`, {
    recommendation_id: recommendationId,
  })
  return autoFixResultSchema.parse(data)
}
