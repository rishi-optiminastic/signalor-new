import { z } from 'zod'

import { apiGet } from './client'

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
