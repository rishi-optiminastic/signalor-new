import { ClipboardList, GitPullRequest, Search } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'

import { Card } from '@/features/catalyst/components/Card'
import { CardHead } from '@/features/catalyst/components/CardHead'
import { TaskAutoFixButton } from '@/features/catalyst/components/tasks/detail/TaskAutoFixButton'
import { TaskFixResultCard } from '@/features/catalyst/components/tasks/detail/TaskFixResultCard'
import type { TaskAutoFix } from '@/hooks/useTaskAutoFix'

const STEPS: { icon: LucideIcon; text: string }[] = [
  { icon: Search, text: 'Find the root cause of this issue' },
  { icon: ClipboardList, text: 'Propose a targeted fix' },
  { icon: GitPullRequest, text: 'Open a pull request on your repo' },
]

/** Idle state: what auto-fix will do (Seer-style explainer) + the trigger. */
function AutoFixExplainer({ fix }: { fix: TaskAutoFix }): JSX.Element {
  return (
    <Card>
      <CardHead title="Auto-fix" />
      <p className="text-[12.5px] leading-relaxed text-[var(--cat-ink-2)]">
        SignalorAI can resolve this for you:
      </p>
      <ul className="mt-2.5 flex flex-col gap-2">
        {STEPS.map(step => (
          <li
            key={step.text}
            className="flex items-center gap-2.5 text-[12.5px] text-[var(--cat-ink)]"
          >
            <span className="grid h-6 w-6 shrink-0 place-items-center rounded-md bg-[var(--cat-hover)] text-[var(--cat-ink-2)]">
              <step.icon size={13} />
            </span>
            {step.text}
          </li>
        ))}
      </ul>
      <div className="mt-3.5">
        <TaskAutoFixButton fix={fix} />
      </div>
    </Card>
  )
}

/** The task's auto-fix, in the right sidebar (Sentry "Seer" position): an
 *  explainer + trigger before it runs, the stepped fix flow once it's underway. */
export function TaskAutoFixPanel({ fix }: { fix: TaskAutoFix }): JSX.Element | null {
  if (!fix.visible) return null
  const hasActivity = fix.phase !== 'idle' || fix.job !== null || fix.result !== null
  return hasActivity ? <TaskFixResultCard fix={fix} /> : <AutoFixExplainer fix={fix} />
}
