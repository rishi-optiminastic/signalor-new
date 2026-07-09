'use client'

const VIEW_W = 1200
const VIEW_H = 480
const HUB = { x: 600, y: 250 }

// Fan of beam endpoints on the left and right edges
const LEFT_ENDS = [10, 60, 110, 160, 210, 260, 310, 360, 410, 460]
const RIGHT_ENDS = [10, 60, 110, 160, 210, 260, 310, 360, 410, 460]

function beamPath(endX: number, endY: number): string {
  // Curve from the hub outward, flattening toward the edge
  const c1x = HUB.x + (endX - HUB.x) * 0.45
  const c2x = HUB.x + (endX - HUB.x) * 0.75
  return `M ${HUB.x} ${HUB.y} C ${c1x} ${HUB.y}, ${c2x} ${endY}, ${endX} ${endY}`
}

interface IconSpec {
  src: string
  name: string
  x: number
  y: number
  size: 'lg' | 'md'
}

const ICONS: IconSpec[] = [
  // Left arc — platforms & analytics
  { src: '/logos/shopify.svg', name: 'Shopify', x: 175, y: 95, size: 'lg' },
  { src: '/logos/google-analytics.svg', name: 'Google Analytics', x: 285, y: 250, size: 'md' },
  { src: '/logos/wordpress.svg', name: 'WordPress', x: 110, y: 385, size: 'lg' },
  { src: '/logos/search-console.svg', name: 'Search Console', x: 70, y: 210, size: 'md' },
  { src: '/logos/slack.svg', name: 'Slack', x: 330, y: 415, size: 'md' },
  // Right arc — AI search engines
  { src: '/logos/chatgpt.svg', name: 'ChatGPT', x: 1055, y: 90, size: 'md' },
  { src: '/logos/gemini.svg', name: 'Gemini', x: 975, y: 250, size: 'lg' },
  { src: '/logos/perplexity.svg', name: 'Perplexity', x: 920, y: 385, size: 'md' },
  { src: '/logos/claude.svg', name: 'Claude', x: 1110, y: 320, size: 'md' },
  { src: '/logos/webflow.svg', name: 'Webflow', x: 905, y: 130, size: 'md' },
]

// Paths that carry an animated pulse traveling into the hub
const PULSE_TARGETS = [
  { x: 0, y: 60, dur: 3.2, delay: 0 },
  { x: 0, y: 310, dur: 3.8, delay: 1.1 },
  { x: 1200, y: 110, dur: 3.5, delay: 0.6 },
  { x: 1200, y: 360, dur: 4.1, delay: 1.8 },
]

function BeamField(): JSX.Element {
  return (
    <svg
      viewBox={`0 0 ${VIEW_W} ${VIEW_H}`}
      fill="none"
      className="absolute inset-0 h-full w-full"
      role="presentation"
    >
      <defs>
        <linearGradient id="beam-fade-l" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="var(--color-primary)" stopOpacity="0.05" />
          <stop offset="100%" stopColor="var(--color-primary)" stopOpacity="0.45" />
        </linearGradient>
        <linearGradient id="beam-fade-r" x1="1" y1="0" x2="0" y2="0">
          <stop offset="0%" stopColor="var(--color-primary)" stopOpacity="0.05" />
          <stop offset="100%" stopColor="var(--color-primary)" stopOpacity="0.45" />
        </linearGradient>
      </defs>

      {LEFT_ENDS.map(y => (
        <path key={`l-${y}`} d={beamPath(0, y)} stroke="url(#beam-fade-l)" strokeWidth="1.1" />
      ))}
      {RIGHT_ENDS.map(y => (
        <path key={`r-${y}`} d={beamPath(VIEW_W, y)} stroke="url(#beam-fade-r)" strokeWidth="1.1" />
      ))}
      <BeamPulses />
    </svg>
  )
}

function BeamPulses(): JSX.Element {
  return (
    <>
      {PULSE_TARGETS.map((t, i) => (
        <circle key={i} r="3.5" fill="var(--color-primary)" opacity="0.9">
          <animateMotion
            dur={`${t.dur}s`}
            begin={`${t.delay}s`}
            repeatCount="indefinite"
            keyPoints="1;0"
            keyTimes="0;1"
            calcMode="linear"
            path={beamPath(t.x, t.y)}
          />
          <animate
            attributeName="opacity"
            values="0;0.9;0.9;0"
            keyTimes="0;0.15;0.85;1"
            dur={`${t.dur}s`}
            begin={`${t.delay}s`}
            repeatCount="indefinite"
          />
        </circle>
      ))}
    </>
  )
}

function FloatingIcon({ icon }: { icon: IconSpec }): JSX.Element {
  const lg = icon.size === 'lg'
  return (
    <div
      className="animate-float absolute -translate-x-1/2 -translate-y-1/2"
      style={{
        left: `${(icon.x / VIEW_W) * 100}%`,
        top: `${(icon.y / VIEW_H) * 100}%`,
        animationDelay: `${(icon.x % 7) * 0.35}s`,
      }}
    >
      <div
        className={`bg-card shadow-foreground/5 flex items-center justify-center rounded-lg shadow-lg ${
          lg ? 'h-14 w-14 md:h-16 md:w-16' : 'h-11 w-11 md:h-13 md:w-13'
        }`}
      >
        <img
          src={icon.src}
          alt={icon.name}
          className={lg ? 'h-7 w-7 md:h-8 md:w-8' : 'h-5 w-5 md:h-6 md:w-6'}
        />
      </div>
    </div>
  )
}

function CentralHub(): JSX.Element {
  return (
    <div
      className="absolute -translate-x-1/2 -translate-y-1/2"
      style={{ left: `${(HUB.x / VIEW_W) * 100}%`, top: `${(HUB.y / VIEW_H) * 100}%` }}
    >
      <div className="bg-card shadow-primary/20 relative flex h-14 w-14 items-center justify-center rounded-lg shadow-xl md:h-16 md:w-16">
        <span className="bg-primary animate-hub-pulse absolute inset-0 rounded-lg opacity-20" />
        <img src="/icon%20copy.svg" alt="Signalor" className="relative h-10 w-10 md:h-12 md:w-12" />
      </div>
    </div>
  )
}

export function IntegrationBeams(): JSX.Element {
  return (
    <div className="relative mx-auto w-full max-w-6xl" aria-hidden="true">
      <div className="relative w-full" style={{ aspectRatio: `${VIEW_W} / ${VIEW_H}` }}>
        <BeamField />
        {ICONS.map(icon => (
          <FloatingIcon key={icon.name} icon={icon} />
        ))}
        <CentralHub />
      </div>
    </div>
  )
}
