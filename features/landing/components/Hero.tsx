import { AnnouncementBar } from '@/features/landing/components/AnnouncementBar'
import { Sparkle } from '@/features/landing/components/Sparkle'

function SparkleBadge(): JSX.Element {
  return (
    <span className="mx-1 inline-flex items-center justify-center align-middle">
      <Sparkle size={34} className="text-[#e04a3d] sm:size-[46px]" />
    </span>
  )
}

export function Hero(): JSX.Element {
  return (
    <section className="mx-auto flex min-h-[calc(100svh-100px)] max-w-4xl flex-col items-center justify-center px-6 pb-16 text-center">
      <AnnouncementBar />
      <h1 className="text-[38px] leading-[1.06] font-semibold tracking-tight text-[#141414] sm:text-[58px]">
        The{' '}
        <span className="text-[#e04a3d] underline decoration-[#e04a3d]/45 decoration-dotted decoration-2 underline-offset-[10px]">
          growth
        </span>{' '}
        engine for your AI Search
        <SparkleBadge />
        visibility
      </h1>
      <p className="mx-auto mt-7 max-w-xl text-[17px] leading-relaxed text-[#6b6b6b]">
        Track and optimize visibility in ChatGPT, Gemini and other AI Search engines to drive
        traffic to your website that converts.
      </p>
    </section>
  )
}
