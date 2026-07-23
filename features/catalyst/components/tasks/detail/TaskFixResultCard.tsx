'use client'

import {
  AlertTriangle,
  Check,
  ChevronDown,
  ClipboardList,
  ExternalLink,
  FileCode2,
  GitPullRequest,
  Loader2,
  Search,
} from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { useState, type ReactNode } from 'react'

import { GithubMark } from '@/components/GithubMark'
import { Card } from '@/features/catalyst/components/Card'
import { CardHead } from '@/features/catalyst/components/CardHead'
import { Delta } from '@/features/catalyst/components/Delta'
import { BRAND } from '@/features/catalyst/constants'
import type { AutoFixProofState } from '@/hooks/useTaskAutoFix'
import type { AutoFixResult } from '@/lib/api/autofix'
import type { GithubJob } from '@/lib/api/github'

const PILL_TONE: Record<string, string> = {
  open: 'bg-[rgba(246,185,59,0.15)] text-[#a06f0a]',
  merged: 'bg-[#E7F7EF] text-[#1e8a5c]',
  applied: 'bg-[#E7F7EF] text-[#1e8a5c]',
  manual: 'bg-[rgba(246,185,59,0.15)] text-[#a06f0a]',
  failed: 'bg-[#FDECEC] text-[#E5484D]',
}

function Pill({ tone, children }: { tone: string; children: string }): JSX.Element {
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-1 text-[11px] font-semibold capitalize ${PILL_TONE[tone] ?? 'bg-[var(--cat-hover)] text-[var(--cat-ink-2)]'}`}
    >
      {children}
    </span>
  )
}

function ExternalAction({
  href,
  icon,
  children,
}: {
  href: string
  /** Leading icon (e.g. the GitHub mark for a PR); defaults to a trailing arrow. */
  icon?: ReactNode
  children: string
}): JSX.Element {
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      className="inline-flex items-center gap-1.5 self-start rounded-md border border-[var(--cat-border)] px-3 py-1.5 text-[12px] font-medium text-[var(--cat-ink)] transition-colors hover:bg-[var(--cat-hover)]"
    >
      {icon}
      {children}
      {icon ? null : <ExternalLink size={12} />}
    </a>
  )
}

function JobScore({ job }: { job: GithubJob }): JSX.Element | null {
  if (job.score_before === null || job.score_after === null) return null
  const diff = Math.round(job.score_after - job.score_before)
  return (
    <p className="mt-1 flex items-center gap-2 text-[12px] text-[var(--cat-ink-2)]">
      Score {Math.round(job.score_before)} → {Math.round(job.score_after)}
      {diff !== 0 && <Delta positive={diff > 0}>{`${Math.abs(diff)} pts`}</Delta>}
    </p>
  )
}

// ── Stepped "Seer-style" flow for a GitHub fix job ────────────────────────────

type StepState = 'done' | 'active' | 'pending' | 'error'

const STEP_BASE = 'grid h-6 w-6 shrink-0 place-items-center rounded-full'

function StepIcon({ state, icon: Icon }: { state: StepState; icon: LucideIcon }): JSX.Element {
  if (state === 'done') {
    return (
      <span className={`${STEP_BASE} text-white`} style={{ background: BRAND }}>
        <Check size={13} strokeWidth={3} />
      </span>
    )
  }
  if (state === 'active') {
    return (
      <span className={`${STEP_BASE} border-2`} style={{ borderColor: BRAND, color: BRAND }}>
        <Loader2 size={12} className="animate-spin" />
      </span>
    )
  }
  if (state === 'error') {
    return (
      <span className={`${STEP_BASE} bg-[#FDECEC] text-[#E5484D]`}>
        <AlertTriangle size={13} />
      </span>
    )
  }
  return (
    <span className={`${STEP_BASE} border-2 border-[var(--cat-border)] text-[var(--cat-ink-3)]`}>
      <Icon size={12} />
    </span>
  )
}

interface FlowStepProps {
  icon: LucideIcon
  title: string
  state: StepState
  last?: boolean
  /** Make the step's content collapsible (for long content like the plan). */
  collapsible?: boolean
  defaultOpen?: boolean
  children: ReactNode
}

function stepTitleClass(state: StepState): string {
  const tone = state === 'pending' ? 'text-[var(--cat-ink-3)]' : 'text-[var(--cat-ink)]'
  return `text-[13px] font-semibold ${tone}`
}

