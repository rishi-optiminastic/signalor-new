import { emailOTPClient } from 'better-auth/client/plugins'
import { createAuthClient } from 'better-auth/react'

import { config } from '@fe/lib/config'

export const authClient = createAuthClient({
  baseURL: config.authBaseUrl,
  plugins: [emailOTPClient()],
})

export const { signIn, signOut, useSession } = authClient
