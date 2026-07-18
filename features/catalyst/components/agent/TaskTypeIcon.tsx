import type { ReactNode, SVGProps } from 'react'

import type { TaskType } from '@/features/catalyst/tasks-data'

/**
 * Hand-drawn glyphs for task types — no icon library. Follows the SignalorAI
 * icon family style: 24-grid, 2px round strokes on currentColor, one filled
 * accent dot where it reinforces meaning. Add a glyph here when a new
 * TaskType is added in tasks-data.ts.
 */

function dot(cx: number, cy: number, r = 1): ReactNode {
  return <circle cx={cx} cy={cy} r={r} fill="currentColor" stroke="none" />
}

const GLYPHS: Record<TaskType, ReactNode> = {
  // A document with a plus — create a new page.
  page: (
    <>
      <path d="M14 3H6a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z" />
      <path d="M14 3v6h6" />
      <path d="M12 12.5v5" />
      <path d="M9.5 15h5" />
    </>
  ),
  // A pen finishing a line — writing work.
  content: (
    <>
      <path d="M12 20h9" />
      <path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4Z" />
    </>
  ),
  // The Reddit mascot: antenna, face, eyes (the accent dots) and a smile.
  reddit: (
    <>
      <path d="M20 14.5c0 3-3.6 5.5-8 5.5s-8-2.5-8-5.5S7.6 9 12 9s8 2.5 8 5.5Z" />
      <path d="M12 9l1.2-4.5L17 5.5" />
      {dot(17.6, 5.9, 1.2)}
      {dot(9, 14, 1.2)}
      {dot(15, 14, 1.2)}
      <path d="M9.2 17c1.6 1.2 4 1.2 5.6 0" />
    </>
  ),
  // Curly braces around a value — structured data.
  schema: (
    <>
      <path d="M8 4H7a2 2 0 0 0-2 2v3.5C5 10.9 4.1 12 3 12c1.1 0 2 1.1 2 2.5V18a2 2 0 0 0 2 2h1" />
      <path d="M16 4h1a2 2 0 0 1 2 2v3.5c0 1.4.9 2.5 2 2.5-1.1 0-2 1.1-2 2.5V18a2 2 0 0 1-2 2h-1" />
      {dot(12, 12, 1.1)}
    </>
  ),
  // Code brackets — technical / under-the-hood fixes.
  technical: (
    <>
      <path d="M17 8l4 4-4 4" />
      <path d="M7 8l-4 4 4 4" />
      {dot(12, 12, 1.1)}
    </>
  ),
  // A chain link — off-page authority (backlinks, mentions, citations).
  authority: (
    <>
      <path d="M10 13a5 5 0 0 0 7.5.5l3-3a5 5 0 0 0-7-7l-1.7 1.7" />
      <path d="M14 11a5 5 0 0 0-7.5-.5l-3 3a5 5 0 0 0 7 7l1.7-1.7" />
    </>
  ),
  // A signal ring with a centre dot — the fallback.
  general: (
    <>
      <circle cx="12" cy="12" r="8.5" />
      {dot(12, 12, 1.5)}
    </>
  ),
}

interface TaskTypeIconProps extends SVGProps<SVGSVGElement> {
  type: TaskType
  size?: number
}

export function TaskTypeIcon({ type, size = 16, ...props }: TaskTypeIconProps): JSX.Element {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
      {...props}
    >
      {GLYPHS[type]}
    </svg>
  )
}
