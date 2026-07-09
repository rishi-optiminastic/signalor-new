import { ChevronRight } from 'lucide-react'
import type { ReactNode } from 'react'

import { GREEN } from '@/features/catalyst/constants'
import { ttfbColor, WARN_COLOR } from '@/features/catalyst/sitemap-data'
import type { AuditRow as Row } from '@/features/catalyst/sitemap-data'

function TwoLine({ main, sub }: { main: string; sub: string }): JSX.Element {
  return (
    <div className="leading-tight whitespace-nowrap">
      <div className="text-[13px] text-[var(--cat-ink)]">{main}</div>
      <div className="text-[11px] text-[var(--cat-ink-3)]">{sub}</div>
    </div>
  )
}

function Dash(): JSX.Element {
  return <span className="text-[var(--cat-ink-3)]">—</span>
}

function StatusPill({ status }: { status: number }): JSX.Element {
  return (
    <span
      className="inline-flex items-center rounded-full px-2 py-0.5 text-[12px] font-semibold"
      style={{ color: GREEN, background: 'rgba(47,190,126,.14)' }}
    >
      {status}
    </span>
  )
}

function Ttfb({ value, ms }: { value: string; ms: number }): JSX.Element {
  return (
    <span className="font-semibold whitespace-nowrap" style={{ color: ttfbColor(ms) }}>
      {value}
    </span>
  )
}

function AiCell({ value }: { value: number }): JSX.Element {
  return (
    <div className="flex flex-col gap-1">
      <span className="text-[13px] font-bold text-[var(--cat-ink)]">{value}</span>
      <span className="h-1 w-14 overflow-hidden rounded-full bg-[var(--cat-track)]">
        <span
          className="block h-full rounded-full"
          style={{ width: `${value}%`, background: WARN_COLOR }}
        />
      </span>
    </div>
  )
}

function Warn(): JSX.Element {
  return (
    <span
      className="inline-flex items-center rounded px-1.5 py-0.5 text-[11px] font-bold tracking-wide"
      style={{ color: WARN_COLOR, background: 'rgba(194,112,61,.15)' }}
    >
      WARN
    </span>
  )
}

function Muted({ text }: { text: string }): JSX.Element {
  return <span className="text-[13px] whitespace-nowrap text-[var(--cat-ink-3)]">{text}</span>
}

export function AuditRow({ row }: { row: Row }): JSX.Element {
  const cells: ReactNode[] = [
    <StatusPill key="s" status={row.status} />,
    <TwoLine key="c" main={row.words} sub={row.textRatio} />,
    <Dash key="lcp" />,
    <Dash key="fcp" />,
    <Ttfb key="ttfb" value={row.ttfb} ms={row.ttfbMs} />,
    <Dash key="srv" />,
    <TwoLine key="res" main={row.files} sub={row.size} />,
    <TwoLine key="links" main={row.links} sub={row.intExt} />,
    <AiCell key="ai" value={row.ai} />,
    row.warn ? <Warn key="warn" /> : <Dash key="warn" />,
    <Muted key="crawled" text={row.crawled} />,
  ]
  return (
    <tr className="group cursor-pointer border-t border-[var(--cat-border-soft)] transition-colors first:border-t-0 hover:bg-[var(--cat-hover)]">
      <td className="py-3.5 pr-3 pl-3 align-middle">
        <div className="flex items-start gap-2">
          <ChevronRight
            size={14}
            className="mt-0.5 shrink-0 text-[var(--cat-ink-3)] transition-all group-hover:translate-x-0.5 group-hover:text-[var(--cat-ink)]"
          />
          <div className="min-w-0">
            <div className="text-[13px] font-semibold text-[var(--cat-ink)] group-hover:underline">
              {row.path}
            </div>
            <div className="max-w-[320px] truncate text-[12px] text-[var(--cat-ink-3)]">
              {row.title}
            </div>
          </div>
        </div>
      </td>
      {cells.map((content, i) => (
        <td key={i} className="px-3 py-3.5 align-middle">
          {content}
        </td>
      ))}
    </tr>
  )
}
