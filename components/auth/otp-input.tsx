'use client'

import { useRef, type ClipboardEvent, type KeyboardEvent } from 'react'

import { cn } from '@/lib/utils'

interface OtpInputProps {
  value: string
  onChange: (value: string) => void
  length?: number
  disabled?: boolean
  autoFocus?: boolean
}

/**
 * In-house one-time-code input: `length` single-digit boxes that behave as one
 * field — typing advances, backspace retreats, paste fills across, arrow keys
 * move focus.
 */
export function OtpInput({
  value,
  onChange,
  length = 6,
  disabled = false,
  autoFocus = false,
}: OtpInputProps): JSX.Element {
  const refs = useRef<Array<HTMLInputElement | null>>([])

  const focusAt = (index: number): void => {
    const clamped = Math.min(Math.max(index, 0), length - 1)
    refs.current[clamped]?.focus()
    refs.current[clamped]?.select()
  }

  const setChars = (chars: string[]): void => {
    onChange(chars.join('').slice(0, length))
  }

  const handleChange = (index: number, raw: string): void => {
    const digit = raw.replace(/\D/g, '').slice(-1)
    const chars = value.split('')
    chars[index] = digit
    setChars(chars)
    if (digit && index < length - 1) focusAt(index + 1)
  }

  const handleKeyDown = (index: number, e: KeyboardEvent<HTMLInputElement>): void => {
    if (e.key === 'Backspace') {
      e.preventDefault()
      const chars = value.split('')
      if (chars[index]) {
        chars[index] = ''
        setChars(chars)
      } else if (index > 0) {
        chars[index - 1] = ''
        setChars(chars)
        focusAt(index - 1)
      }
    } else if (e.key === 'ArrowLeft') {
      e.preventDefault()
      focusAt(index - 1)
    } else if (e.key === 'ArrowRight') {
      e.preventDefault()
      focusAt(index + 1)
    }
  }

  const handlePaste = (index: number, e: ClipboardEvent<HTMLInputElement>): void => {
    e.preventDefault()
    const digits = e.clipboardData
      .getData('text')
      .replace(/\D/g, '')
      .slice(0, length - index)
    if (!digits) return
    const chars = value.split('')
    for (let i = 0; i < digits.length; i += 1) chars[index + i] = digits[i]
    setChars(chars)
    focusAt(index + digits.length)
  }

  return (
    <div className="flex items-center justify-between gap-2">
      {Array.from({ length }, (_, i) => (
        <input
          key={i}
          ref={el => {
            refs.current[i] = el
          }}
          type="text"
          inputMode="numeric"
          autoComplete={i === 0 ? 'one-time-code' : 'off'}
          autoFocus={autoFocus && i === 0}
          maxLength={1}
          disabled={disabled}
          value={value[i] ?? ''}
          onChange={e => handleChange(i, e.target.value)}
          onKeyDown={e => handleKeyDown(i, e)}
          onPaste={e => handlePaste(i, e)}
          onFocus={e => e.target.select()}
          className={cn(
            'shadow-input text-foreground h-12 w-11 rounded-md border border-neutral-200 bg-white text-center text-lg font-semibold transition outline-none',
            'focus:border-primary focus:ring-ring/50 focus:ring-2 focus:ring-offset-2 focus:ring-offset-white disabled:opacity-60',
          )}
        />
      ))}
    </div>
  )
}
