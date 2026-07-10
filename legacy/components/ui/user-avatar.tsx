'use client'

import { useState } from 'react'

interface UserAvatarProps {
  src?: string | null
  initials: string
  size?: number
  className?: string
}

export function UserAvatar({ src, initials, size = 36, className = '' }: UserAvatarProps) {
  const [imgError, setImgError] = useState(false)
  const showImage = src && !imgError

  return (
    <div
      className={`bg-secondary flex shrink-0 items-center justify-center overflow-hidden rounded-full ${className}`}
      style={{ width: size, height: size }}
    >
      {showImage ? (
        <img
          src={src}
          alt="avatar"
          className="h-full w-full object-cover"
          referrerPolicy="no-referrer"
          onError={() => setImgError(true)}
        />
      ) : (
        <span
          className="text-muted-foreground font-semibold select-none"
          style={{ fontSize: size * 0.35 }}
        >
          {initials}
        </span>
      )}
    </div>
  )
}
