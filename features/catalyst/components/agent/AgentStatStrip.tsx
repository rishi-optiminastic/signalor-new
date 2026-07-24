import { TaskStatCard } from '@/features/catalyst/components/tasks/TaskStatCard'
import { BLUE, BRAND, GREEN, YELLOW } from '@/features/catalyst/constants'
import type { StatCard } from '@/features/catalyst/tasks-data'
import type { AgentPlan } from '@/lib/api/agent'
import { CalendarClock, CheckCircle2, Gauge, Inbox, ListTodo, TrendingUp } from '@/lib/icons'

function shortDate(iso: string | null): string {
  if (!iso) return '—'
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return '—'
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
}

function buildStats(plan: AgentPlan): StatCard[] {
  const openImpact = plan.groups
    .flatMap(g => g.actions)
    .reduce((sum, action) => sum + action.impact, 0)
  return [
    {
      icon: Gauge,
      color: BRAND,
      label: 'GEO Score',
      value: plan.brief.score !== null ? String(Math.round(plan.brief.score)) : '—',
    },
    {
      icon: TrendingUp,
      color: GREEN,
      label: 'Potential Gain',
      value: openImpact > 0 ? `+${openImpact}` : '—',
    },
    { icon: ListTodo, color: BLUE, label: 'Today', value: String(plan.counts.today) },
    { icon: Inbox, color: YELLOW, label: 'Backlog', value: String(plan.counts.backlog) },
    { icon: CheckCircle2, color: GREEN, label: 'Done', value: String(plan.counts.done) },
    {
      icon: CalendarClock,
      color: BLUE,
      label: 'Last Analyzed',
      value: shortDate(plan.brief.last_analyzed_at),
    },
  ]
}

/** The plan's numbers at a glance — score, open work and what it's worth. */
export function AgentStatStrip({ plan }: { plan: AgentPlan | undefined }): JSX.Element | null {
  if (!plan) return null
  return (
    <div className="grid grid-cols-2 gap-2 md:grid-cols-3 xl:grid-cols-6">
      {buildStats(plan).map(stat => (
        <TaskStatCard key={stat.label} stat={stat} />
      ))}
    </div>
  )
}
