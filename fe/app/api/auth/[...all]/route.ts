import { toNextJsHandler } from 'better-auth/next-js'

import { auth } from '@fe/lib/auth'

export const { GET, POST } = toNextJsHandler(auth)