/** A step's title — a plain label, or a chevron toggle when collapsible. */
function StepTitle({
  title,
  state,
  open,
  onToggle,
}: {
  title: string
  state: StepState
  open?: boolean
  onToggle?: () => void
}): JSX.Element {
  if (!onToggle) return <p className={stepTitleClass(state)}>{title}</p>
  return (
    <button
      type="button"
      onClick={onToggle}
      aria-expanded={open}
      className="flex w-full items-center gap-1.5 text-left"
    >
      <span className={stepTitleClass(state)}>{title}</span>
      <ChevronDown
        size={13}
        className={`text-[var(--cat-ink-3)] transition-transform ${open ? '' : '-rotate-90'}`}
      />
    </button>
  )
}

function FlowStep({
  icon,
  title,
  state,
  last,
  collapsible = false,
  defaultOpen = true,
  children,
}: FlowStepProps): JSX.Element {
  const [open, setOpen] = useState(defaultOpen)
  return (
    <div className="flex gap-3">
      <div className="flex flex-col items-center">
        <StepIcon state={state} icon={icon} />
        {!last && <span className="my-1 w-px flex-1 bg-[var(--cat-border)]" />}
      </div>
      <div className={`min-w-0 flex-1 ${last ? '' : 'pb-4'}`}>
        <StepTitle
          title={title}
          state={state}
          open={open}
          onToggle={collapsible ? () => setOpen(o => !o) : undefined}
        />
        {(!collapsible || open) && (
          <div className="mt-1 text-[12px] leading-relaxed text-[var(--cat-ink-2)]">{children}</div>
        )}
      </div>
    </div>
  )
}

function FindingChips({ codes }: { codes: string[] }): JSX.Element {
  return (
    <div className="flex flex-wrap gap-1.5">
      {codes.map(c => (
        <span
          key={c}
          className="rounded-sm bg-[var(--cat-hover)] px-1.5 py-0.5 font-mono text-[11px] text-[var(--cat-ink-2)]"
        >
          {c}
        </span>
      ))}
    </div>
  )
}

function FilesChanged({ files }: { files: GithubJob['files_changed'] }): JSX.Element {
  return (
    <div className="flex flex-col gap-1.5">
      <span className="text-[var(--cat-ink-3)]">
        {files.length} file{files.length > 1 ? 's' : ''} changed
      </span>
      {files.map(f => (
        <p key={f.path}>
          <span className="mr-2 rounded-sm bg-[var(--cat-hover)] px-1.5 py-0.5 font-mono text-[11px] text-[var(--cat-ink-2)]">
            {f.path}
          </span>
          <span className="text-[var(--cat-ink-3)]">{f.summary}</span>
        </p>
      ))}
    </div>
  )
}

function PrDetails({ job }: { job: GithubJob }): JSX.Element {
  return (
    <div className="flex flex-col gap-2">
      <span className="inline-flex items-center gap-2 text-[var(--cat-ink)]">
        <GithubMark size={13} />#{job.pr_number}
        <Pill tone={job.status}>{job.status === 'open' ? 'PR open' : job.status}</Pill>
      </span>
      <ExternalAction href={job.pr_url} icon={<GithubMark size={12} />}>
        View pull request
      </ExternalAction>
    </div>
  )
}

/** done wins, then error, then active-while-working, else pending. */
function stepState(done: boolean, active: boolean, failed: boolean): StepState {
  if (done) return 'done'
  if (failed) return 'error'
  return active ? 'active' : 'pending'
}

function ChangesStepContent({ job, failed }: { job: GithubJob; failed: boolean }): JSX.Element {
  if (job.files_changed.length > 0) return <FilesChanged files={job.files_changed} />
  if (failed) return <>—</>
  return <>Writing the changes…</>
}

function PrStepContent({ job, failed }: { job: GithubJob; failed: boolean }): JSX.Element {
  if (job.pr_url) return <PrDetails job={job} />
  if (failed)
    return <span className="text-[#E5484D]">{job.error_message || 'The fix failed.'}</span>
  if (job.files_changed.length > 0) return <>Opening a pull request…</>
  return <>Waiting to open a pull request…</>
}

