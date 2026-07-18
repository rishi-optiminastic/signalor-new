'use client'

import { CheckCircle2, Loader2 } from 'lucide-react'
import Link from 'next/link'
import { useState } from 'react'

import { CallbackPanel } from '@/features/integrations/components/CallbackPanel'
import { GAPropertyPicker } from '@/features/integrations/components/GAPropertyPicker'
import { useSession } from '@/lib/auth-client'
import { routes } from '@/lib/routes'

/**
 * Change which GA4 property this brand reads from, without reconnecting.
 *
 * Tokens are already stored after the OAuth connect, so the picker can list and
 * re-select properties directly — no second trip through Google. This is what
 * lets a user who picked the wrong property (or wants a different one — "the pick
 * post" instead of "SignalorAI") switch it.
 */
function ChangeProperty(): JSX.Element {
  const { data: session } = useSession()
  const email = session?.user?.email
  const [done, setDone] = useState(false)

  if (done) {
    return (
      <CallbackPanel
        title="Property connected"
        icon={<CheckCircle2 className="h-6 w-6 text-[#047857]" />}
      >
        <p className="flex items-center justify-center gap-1.5 text-[13px] text-neutral-500">
          <Loader2 className="h-3.5 w-3.5 animate-spin" />
          First sync in progress — usually 1&ndash;2 minutes.
        </p>
        <p className="mt-1.5 text-[12px] text-neutral-400">
          You can head to the dashboard now; the analytics cards fill in automatically as data
          lands.
        </p>
        <Link
          href={routes.dashboard}
          className="auth-cta-btn mt-4 inline-flex h-9 items-center rounded-md px-4 text-[13px] font-medium text-white"
        >
          Go to dashboard
        </Link>
      </CallbackPanel>
    )
  }

  if (!email) {
    return (
      <CallbackPanel title="Choose a GA4 property">
        <p className="text-[13px] text-neutral-500">Sign in to change your GA4 property.</p>
      </CallbackPanel>
    )
  }

  return (
    <CallbackPanel title="Choose a GA4 property">
      <GAPropertyPicker email={email} onDone={() => setDone(true)} />
    </CallbackPanel>
  )
}

export default function ChangePropertyPage(): JSX.Element {
  return <ChangeProperty />
}
