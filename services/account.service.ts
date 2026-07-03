import { env } from '@/lib/env'
import type { AccountType } from '@/stores/useOnboardingStore'

/**
 * Account overview for the profile page — plan, usage/limits, projects, billing.
 * Mocked while NEXT_PUBLIC_USE_STUBS='true'; TODO(wire) composes the real
 * signalor endpoints (see notes in getAccountOverview).
 */

export interface UsageMetric {
  used: number
  max: number
}

export interface AccountProject {
  id: number
  name: string
  url: string
  createdAt: string
}

export interface AccountInvoice {
  id: string
  date: string
  amount: number
  currency: string
  status: string
}

export interface AccountOverview {
  user: { name: string; email: string; accountType: AccountType }
  plan: {
    key: string
    label: string
    price: number
    currency: string
    interval: string
    status: 'active' | 'trialing' | 'past_due' | 'canceled'
    renewsOn: string | null
  }
  usage: { projects: UsageMetric; prompts: UsageMetric; runsThisMonth: number }
  engines: string[]
  projects: AccountProject[]
  invoices: AccountInvoice[]
}

export const SAMPLE_ACCOUNT: AccountOverview = {
  user: { name: 'Rishi Sharma', email: 'tech1@optiminastic.com', accountType: 'agency' },
  plan: {
    key: 'pro',
    label: 'Pro',
    price: 79,
    currency: 'USD',
    interval: 'month',
    status: 'active',
    renewsOn: '2026-08-03',
  },
  usage: {
    projects: { used: 3, max: 10 },
    prompts: { used: 42, max: 150 },
    runsThisMonth: 18,
  },
  engines: ['ChatGPT', 'Gemini', 'Perplexity', 'Claude', 'Google', 'Bing'],
  projects: [
    { id: 1, name: 'Optiminastic', url: 'optiminastic.com', createdAt: '2026-05-12' },
    { id: 2, name: 'Signalor', url: 'signalor.ai', createdAt: '2026-06-01' },
    { id: 3, name: 'Tech5', url: 'tech5.io', createdAt: '2026-06-20' },
  ],
  invoices: [
    { id: 'in_0Kd93', date: '2026-07-03', amount: 79, currency: 'USD', status: 'paid' },
    { id: 'in_0Kc71', date: '2026-06-03', amount: 79, currency: 'USD', status: 'paid' },
    { id: 'in_0Kb42', date: '2026-05-03', amount: 79, currency: 'USD', status: 'paid' },
  ],
}

const USE_STUBS = env.NEXT_PUBLIC_USE_STUBS === 'true'

export async function getAccountOverview(): Promise<AccountOverview> {
  if (USE_STUBS) {
    await new Promise(resolve => {
      setTimeout(resolve, 450)
    })
    return SAMPLE_ACCOUNT
  }
  // TODO(wire): compose from GET /api/payments/usage/, /api/payments/subscription/status/,
  // GET /api/organizations/?email=, and GET /api/payments/invoices/ using the session email.
  return SAMPLE_ACCOUNT
}
