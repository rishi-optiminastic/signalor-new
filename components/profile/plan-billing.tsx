import { ArrowUpRight, CreditCard } from 'lucide-react'

import { formatDate, formatMoney } from '@/lib/format'
import type { AccountOverview } from '@/services/account.service'

import { SectionCard } from './section-card'

const STATUS_STYLES: Record<string, string> = {
  active: 'bg-[#047857]/10 text-[#047857]',
  trialing: 'bg-primary/10 text-primary',
  past_due: 'bg-[#b45309]/10 text-[#b45309]',
  canceled: 'bg-neutral-100 text-neutral-500',
}

/** Current plan, price, status and billing actions. */
export function PlanBilling({ plan }: { plan: AccountOverview['plan'] }): JSX.Element {
  return (
    <SectionCard title="Plan & billing" description="Manage your subscription and payment method.">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-foreground text-xl font-semibold tracking-tight">
              {plan.label}
            </span>
            <span
              className={`rounded-full px-2 py-0.5 text-[11px] font-semibold capitalize ${STATUS_STYLES[plan.status] ?? STATUS_STYLES.canceled}`}
            >
              {plan.status.replace('_', ' ')}
            </span>
          </div>
          <p className="mt-1 text-[13px] text-neutral-500">
            {formatMoney(plan.price, plan.currency)}
            <span className="text-neutral-400">/{plan.interval}</span>
            {plan.renewsOn && <> · renews {formatDate(plan.renewsOn)}</>}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            className="shadow-input text-foreground inline-flex h-9 items-center gap-1.5 rounded-md border border-neutral-200 bg-white px-3.5 text-[13px] font-medium transition hover:bg-neutral-50"
          >
            <CreditCard className="h-3.5 w-3.5" />
            Manage billing
          </button>
          <button
            type="button"
            className="auth-cta-btn inline-flex h-9 items-center gap-1.5 rounded-md px-3.5 text-[13px] font-medium text-white"
          >
            Upgrade
            <ArrowUpRight className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>
    </SectionCard>
  )
}
