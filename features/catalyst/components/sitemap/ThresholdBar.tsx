import { GREEN, NEG } from '@/features/catalyst/constants'
import { WARN_COLOR } from '@/features/catalyst/sitemap-data'

const GRADIENT = `linear-gradient(90deg, ${GREEN} 0%, ${GREEN} 33%, ${WARN_COLOR} 40%, ${WARN_COLOR} 60%, ${NEG} 72%, ${NEG} 100%)`

interface ThresholdBarProps {
  marker: number | null
}

/** Core Web Vitals scale: green → amber → red, with a marker at the value. */
export function ThresholdBar({ marker }: ThresholdBarProps): JSX.Element {
  return (
    <div
      className="relative h-2 rounded-full"
      style={{ background: GRADIENT, opacity: marker === null ? 0.45 : 1 }}
    >
      {marker !== null && (
        <span
          className="absolute top-1/2 h-3.5 w-3.5 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-[var(--cat-card)] bg-[var(--cat-ink)] shadow-sm"
          style={{ left: `${marker * 100}%` }}
        />
      )}
    </div>
  )
}
