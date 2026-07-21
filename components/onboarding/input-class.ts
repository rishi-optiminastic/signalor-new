/**
 * Shared text-input style for the onboarding wizard steps.
 *
 * Focus is a soft 3px brand tint that hugs the border — no `ring-offset`, which
 * previously pushed a heavy red halo outward far enough to crowd the field label.
 */
export const ONBOARDING_INPUT_CLASS =
  'shadow-input h-[38px] w-full rounded-md border border-neutral-200 bg-white px-3 ' +
  'text-[13px] text-foreground outline-none transition placeholder:text-muted-foreground/55 ' +
  'focus:border-primary focus:ring-[3px] focus:ring-primary/20 disabled:opacity-60'
