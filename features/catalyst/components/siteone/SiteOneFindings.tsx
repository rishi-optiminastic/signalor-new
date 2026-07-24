'use client'

import { AgentSectionPanel } from '@/features/catalyst/components/agent/AgentSectionPanel'
import { BLUE, NEG, YELLOW } from '@/features/catalyst/constants'
import type { SiteOneFinding } from '@/lib/api/siteone'
import { ShieldAlert } from '@/lib/icons'

interface SiteOneFindingsProps {
  findings: SiteOneFinding[]
}

// Only the actionable severities are listed; "OK"/"INFO" are summarised as a
// count elsewhere. Ordered most-severe first.
const SEVERITY_ORDER = ['CRITICAL', 'WARNING', 'NOTICE']
const SEVERITY_COLOR: Record<string, string> = {
  CRITICAL: NEG,
  WARNING: YELLOW,
  NOTICE: BLUE,
}

function FindingRow({ finding }: { finding: SiteOneFinding }): JSX.Element {
  const color = SEVERITY_COLOR[finding.status] ?? 'var(--cat-ink-3)'
  return (
    <li className="flex items-start gap-2.5 border-t border-[var(--cat-border)] px-3 py-2 first:border-t-0">
      <span className="mt-1 h-2 w-2 shrink-0 rounded-full" style={{ background: color }} />
      <div className="min-w-0">
        <span className="text-[10px] font-semibold tracking-wide uppercase" style={{ color }}>
          {finding.status}
        </span>
        <p className="text-[12px] text-[var(--cat-ink)]">{finding.text}</p>
      </div>
    </li>
  )
}

/** Actionable SiteOne findings (critical / warning / notice), most-severe first. */
export function SiteOneFindings({ findings }: SiteOneFindingsProps): JSX.Element | null {
  const actionable = findings
    .filter(f => SEVERITY_ORDER.includes(f.status))
    .sort((a, b) => SEVERITY_ORDER.indexOf(a.status) - SEVERITY_ORDER.indexOf(b.status))
  if (actionable.length === 0) return null

  return (
    <AgentSectionPanel icon={ShieldAlert} title="Findings" count={actionable.length}>
      <ul>
        {actionable.map((finding, i) => (
          <FindingRow key={`${finding.code}-${i}`} finding={finding} />
        ))}
      </ul>
    </AgentSectionPanel>
  )
}
