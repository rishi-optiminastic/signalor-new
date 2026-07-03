import { betterAuth } from 'better-auth'
import { prismaAdapter } from 'better-auth/adapters/prisma'
import { emailOTP } from 'better-auth/plugins'

import { env } from '@/lib/env'
import { createLogger } from '@/lib/logger'
import { prisma } from '@/lib/prisma'

const log = createLogger('auth')

// Google OAuth is wired only when both credentials are present, so the app
// still boots (and email/password still works) without them configured.
const socialProviders =
  env.GOOGLE_CLIENT_ID && env.GOOGLE_CLIENT_SECRET
    ? {
        google: {
          clientId: env.GOOGLE_CLIENT_ID,
          clientSecret: env.GOOGLE_CLIENT_SECRET,
        },
      }
    : undefined

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: 'postgresql',
  }),
  secret: env.BETTER_AUTH_SECRET,
  baseURL: env.BETTER_AUTH_URL,
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: false,
    minPasswordLength: 8,
  },
  socialProviders,
  plugins: [
    emailOTP({
      otpLength: 6,
      expiresIn: 10 * 60, // 10 minutes
      // Delivery: TODO(prod) — send `otp` via your email provider or the Django
      // backend. In development we log it so the flow is testable end-to-end
      // (read the code from the dev server terminal).
      async sendVerificationOTP({ email, otp }) {
        if (env.NODE_ENV === 'development') {
          log.info({ email, otp }, 'Email OTP (dev — wire real delivery for prod)')
        }
      },
    }),
  ],
  // Rate limiting protects auth endpoints from brute-force / credential-stuffing.
  // Default storage is in-memory; for multi-instance deployments swap to a
  // distributed store (Redis/Upstash) via `rateLimit.storage = 'secondary-storage'`
  // and pass a `secondaryStorage` adapter at the top level.
  rateLimit: {
    enabled: true,
    window: 60, // seconds
    max: 100, // global default per window per IP
    customRules: {
      '/sign-in/email': { window: 60, max: 5 },
      '/sign-up/email': { window: 60, max: 5 },
      '/forget-password': { window: 60, max: 3 },
      '/reset-password': { window: 60, max: 5 },
    },
  },
  session: {
    expiresIn: 60 * 60 * 24 * 30, // 30 days
    updateAge: 60 * 60 * 24, // refresh every 24h
    cookieCache: {
      enabled: true,
      maxAge: 5 * 60, // 5 minutes
    },
  },
  trustedOrigins: [env.NEXT_PUBLIC_APP_URL],
})

export type Session = typeof auth.$Infer.Session
