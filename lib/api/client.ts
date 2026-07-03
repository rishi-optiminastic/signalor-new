import { config } from '@/lib/config'

/** Error thrown for any non-2xx response from the backend, with the parsed message. */
export class ApiError extends Error {
  status: number

  constructor(message: string, status: number) {
    super(message)
    this.name = 'ApiError'
    this.status = status
  }
}

interface RequestOptions {
  params?: Record<string, string | undefined>
  headers?: Record<string, string>
  signal?: AbortSignal
}

interface RequestConfig extends RequestOptions {
  body?: unknown
}

function buildUrl(path: string, params?: RequestOptions['params']): string {
  const url = new URL(path, config.apiBaseUrl)
  if (params) {
    for (const [key, value] of Object.entries(params)) {
      if (value !== undefined && value !== null) url.searchParams.set(key, value)
    }
  }
  return url.toString()
}

/** First non-empty string among an object's values (handles DRF `{ field: ["msg"] }`). */
function firstStringValue(obj: Record<string, unknown>): string | null {
  for (const value of Object.values(obj)) {
    if (typeof value === 'string' && value.trim()) return value
    if (Array.isArray(value) && typeof value[0] === 'string' && value[0].trim()) return value[0]
  }
  return null
}

/** Pull a human-readable message out of a DRF-style JSON error body. */
function messageFromBody(data: unknown): string | null {
  if (!data || typeof data !== 'object' || Array.isArray(data)) return null
  const obj = data as Record<string, unknown>
  if (typeof obj.error === 'string' && obj.error.trim()) return obj.error
  if (typeof obj.detail === 'string' && obj.detail.trim()) return obj.detail
  return firstStringValue(obj)
}

async function parseError(res: Response): Promise<string> {
  const fallback = res.statusText || 'Request failed. Please try again.'
  try {
    return messageFromBody(await res.json()) ?? fallback
  } catch {
    return fallback
  }
}

async function request<T>(method: string, path: string, cfg: RequestConfig = {}): Promise<T> {
  const { params, headers, signal, body } = cfg
  let res: Response
  try {
    res = await fetch(buildUrl(path, params), {
      method,
      headers: { 'Content-Type': 'application/json', ...headers },
      // Send better-auth session cookies to the backend when same-site.
      credentials: 'include',
      body: body !== undefined && body !== null ? JSON.stringify(body) : undefined,
      signal,
    })
  } catch {
    throw new ApiError('Cannot reach the server. Please try again.', 0)
  }
  if (!res.ok) {
    throw new ApiError(await parseError(res), res.status)
  }
  if (res.status === 204) return undefined as T
  return res.json() as Promise<T>
}

export function apiGet<T>(path: string, opts: RequestOptions = {}): Promise<T> {
  return request<T>('GET', path, opts)
}

export function apiPost<T>(path: string, body?: unknown, opts: RequestOptions = {}): Promise<T> {
  return request<T>('POST', path, { ...opts, body })
}
