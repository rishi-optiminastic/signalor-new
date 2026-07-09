import { z } from 'zod'

import { apiClient } from './client'

// ─── Schemas ─────────────────────────────────────────────────────────────────

export const githubJobSchema = z.object({
  id: z.number(),
  status: z.enum(['pending', 'running', 'open', 'merged', 'closed', 'failed']),
  finding_codes: z.array(z.string()),
  pr_number: z.number().nullable(),
  pr_url: z.string(),
  files_changed: z.array(z.object({ path: z.string(), summary: z.string() })).default([]),
  reasoning: z.string().optional().default(''),
  error_message: z.string(),
  score_before: z.number().nullable(),
  score_after: z.number().nullable(),
  created_at: z.string(),
  updated_at: z.string(),
})

export const githubStatusSchema = z.object({
  configured: z.boolean(),
  connected: z.boolean(),
  repo_full_name: z.string(),
  repositories: z.array(z.string()).default([]),
  supported_findings: z.record(z.string(), z.string()),
  fixability: z
    .record(z.string(), z.object({ fixable: z.boolean(), reason: z.string() }))
    .default({}),
  jobs: z.array(githubJobSchema).default([]),
})

export type GithubJob = z.infer<typeof githubJobSchema>
export type GithubStatus = z.infer<typeof githubStatusSchema>

// ─── API ─────────────────────────────────────────────────────────────────────

const base = (slug: string) => `/api/github/runs/s/${slug}`

export async function getGithubStatus(slug: string): Promise<GithubStatus> {
  const { data } = await apiClient.get(`${base(slug)}/status/`)
  return githubStatusSchema.parse(data)
}

export async function getGithubInstallUrl(slug: string): Promise<string> {
  const { data } = await apiClient.get(`${base(slug)}/install-url/`)
  return z.object({ install_url: z.string() }).parse(data).install_url
}

export async function requestGithubFix(
  slug: string,
  findingCodes: string[],
): Promise<{ finding_code: string; job_id: number; status: string }[]> {
  const { data } = await apiClient.post(`${base(slug)}/fix/`, { finding_codes: findingCodes })
  return z
    .object({
      jobs: z.array(z.object({ finding_code: z.string(), job_id: z.number(), status: z.string() })),
    })
    .parse(data).jobs
}

// ─── Content-Optimisation PRs (Next.js repos) ────────────────────────────────

export type GithubContentEdit =
  | { kind: 'text'; original: string; new: string }
  | { kind: 'metadata'; field: 'title' | 'description'; original: string; new: string }

/** Open a PR that applies Content-Optimisation edits to a connected Next.js repo. */
export async function openContentPr(
  slug: string,
  url: string,
  edits: GithubContentEdit[],
): Promise<{ job_id: number; status: string }> {
  const { data } = await apiClient.post(`${base(slug)}/content-pr/`, { url, edits })
  return z.object({ job_id: z.number(), status: z.string() }).parse(data)
}

export async function getGithubJobs(slug: string): Promise<GithubJob[]> {
  const { data } = await apiClient.get(`${base(slug)}/jobs/`)
  return z.object({ jobs: z.array(githubJobSchema) }).parse(data).jobs
}

export async function disconnectGithub(slug: string): Promise<void> {
  await apiClient.post(`${base(slug)}/disconnect/`)
}

// ─── Org-scoped (onboarding — before any analysis run exists) ─────────────────

export const githubOrgStatusSchema = z.object({
  configured: z.boolean(),
  connected: z.boolean(),
  repo_full_name: z.string(),
  repositories: z.array(z.string()).default([]),
})

export type GithubOrgStatus = z.infer<typeof githubOrgStatusSchema>

export async function getOrgGithubInstallUrl(email: string): Promise<string> {
  const { data } = await apiClient.get(`/api/github/install-url/`, { params: { email } })
  return z.object({ install_url: z.string() }).parse(data).install_url
}

export async function getOrgGithubStatus(email: string): Promise<GithubOrgStatus> {
  const { data } = await apiClient.get(`/api/github/status/`, { params: { email } })
  return githubOrgStatusSchema.parse(data)
}
