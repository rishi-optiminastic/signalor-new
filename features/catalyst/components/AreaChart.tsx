import { BRAND } from '@/features/catalyst/constants'

export function AreaChart(): JSX.Element {
  return (
    <svg viewBox="0 0 340 90" preserveAspectRatio="none" className="h-20 w-full">
      <defs>
        <linearGradient id="cv" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={BRAND} stopOpacity="0.35" />
          <stop offset="1" stopColor={BRAND} stopOpacity="0" />
        </linearGradient>
        <linearGradient id="cv2" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={BRAND} stopOpacity="0.12" />
          <stop offset="1" stopColor={BRAND} stopOpacity="0" />
        </linearGradient>
      </defs>
      <path
        d="M0,72 L57,60 L113,66 L170,44 L226,74 L283,18 L340,40 L340,90 L0,90 Z"
        fill="url(#cv2)"
      />
      <path
        d="M0,80 L57,70 L113,74 L170,58 L226,80 L283,40 L340,58 L340,90 L0,90 Z"
        fill="url(#cv)"
      />
      <polyline
        points="0,80 57,70 113,74 170,58 226,80 283,40 340,58"
        fill="none"
        stroke={BRAND}
        strokeWidth={2}
      />
    </svg>
  )
}
