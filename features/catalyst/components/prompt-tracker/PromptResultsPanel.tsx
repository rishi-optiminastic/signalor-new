'use client'

import { Maximize2 } from 'lucide-react'
import { useState } from 'react'

import { EngineLogo } from '@/features/catalyst/components/EngineLogo'
import { ResponseDialog } from '@/features/catalyst/components/prompt-tracker/ResponseDialog'
import { ResponseText } from '@/features/catalyst/components/prompt-tracker/ResponseText'
import type { PromptEngineResult } from '@/features/catalyst/prompt-tracker-data'
import { formatTaskDate } from '@/features/catalyst/tasks-data'

const GREEN_TINT = 'rgba(47,190,126,0.12)'
const GREEN_INK = '#2FBE7E'

const SENTIMENT_TONE: Record<string, string> = {
  positive: 'bg-[rgba(47,190,126,0.12)] text-[#2FBE7E]',
  negative: 'bg-[#FDECEC] text-[#E5484D]',
}

function EngineBadge({ result }: { result: PromptEngineResult }): JSX.Element {
  return (
    <span className="flex items-center gap-1.5 text-[12px] font-semibold text-[var(--cat-ink)]">
      <EngineLogo name={result.engineLabel} size={18} />
      {result.engineLabel}
    </span>
  )
}

function ResultMeta({ result }: { result: PromptEngineResult }): JSX.Element {
  return (
    <span className="ml-auto flex items-center gap-1.5">
      {result.position !== null && result.position > 0 && (
        <span className="rounded-sm bg-[var(--cat-hover)] px-1.5 py-0.5 text-[10px] font-medium text-[var(--cat-ink-2)] tabular-nums">
          #{result.position}
        </span>
      )}
      {result.sentiment && (
        <span
          className={`rounded-sm px-1.5 py-0.5 text-[10px] font-medium capitalize ${SENTIMENT_TONE[result.sentiment] ?? 'bg-[var(--cat-hover)] text-[var(--cat-ink-3)]'}`}
        >
          {result.sentiment}
        </span>
      )}
      <span
        className={`rounded-sm px-1.5 py-0.5 text-[10px] font-medium ${
          result.mentioned
            ? 'bg-[rgba(47,190,126,0.12)] text-[#2FBE7E]'
            : 'bg-[var(--cat-hover)] text-[var(--cat-ink-3)]'
        }`}
      >
        {result.mentioned ? 'Mentioned' : 'Not mentioned'}
      </span>
    </span>
  )
}

/** Preview of the answer plus a trigger that opens the full response dialog. */
function ResultBody({
  result,
  onOpen,
}: {
  result: PromptEngineResult
  onOpen: () => void
}): JSX.Element {
  if (!result.snippet) {
    return (
      <p className="text-[12px] text-[var(--cat-ink-3)]">No answer text captured for this run.</p>
    )
  }
  return (
    <>
      <div className="max-h-[6.5rem] overflow-hidden">
        <ResponseText text={result.snippet} />
      </div>
      <button
        type="button"
        onClick={onOpen}
        className="inline-flex w-fit items-center gap-1 text-[11px] font-semibold text-[var(--cat-ink-2)] transition-colors hover:text-[var(--cat-ink)]"
      >
        <Maximize2 size={11} />
        View full response
      </button>
    </>
  )
}

function ResultCard({ result }: { result: PromptEngineResult }): JSX.Element {
  const [open, setOpen] = useState(false)
  const cited = result.mentioned
  return (
    <div
      className="flex flex-col gap-2 rounded-md border p-3"
      style={{
        borderColor: cited ? GREEN_INK : 'var(--cat-border)',
        background: cited ? GREEN_TINT : 'var(--cat-content)',
      }}
    >
      <div className="flex items-center gap-2">
        <EngineBadge result={result} />
        <ResultMeta result={result} />
      </div>
      <ResultBody result={result} onOpen={() => setOpen(true)} />
      {result.checkedAt && (
        <p className="text-[10px] text-[var(--cat-ink-3)]">
          Checked {formatTaskDate(result.checkedAt)}
        </p>
      )}
      {open && <ResponseDialog result={result} onClose={() => setOpen(false)} />}
    </div>
  )
}

/** The expanded body of a prompt row — each engine's latest answer, cited first. */
export function PromptResultsPanel({ results }: { results: PromptEngineResult[] }): JSX.Element {
  if (results.length === 0) {
    return (
      <p className="px-4 pb-3.5 text-[12px] text-[var(--cat-ink-3)]">
        No engine answers yet. They arrive within a minute of tracking; this list refreshes
        automatically.
      </p>
    )
  }
  const ordered = [...results].sort((a, b) => Number(b.mentioned) - Number(a.mentioned))
  return (
    <div className="grid grid-cols-1 gap-2 px-4 pb-3.5 md:grid-cols-2">
      {ordered.map(result => (
        <ResultCard key={result.id} result={result} />
      ))}
    </div>
  )
}
