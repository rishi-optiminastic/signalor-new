import { toNextJsHandler } from 'better-auth/next-js'

import { auth } from '@legacy/lib/auth'

export const { GET, POST } = toNextJsHandler(auth)
