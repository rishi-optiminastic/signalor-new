import { env } from '@/lib/env'

/** Runtime config derived from validated env vars. */
export const config = {
  /** Existing signalor (Django) backend base URL. */
  apiBaseUrl: env.NEXT_PUBLIC_API_URL,
  /** This app's own origin (better-auth lives here). */
  appUrl: env.NEXT_PUBLIC_APP_URL,
} as const
