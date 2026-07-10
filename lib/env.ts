import { createEnv } from '@t3-oss/env-nextjs'
import { z } from 'zod'

export const env = createEnv({
  server: {
    NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
    DATABASE_URL: z.string().url(),
    BETTER_AUTH_SECRET: z.string().min(1),
    BETTER_AUTH_URL: z.string().url(),
    // Optional — Google OAuth is enabled only when both are present.
    GOOGLE_CLIENT_ID: z.string().optional(),
    GOOGLE_CLIENT_SECRET: z.string().optional(),
    // Optional — OTP email delivery via SendGrid (falls back to dev log).
    SENDGRID_API_KEY: z.string().optional(),
    FROM_EMAIL: z.string().optional(),
  },
  client: {
    NEXT_PUBLIC_APP_URL: z.string().url(),
    // Existing signalor (Django) backend for org/account/analyzer endpoints.
    NEXT_PUBLIC_API_URL: z.string().url().default('http://localhost:8000'),
    // When 'true', the onboarding service returns mocked data instead of calling
    // the backend/OTP — lets the full UI be clicked through without infra.
    NEXT_PUBLIC_USE_STUBS: z.enum(['true', 'false']).default('false'),
  },
  runtimeEnv: {
    NODE_ENV: process.env.NODE_ENV,
    DATABASE_URL: process.env.DATABASE_URL,
    BETTER_AUTH_SECRET: process.env.BETTER_AUTH_SECRET,
    BETTER_AUTH_URL: process.env.BETTER_AUTH_URL,
    GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
    GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET,
    SENDGRID_API_KEY: process.env.SENDGRID_API_KEY,
    FROM_EMAIL: process.env.FROM_EMAIL,
    NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
    NEXT_PUBLIC_USE_STUBS: process.env.NEXT_PUBLIC_USE_STUBS,
  },
  skipValidation: !!process.env.SKIP_ENV_VALIDATION,
  emptyStringAsUndefined: true,
})
