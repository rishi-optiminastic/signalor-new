import { PlatformAnalysis } from '@/features/catalyst/components/visibility/PlatformAnalysis'
import { SignalsSection } from '@/features/catalyst/components/visibility/SignalsSection'
import { VisibilityHeader } from '@/features/catalyst/components/visibility/VisibilityHeader'
import { VisibilityScores } from '@/features/catalyst/components/visibility/VisibilityScores'

export function VisibilityView(): JSX.Element {
  return (
    <>
      <VisibilityHeader />
      <div className="mt-3 flex min-h-0 flex-1 flex-col gap-2 overflow-y-auto pr-0.5">
        <VisibilityScores />
        <SignalsSection />
        <PlatformAnalysis />
      </div>
    </>
  )
}
