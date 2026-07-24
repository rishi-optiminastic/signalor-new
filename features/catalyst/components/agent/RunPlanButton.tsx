'use client'

import { PrimaryButton } from '@/features/catalyst/components/PrimaryButton'
import { useAgentMutations, useAgentPlan } from '@/hooks/useAgentPlan'
import { RefreshCw } from '@/lib/icons'

/** Whether refresh is locked and the label to show, from the next-allowed time. */
function refreshState(availableAt: string | null): { locked: boolean; label: string } {
  if (!availableAt) return { locked: false, label: 'Refresh plan' }
  const remainingMs = new Date(availableAt).getTime() - Date.now()
  if (remainingMs <= 0) return { locked: false, label: 'Refresh plan' }
  const hours = Math.ceil(remainingMs / (1000 * 60 * 60))
  const label =
    hours >= 1 ? `Refresh in ${hours}h` : `Refresh in ${Math.ceil(remainingMs / 60000)}m`
  return { locked: true, label }
}

/**
 * Re-materializes the latest analysis into tasks and re-ranks them now, instead
 * of waiting for the nightly job. Limited to once per 24h (the plan is a daily
 * artifact) — the backend enforces it; the button reflects it.
 *
 * Deliberately does NOT auto-apply site fixes — that stays behind the per-task
 * CTA and the auto-fix consent flow.
 */
export function RunPlanButton(): JSX.Element {
  const { plan } = useAgentPlan()
  const { refresh, isRefreshing } = useAgentMutations()

  const { locked, label } = refreshState(plan?.refresh_available_at ?? null)

  return (
    <PrimaryButton
      icon={RefreshCw}
      onClick={refresh}
      disabled={isRefreshing || locked}
      title={locked ? 'You can refresh the plan once a day' : undefined}
    >
      {isRefreshing ? 'Refreshing…' : label}
    </PrimaryButton>
  )
}
