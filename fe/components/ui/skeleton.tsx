import { cn } from '@fe/lib/utils'

/**
 * Base skeleton primitive, a muted rectangle with a left-to-right shimmer
 * sweep. Compose these into page-level skeletons that mirror the actual UI.
 *
 * The shimmer keyframe (`shimmer`) and `.shimmer` utility already live in
 * globals.css so no additional CSS is needed here.
 */
function Skeleton({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="skeleton"
      className={cn('bg-muted relative overflow-hidden rounded-md', className)}
      {...props}
    >
      <div
        aria-hidden
        className="shimmer absolute inset-0 bg-gradient-to-r from-transparent via-white/60 to-transparent"
      />
    </div>
  )
}

export { Skeleton }
