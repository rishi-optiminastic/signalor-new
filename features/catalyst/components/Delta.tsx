import { ArrowDownRight, ArrowUpRight } from 'lucide-react'
import type { ReactNode } from 'react'

import { GREEN, NEG } from '@/features/catalyst/constants'

interface DeltaProps {
  positive: boolean
  children: ReactNode
}

export function Delta({ positive, children }: DeltaProps): JSX.Element {
  const Icon = positive ? ArrowUpRight : ArrowDownRight
  return (
    <span
      className="inline-flex items-center gap-0.5 text-xs font-semibold"
      style={{ color: positive ? GREEN : NEG }}
    >
      <Icon size={12} strokeWidth={2.4} />
      {children}
    </span>
  )
}
