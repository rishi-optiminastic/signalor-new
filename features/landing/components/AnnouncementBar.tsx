import { ArrowRight } from 'lucide-react'
import Link from 'next/link'

/** Rounded, contained brand promo banner floating above the nav. */
export function AnnouncementBar(): JSX.Element {
  return (
    <div className="mb-7 px-3 sm:mb-8 sm:px-4">
      <Link
        href="/sign-up"
        className="mx-auto flex w-fit items-center justify-center gap-1.5 rounded-full bg-[#e04a3d] px-5 py-1.5 text-center text-[13px] font-medium text-white shadow-sm transition-opacity hover:opacity-90 sm:py-2 sm:text-sm"
      >
        Start tracking your first 50 prompts for free
        <ArrowRight size={15} strokeWidth={2.4} />
      </Link>
    </div>
  )
}
