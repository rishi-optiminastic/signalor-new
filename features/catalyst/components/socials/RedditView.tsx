'use client'

import { RedditStepAccount } from '@/features/catalyst/components/socials/onboarding/RedditStepAccount'
import { RedditStepReady } from '@/features/catalyst/components/socials/onboarding/RedditStepReady'
import { RedditStepStats } from '@/features/catalyst/components/socials/onboarding/RedditStepStats'
import { RedditStepUsername } from '@/features/catalyst/components/socials/onboarding/RedditStepUsername'
import { RedditRoadmapView } from '@/features/catalyst/components/socials/RedditRoadmapView'
import { useRedditOnboarding } from '@/features/catalyst/hooks/useRedditOnboarding'

/**
 * First-time visitors get the 4-step onboarding wizard; once completed (flagged
 * in localStorage) the page shows the roadmap dashboard directly.
 */
export function RedditView(): JSX.Element | null {
  const ob = useRedditOnboarding()

  if (!ob.ready) return null // brief: waiting on localStorage
  if (ob.done) return <RedditRoadmapView />

  if (ob.step === 'account') return <RedditStepAccount onNext={() => ob.goTo('username')} />
  if (ob.step === 'username') {
    return (
      <RedditStepUsername
        value={ob.profile.username}
        onChange={v => ob.setField('username', v)}
        onBack={() => ob.goTo('account')}
        onNext={() => ob.goTo('stats')}
      />
    )
  }
  if (ob.step === 'stats') {
    return (
      <RedditStepStats
        profile={ob.profile}
        setField={ob.setField}
        onBack={() => ob.goTo('username')}
        onNext={() => ob.goTo('ready')}
      />
    )
  }
  return <RedditStepReady onLaunch={ob.finish} />
}
