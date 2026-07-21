'use client'

/**
 * Renders an AI engine answer with its original structure — headings, bullets and
 * `**bold**` runs.
 *
 * Deliberately builds React elements rather than HTML: the text is model output
 * relayed through our API, so `dangerouslySetInnerHTML` (even via `marked`) would
 * be an injection vector. Everything here is escaped by React automatically.
 */

const HEADING_RE = /^#{1,6}\s+/
const BULLET_RE = /^[-*]\s+/

/** Splits on `**bold**`; with a capture group, odd indices are the bold runs. */
function InlineBold({ text }: { text: string }): JSX.Element {
  const parts = text.split(/\*\*(.+?)\*\*/g)
  return (
    <>
      {parts.map((part, i) =>
        i % 2 === 1 ? (
          <strong key={i} className="font-semibold text-[var(--cat-ink)]">
            {part}
          </strong>
        ) : (
          <span key={i}>{part}</span>
        ),
      )}
    </>
  )
}

export function ResponseText({ text }: { text: string }): JSX.Element {
  const lines = text.split('\n').filter(l => l.trim().length > 0)
  return (
    <div className="space-y-1.5">
      {lines.map((line, i) => {
        const trimmed = line.trim()
        if (HEADING_RE.test(trimmed)) {
          return (
            <p key={i} className="text-[12px] font-semibold text-[var(--cat-ink)]">
              {trimmed.replace(HEADING_RE, '')}
            </p>
          )
        }
        const isBullet = BULLET_RE.test(trimmed)
        return (
          <p
            key={i}
            className={`text-[12px] leading-relaxed text-[var(--cat-ink-2)] ${isBullet ? 'pl-3' : ''}`}
          >
            {isBullet && <span className="text-[var(--cat-ink-3)]">• </span>}
            <InlineBold text={trimmed.replace(BULLET_RE, '')} />
          </p>
        )
      })}
    </div>
  )
}
