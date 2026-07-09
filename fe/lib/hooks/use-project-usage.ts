'use client'

import { useEffect, useState } from 'react'

import { getSubscriptionStatus, getUsage } from '@fe/lib/api/payments'

export type ProjectUsage = {
  /** True until the first fetch resolves. */
  loading: boolean
  /** True once usage has been fetched successfully at least once. */
  loaded: boolean
  /** Projects the user currently has. */
  count: number
  /** Maximum projects the plan allows. */
  max: number
  /** Projects remaining before the cap (never negative). */
  remaining: number
  /** Whether the user is at (or over) the project cap. */
  atLimit: boolean
  /** Raw plan key: "starter" | "pro" | "business". */
  plan: string
  /** Human label, e.g. "Max". Empty when subscription status is unavailable. */
  planLabel: string
  /** Whether the subscription is active. */
  isActive: boolean
}

const EMPTY: ProjectUsage = {
  loading: true,
  loaded: false,
  count: 0,
  max: 0,
  remaining: 0,
  atLimit: false,
  plan: '',
  planLabel: '',
  isActive: false,
}

/**
 * Reads the user's project usage + subscription in one place so the onboarding
 * gate and Settings screens agree on count/limit/plan. Backed by the existing
 * `GET /api/payments/usage/` and subscription-status endpoints.
 */
export function useProjectUsage(email: string | null | undefined): ProjectUsage {
  const [state, setState] = useState<ProjectUsage>(EMPTY)

  useEffect(() => {
    if (!email) {
      setState(s => ({ ...s, loading: false }))
      return
    }
    let cancelled = false
    setState(s => ({ ...s, loading: true }))
    Promise.all([
      getUsage(email).catch(() => null),
      getSubscriptionStatus(email).catch(() => null),
    ]).then(([u, s]) => {
      if (cancelled) return
      if (!u) {
        setState({ ...EMPTY, loading: false })
        return
      }
      const count = u.usage.projects
      const max = u.limits.max_projects
      setState({
        loading: false,
        loaded: true,
        count,
        max,
        remaining: Math.max(0, max - count),
        atLimit: u.at_limit.projects,
        plan: s?.plan ?? u.plan,
        planLabel: s?.plan_label ?? '',
        isActive: s?.is_active ?? false,
      })
    })
    return () => {
      cancelled = true
    }
  }, [email])

  return state
}
