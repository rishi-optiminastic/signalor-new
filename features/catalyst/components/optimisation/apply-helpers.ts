import { getContentPageFields, type ContentPageFields } from '@fe/lib/api/content-optimisation'
import { getGithubJobs } from '@fe/lib/api/github'

const sleep = (ms: number): Promise<void> => new Promise(resolve => setTimeout(resolve, ms))

/** Pull `detail`/`error` out of an axios-style error without using `any`. */
export function errField(err: unknown, key: 'detail' | 'error' = 'detail'): string | undefined {
  if (err && typeof err === 'object' && 'response' in err) {
    const data = (err as { response?: { data?: Record<string, unknown> } }).response?.data
    const val = data?.[key]
    return typeof val === 'string' ? val : undefined
  }
  return undefined
}

/** HTTP status off an axios-style error, if present. */
export function errStatus(err: unknown): number | undefined {
  if (err && typeof err === 'object' && 'response' in err) {
    const status = (err as { response?: { status?: number } }).response?.status
    return typeof status === 'number' ? status : undefined
  }
  return undefined
}

export interface GithubPollCallbacks {
  onOpen: (prUrl: string) => void
  onFail: (message: string) => void
  onProgress: (status: string) => void
  onTimeout: () => void
}

/** Poll a GitHub content-PR job until it opens the PR or fails (~3 min max). */
export async function pollGithubJob(
  slug: string,
  jobId: number,
  cb: GithubPollCallbacks,
): Promise<void> {
  for (let attempt = 0; attempt < 50; attempt++) {
    await sleep(3500)
    try {
      const job = (await getGithubJobs(slug)).find(j => j.id === jobId)
      if (!job) continue
      if (job.status === 'open' && job.pr_url) return cb.onOpen(job.pr_url)
      if (job.status === 'failed') {
        return cb.onFail(job.error_message || "Couldn't open a pull request for this change.")
      }
      cb.onProgress(job.status)
    } catch {
      // Network blip — keep polling; the job keeps running server-side.
    }
  }
  cb.onTimeout()
}

export interface CmsPollCallbacks {
  onFields: (fields: ContentPageFields) => void
  onProgress: (attempt: number, total: number) => void
}

/** Poll the live page until the new text appears (Shopify CDN lag ~20s). */
export async function pollCmsRefresh(
  target: { slug: string; url: string; newText: string },
  cb: CmsPollCallbacks,
): Promise<boolean> {
  const { slug, url, newText } = target
  const total = 8
  for (let attempt = 1; attempt <= total; attempt++) {
    await sleep(2500)
    try {
      const fresh = await getContentPageFields(slug, url)
      cb.onFields(fresh)
      const inBody = (fresh.body_html || '').includes(newText)
      const inElements = (fresh.preview_elements || []).some(el =>
        (el.text || '').includes(newText),
      )
      if (inBody || inElements) return true
      cb.onProgress(attempt, total)
    } catch {
      // Network blip — keep trying.
    }
  }
  return false
}
