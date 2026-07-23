import { z } from 'zod'

import { userActionSchema, type UserAction } from './analyzer'
import { apiPost } from './client'

function normalizeEmail(email: string): string {
  return email.toLowerCase().trim()
}

const syncActionsSchema = z.object({ created: z.number(), total: z.number() })
export type SyncActionsResult = z.infer<typeof syncActionsSchema>

/** POST /api/analyzer/actions/sync/ → materialize the brand's recommendations into tasks (idempotent). */
export async function syncActions(email: string, orgId: number): Promise<SyncActionsResult> {
  return syncActionsSchema.parse(
    await apiPost<unknown>('/api/analyzer/actions/sync/', {
      email: normalizeEmail(email),
      org_id: orgId,
    }),
  )
}

/** POST /api/analyzer/actions/<id>/assign/ → admin assigns a task to a teammate ('' = unassign). */
export async function assignAction(
  actionId: number,
  email: string,
  assigneeEmail: string,
): Promise<UserAction> {
  return userActionSchema.parse(
    await apiPost<unknown>(`/api/analyzer/actions/${actionId}/assign/`, {
      email: normalizeEmail(email),
      assignee_email: assigneeEmail ? normalizeEmail(assigneeEmail) : '',
    }),
  )
}

/** POST /api/analyzer/actions/<id>/ → update a task's status (e.g. mark completed). */
export async function updateActionStatus(actionId: number, status: string): Promise<void> {
  await apiPost<unknown>(`/api/analyzer/actions/${actionId}/`, { status })
}

const verifyActionSchema = z.object({
  verified: z.boolean(),
  message: z.string().optional().default(''),
  status: z.string().optional().default(''),
  verified_at: z.string().nullable().optional(),
})
export type VerifyActionResult = z.infer<typeof verifyActionSchema>

/**
 * POST /api/analyzer/actions/<id>/verify/ → re-crawl the live site and confirm
 * the task's finding is actually resolved. On a pass the backend flips the task
 * to `verified`; either way it returns the human-readable reason.
 */
export async function verifyAction(actionId: number): Promise<VerifyActionResult> {
  return verifyActionSchema.parse(
    await apiPost<unknown>(`/api/analyzer/actions/${actionId}/verify/`, {}),
  )
}
