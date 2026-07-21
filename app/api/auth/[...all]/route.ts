import { toNextJsHandler } from 'better-auth/next-js'
import { NextResponse } from 'next/server'

import { auth } from '@/lib/auth'
import { createLogger } from '@/lib/logger'

const log = createLogger('auth-route')
const handlers = toNextJsHandler(auth)

export const POST = handlers.POST

/**
 * Wrap Better Auth's GET handler so a failed `get-session` — e.g. the Postgres
 * provider is unreachable or over its compute quota — degrades to a logged-out
 * `200 null` response instead of a 500.
 *
 * Every page reads the session via `useSession()`, so a raw 500 breaks the whole
 * app during a DB outage. Treating a session-lookup failure as "no session"
 * keeps public pages working and simply shows the signed-out UI; once the DB
 * recovers, `useSession()` refetches and restores the real session. Only
 * `get-session` is softened — every other auth endpoint keeps its original
 * error semantics so genuine failures (sign-in, sign-up) still surface.
 */
export async function GET(request: Request): Promise<Response> {
  const isGetSession = new URL(request.url).pathname.endsWith('/get-session')
  try {
    const response = await handlers.GET(request)
    if (isGetSession && response.status >= 500) {
      log.warn('get-session upstream failed (status %d); returning null session', response.status)
      return NextResponse.json(null, { status: 200 })
    }
    return response
  } catch (error) {
    if (isGetSession) {
      log.error({ err: error }, 'get-session threw; returning null session')
      return NextResponse.json(null, { status: 200 })
    }
    throw error
  }
}
