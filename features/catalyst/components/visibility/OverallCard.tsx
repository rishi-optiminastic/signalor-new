import { ScoreRing } from '@/features/catalyst/components/visibility/ScoreRing'
import { BRAND, BRAND_SOFT, BRAND_STRONG } from '@/features/catalyst/constants'
import { OVERALL } from '@/features/catalyst/visibility-data'

export function OverallCard(): JSX.Element {
  return (
    <div
      className="flex items-center gap-4 rounded-md border p-4 xl:col-span-2"
      style={{ background: BRAND_SOFT, borderColor: 'rgba(224,74,61,.22)' }}
    >
      <ScoreRing value={OVERALL.score} size={92} stroke={9} color={BRAND}>
        <div>
          <div className="text-[22px] font-bold tracking-tight text-[var(--cat-ink)]">
            {OVERALL.score}
          </div>
          <div className="text-[10px] font-medium text-[var(--cat-ink-3)]">/100</div>
        </div>
      </ScoreRing>
      <div className="min-w-0">
        <div
          className="text-[11px] font-semibold tracking-wide uppercase"
          style={{ color: BRAND_STRONG }}
        >
          Overall Visibility
        </div>
        <div className="mt-0.5 text-[15px] font-semibold text-[var(--cat-ink)]">
          {OVERALL.brand}
        </div>
        <div className="mt-1 text-[12px] text-[var(--cat-ink-3)]">
          {OVERALL.platformsDetected} of {OVERALL.platformsTotal} platforms detected
        </div>
      </div>
    </div>
  )
}
