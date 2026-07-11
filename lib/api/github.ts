import { z } from 'zod'

import { apiGet, apiPost } from './client'

/**
 * GitHub App — org-scoped connect used in onboarding. Installing the app lets
 * Signalor open fix PRs (schema, llms.txt, robots, canonical) on the connected
 * Next.js repo. See ranking-be `apps.github_agent`.
 */

function normalizeEmail(email: string): string {
  return email.toLowerCase().trim()
}

export const githubOrgStatusSchema = z.object({
  configured: z.boolean().optional().default(false),
  connected: z.boolean().optional().default(false),
  repo_full_name: z.string().optional().default(''),
})
export type GithubOrgStatus = z.infer<typeof githubOrgStatusSchema>

/** GET /api/github/status/?email= → whether the org's GitHub App is connected. */
export async function getOrgGithubStatus(email: string): Promise<GithubOrgStatus> {
  return githubOrgStatusSchema.parse(
    await apiGet<unknown>('/api/github/status/', { params: { email: normalizeEmail(email) } }),
  )
}

/** GET /api/github/install-url/?email= → the GitHub App installation URL. */
export async function getOrgGithubInstallUrl(email: string): Promise<string> {
  const data = await apiGet<unknown>('/api/github/install-url/', {
    params: { email: normalizeEmail(email) },
  })
  return z.object({ install_url: z.string() }).parse(data).install_url
}

// ─── Run-scoped GitHub Auto-Fix (opens one fix PR per finding on the repo) ─────

export const githubJobSchema = z.object({
  id: z.number(),
  status: z.enum(['pending', 'running', 'open', 'merged', 'closed', 'failed']),
  finding_codes: z.array(z.string()).default([]),
  pr_number: z.number().nullable(),
  pr_url: z.string().optional().default(''),
  files_changed: z.array(z.object({ path: z.string(), summary: z.string() })).default([]),
  reasoning: z.string().optional().default(''),
  error_message: z.string().optional().default(''),
  score_before: z.number().nullable(),
  score_after: z.number().nullable(),
  created_at: z.string(),
  updated_at: z.string(),
})
export type GithubJob = z.infer<typeof githubJobSchema>

export const githubRunStatusSchema = z.object({
  configured: z.boolean().optional().default(false),
  connected: z.boolean().optional().default(false),
  repo_full_name: z.string().optional().default(''),
  repositories: z.array(z.string()).default([]),
  supported_findings: z.record(z.string(), z.string()).default({}),
  fixability: z
    .record(z.string(), z.object({ fixable: z.boolean(), reason: z.string() }))
    .default({}),
  jobs: z.array(githubJobSchema).default([]),
})
export type GithubRunStatus = z.infer<typeof githubRunStatusSchema>

const fixJobStubSchema = z.object({
  finding_code: z.string(),
  job_id: z.number(),
  status: z.string(),
})
export type GithubFixJobStub = z.infer<typeof fixJobStubSchema>

function runBase(slug: string): string {
  return `/api/github/runs/s/${slug}`
}

/** GET run GitHub status: connection, per-finding fixability, and fix jobs. */
export async function getGithubStatus(slug: string): Promise<GithubRunStatus> {
  return githubRunStatusSchema.parse(await apiGet<unknown>(`${runBase(slug)}/status/`))
}

/** GET the App install URL scoped to this run (carries the slug back on callback). */
export async function getGithubInstallUrl(slug: string): Promise<string> {
  const data = await apiGet<unknown>(`${runBase(slug)}/install-url/`)
  return z.object({ install_url: z.string() }).parse(data).install_url
}

/** POST to open one fix PR per finding code. Returns the created job stubs. */
export async function requestGithubFix(
  slug: string,
  findingCodes: string[],
): Promise<GithubFixJobStub[]> {
  const data = await apiPost<unknown>(`${runBase(slug)}/fix/`, { finding_codes: findingCodes })
  return z.object({ jobs: z.array(fixJobStubSchema) }).parse(data).jobs
}

/** GET all fix jobs for the run (poll for PR/merge state + score delta). */
export async function getGithubJobs(slug: string): Promise<GithubJob[]> {
  const data = await apiGet<unknown>(`${runBase(slug)}/jobs/`)
  return z.object({ jobs: z.array(githubJobSchema) }).parse(data).jobs
}
