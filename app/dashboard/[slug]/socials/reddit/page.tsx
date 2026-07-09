import { CatalystShell } from '@/features/catalyst/components/CatalystShell'
import { RedditRoadmapView } from '@/features/catalyst/components/socials/RedditRoadmapView'

export default function RedditPage(): JSX.Element {
  return (
    <CatalystShell>
      <RedditRoadmapView />
    </CatalystShell>
  )
}
