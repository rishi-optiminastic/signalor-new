import type { AccountOverview, UsageMetric } from '@/services/account.service'

import { SectionCard } from './section-card'

function UsageBar({ label, metric }: { label: string; metric: UsageMetric }): JSX.Element {
  const pct = metric.max > 0 ? Math.min(100, Math.round((metric.used / metric.max) * 100)) : 0
  const near = pct >= 80
  return (
    <div>
      <div className="mb-1.5 flex items-baseline justify-between">
        <span className="text-foreground text-[13px] font-medium">{label}</span>
        <span className="text-xs text-neutral-500 tabular-nums">
          {metric.used} <span className="text-neutral-400">/ {metric.max}</span>
        </span>
      </div>
      <div className="h-1.5 w-full overflow-hidden rounded-full bg-neutral-100">
        <div
          className={`h-full rounded-full ${near ? 'bg-[#e04a3d]' : 'bg-foreground'}`}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  )
}

interface UsageLimitsProps {
  usage: AccountOverview['usage']
  engines: string[]
}

/** Plan usage against limits, plus the connected AI engines. */
export function UsageLimits({ usage, engines }: UsageLimitsProps): JSX.Element {
  return (
    <SectionCard title="Usage & limits" description="Your current usage against plan limits.">
      <div className="space-y-4">
        <UsageBar label="Projects" metric={usage.projects} />
        <UsageBar label="Tracked prompts" metric={usage.prompts} />
        <div className="flex items-baseline justify-between border-t border-neutral-100 pt-3.5">
          <span className="text-foreground text-[13px] font-medium">Runs this month</span>
          <span className="text-foreground text-xs font-semibold tabular-nums">
            {usage.runsThisMonth}
          </span>
        </div>
        <div>
          <p className="mb-2 text-xs font-medium text-neutral-500">AI engines</p>
          <div className="flex flex-wrap gap-1.5">
            {engines.map(e => (
              <span
                key={e}
                className="rounded-md border border-neutral-200 bg-white px-2.5 py-1 text-[11px] font-medium text-neutral-600"
              >
                {e}
              </span>
            ))}
          </div>
        </div>
      </div>
    </SectionCard>
  )
}
