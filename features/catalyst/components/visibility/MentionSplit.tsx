import { ScoreRing } from '@/features/catalyst/components/visibility/ScoreRing'
import { SIGNALS_META } from '@/features/catalyst/visibility-data'

export function MentionSplit(): JSX.Element {
  return (
    <div className="flex flex-col">
      <div className="mb-3 text-[12px] font-semibold tracking-wide text-[var(--cat-ink-3)] uppercase">
        Mention Split
      </div>
      <div className="grid flex-1 place-items-center">
        <ScoreRing value={68} size={150} stroke={16}>
          <div>
            <div className="text-[26px] font-bold text-[var(--cat-ink)]">
              {SIGNALS_META.mentions}
            </div>
            <div className="text-[11px] text-[var(--cat-ink-3)]">mentions</div>
          </div>
        </ScoreRing>
      </div>
    </div>
  )
}
