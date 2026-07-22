import { z } from 'zod'

import { apiDelete, apiGet, apiPost } from './client'

/**
 * Prompt Tracker API — tracked prompts and their per-engine answers.
 * Backed by `runs/s/<slug>/prompts/` (list, create, recheck, soft-delete).
 */

/** A source the engine cited in its answer. `is_brand` marks the tracked brand's
 *  own domain — the real "was the brand cited?" signal (vs merely name-mentioned). */
export const promptCitationSchema = z
  .object({
    id: z.number().optional(),
    url: z.string().optional().default(''),
    domain: z.string().optional().default(''),
    title: z.string().nullable().optional(),
    is_brand: z.boolean().optional().default(false),
    is_competitor: z.boolean().optional().default(false),
  })
  .passthrough()
export type PromptCitation = z.infer<typeof promptCitationSchema>

/** One engine's answer to a tracked prompt. In the LIST payload `response_text`
 *  is capped to 500 chars server-side; the per-result detail endpoint returns it
 *  in full (see `getPromptResult`). */
export const promptResultSchema = z
  .object({
    id: z.number(),
    engine: z.string().optional().default(''),
    response_text: z.string().nullable().optional(),
    brand_mentioned: z.boolean().nullable().optional(),
    sentiment: z.string().nullable().optional(),
    rank_position: z.number().nullable().optional(),
    checked_at: z.string().nullable().optional(),
    citations: z.array(promptCitationSchema).optional().default([]),
  })
  .passthrough()
export type PromptResult = z.infer<typeof promptResultSchema>

export const promptTrackSchema = z.object({
  id: z.number(),
  prompt_text: z.string(),
  is_custom: z.boolean().optional().default(false),
  intent: z.string().nullable().optional(),
  prompt_type: z.string().nullable().optional(),
  score: z.number().nullable().optional(),
  visibility_pct: z.number().nullable().optional(),
  avg_position: z.number().nullable().optional(),
  ranking_label: z.string().nullable().optional(),
  sentiment_label: z.string().nullable().optional(),
  total_runs: z.number().nullable().optional(),
  mentions: z.number().nullable().optional(),
  results: z.array(promptResultSchema).optional().default([]),
})
export type PromptTrack = z.infer<typeof promptTrackSchema>

/** GET runs/s/<slug>/prompts/ → tracked prompts with per-engine results. */
export async function getPrompts(slug: string): Promise<PromptTrack[]> {
  return z
    .array(promptTrackSchema)
    .parse(await apiGet<unknown>(`/api/analyzer/runs/s/${slug}/prompts/`))
}

/** POST runs/s/<slug>/prompts/ → track a new prompt; engines answer it in the
 *  background, so its results arrive on a later refetch. */
export async function addPrompt(slug: string, promptText: string): Promise<PromptTrack> {
  return promptTrackSchema.parse(
    await apiPost<unknown>(`/api/analyzer/runs/s/${slug}/prompts/`, { prompt_text: promptText }),
  )
}

/** GET runs/s/<slug>/prompts/<trackId>/results/<resultId>/ → one engine result with
 *  the FULL (uncapped) response text. Used to show the complete answer in the dialog. */
export async function getPromptResult(
  slug: string,
  trackId: number,
  resultId: number,
): Promise<PromptResult> {
  return promptResultSchema.parse(
    await apiGet<unknown>(`/api/analyzer/runs/s/${slug}/prompts/${trackId}/results/${resultId}/`),
  )
}

/** POST runs/s/<slug>/prompts/<id>/recheck/ → re-fire one prompt across engines. */
export async function recheckPrompt(slug: string, trackId: number): Promise<void> {
  await apiPost<unknown>(`/api/analyzer/runs/s/${slug}/prompts/${trackId}/recheck/`)
}

/** DELETE runs/s/<slug>/prompts/<id>/ → stop tracking a prompt (soft delete). */
export async function deletePrompt(slug: string, trackId: number): Promise<void> {
  await apiDelete<unknown>(`/api/analyzer/runs/s/${slug}/prompts/${trackId}/`)
}

export const answerGapFaqSchema = z.object({
  items: z.array(z.object({ question: z.string(), answer: z.string() })),
  jsonld: z.string(),
})
export type AnswerGapFaq = z.infer<typeof answerGapFaqSchema>

/** POST runs/s/<slug>/answer-gap-faq/ → FAQ content generated from the run's
 *  weakest tracked prompts (LLM generation, allow up to two minutes). */
export async function generateAnswerGapFaq(slug: string): Promise<AnswerGapFaq> {
  return answerGapFaqSchema.parse(
    await apiPost<unknown>(`/api/analyzer/runs/s/${slug}/answer-gap-faq/`, undefined, {
      signal: AbortSignal.timeout(120_000),
    }),
  )
}

/* Derived from the tracked prompts' results + citations. */

export const visibilityMatrixSchema = z.object({
  engines: z.array(z.string()).default([]),
  rows: z
    .array(
      z.object({
        name: z.string(),
        domain: z.string().optional().default(''),
        is_brand: z.boolean().optional().default(false),
        cells: z.record(z.string(), z.number()).default({}),
      }),
    )
    .default([]),
})
export type VisibilityMatrix = z.infer<typeof visibilityMatrixSchema>

/** GET runs/s/<slug>/competitor-visibility-matrix/ → brand + competitors × engines. */
export async function getVisibilityMatrix(slug: string): Promise<VisibilityMatrix> {
  return visibilityMatrixSchema.parse(
    await apiGet<unknown>(`/api/analyzer/runs/s/${slug}/competitor-visibility-matrix/`),
  )
}
