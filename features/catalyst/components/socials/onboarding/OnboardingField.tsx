interface OnboardingFieldProps {
  label: string
  value: string
  onChange: (value: string) => void
  type?: 'text' | 'number'
  inputMode?: 'text' | 'numeric'
  placeholder?: string
  /** Static adornment shown inside the input's left edge, e.g. `u/`. */
  prefix?: string
  error?: string
  hint?: string
}

export function OnboardingField({
  label,
  value,
  onChange,
  type = 'text',
  inputMode,
  placeholder,
  prefix,
  error,
  hint,
}: OnboardingFieldProps): JSX.Element {
  return (
    <label className="block">
      <span className="text-[12px] font-semibold text-[var(--cat-ink-2)]">{label}</span>
      <div
        className={`mt-1.5 flex items-center rounded-md border bg-[var(--cat-card)] px-3 ${
          error ? 'border-[#e04a3d]' : 'border-[var(--cat-border)]'
        }`}
      >
        {prefix && <span className="text-[13px] text-[var(--cat-ink-3)]">{prefix}</span>}
        <input
          type={type}
          inputMode={inputMode}
          value={value}
          placeholder={placeholder}
          onChange={e => onChange(e.target.value)}
          className="h-[36px] w-full bg-transparent text-[13px] text-[var(--cat-ink)] outline-none placeholder:text-[var(--cat-ink-3)]"
        />
      </div>
      {error ? (
        <span className="mt-1 block text-[11.5px] font-medium text-[#e04a3d]">{error}</span>
      ) : (
        hint && <span className="mt-1 block text-[11.5px] text-[var(--cat-ink-3)]">{hint}</span>
      )}
    </label>
  )
}