function AutoFixFlow({ job }: { job: GithubJob }): JSX.Element {
  const failed = job.status === 'failed'
  const hasPlan = Boolean(job.reasoning)
  const hasChanges = job.files_changed.length > 0
  const planState = stepState(hasPlan, true, failed)
  const changeState = stepState(hasChanges, hasPlan, failed)
  const prState = stepState(Boolean(job.pr_url), hasChanges, failed)
  return (
    <div className="flex flex-col">
      <FlowStep icon={Search} title="Root cause" state="done">
        {job.finding_codes.length ? (
          <FindingChips codes={job.finding_codes} />
        ) : (
          'Analysing the flagged issue…'
        )}
      </FlowStep>
      <FlowStep
        icon={ClipboardList}
        title="Plan"
        state={planState}
        collapsible={Boolean(job.reasoning)}
        defaultOpen={false}
      >
        {job.reasoning || (failed ? 'Could not produce a plan.' : 'Working out the fix…')}
      </FlowStep>
      <FlowStep
        icon={FileCode2}
        title="Code changes"
        state={changeState}
        collapsible={job.files_changed.length > 0}
      >
        <ChangesStepContent job={job} failed={failed} />
      </FlowStep>
      <FlowStep icon={GitPullRequest} title="Pull request" state={prState} last>
        <PrStepContent job={job} failed={failed} />
      </FlowStep>
      <JobScore job={job} />
    </div>
  )
}

// ── CMS (Shopify / Woo / WordPress) apply proof ──────────────────────────────

/** Pill tone + label for a CMS apply result. */
function cmsBadge(result: AutoFixResult | null): { tone: string; label: string } {
  if (!result) return { tone: '', label: 'Working' }
  if (result.status === 'success' || result.status === 'verified') {
    return { tone: 'applied', label: result.status === 'verified' ? 'Verified' : 'Applied' }
  }
  return { tone: result.status, label: result.status }
}

function CmsHeader({ fix }: { fix: AutoFixProofState }): JSX.Element {
  const { tone, label } = cmsBadge(fix.result)
  return (
    <div className="flex items-center gap-2">
      <span className="text-[13px] font-semibold text-[var(--cat-ink)] capitalize">
        {fix.platform} fix
      </span>
      <span className="ml-auto">
        {fix.phase === 'working' ? (
          <span className="inline-flex items-center gap-1.5 text-[12px] text-[var(--cat-ink-2)]">
            <Loader2 size={13} className="animate-spin" /> Applying…
          </span>
        ) : (
          <Pill tone={tone}>{label}</Pill>
        )}
      </span>
    </div>
  )
}

function CmsProof({ fix }: { fix: AutoFixProofState }): JSX.Element {
  const { result, siteUrl } = fix
  return (
    <>
      <CmsHeader fix={fix} />
      {result?.message && (
        <p className="text-[12px] leading-relaxed text-[var(--cat-ink-2)]">{result.message}</p>
      )}
      {result?.generated_content && (
        <pre className="max-h-56 overflow-auto rounded-md border border-[var(--cat-border)] bg-[var(--cat-content)] p-3 font-mono text-[11.5px] leading-relaxed whitespace-pre-wrap text-[var(--cat-ink-2)]">
          {result.generated_content}
        </pre>
      )}
      {fix.phase === 'done' && siteUrl && (
        <ExternalAction href={siteUrl}>View the change live</ExternalAction>
      )}
    </>
  )
}

function RequestingRow(): JSX.Element {
  return (
    <p className="inline-flex items-center gap-1.5 text-[12px] text-[var(--cat-ink-2)]">
      <Loader2 size={13} className="animate-spin" />
      Opening a fix pull request on your repository…
    </p>
  )
}

function Proof({ fix }: { fix: AutoFixProofState }): JSX.Element {
  if (fix.platform !== 'nextjs') return <CmsProof fix={fix} />
  if (fix.job) return <AutoFixFlow job={fix.job} />
  return <RequestingRow />
}

/** Integration-aware proof of the auto-fix: the PR it opened or the CMS push. */
export function TaskFixResultCard({ fix }: { fix: AutoFixProofState }): JSX.Element | null {
  const hasActivity = fix.phase !== 'idle' || fix.job !== null || fix.result !== null
  if (!hasActivity) return null
  return (
    <Card>
      <CardHead title="Auto-fix" />
      <div className="mt-1 flex flex-col gap-2.5">
        <Proof fix={fix} />
      </div>
    </Card>
  )
}
