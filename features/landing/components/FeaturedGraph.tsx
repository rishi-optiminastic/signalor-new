import { Asterisk, Bot, Code2, Compass, Copy, Sparkles } from '@/lib/icons'
import type { LucideIcon } from '@/lib/icons'

interface GraphNode {
  x: number
  y: number
  Icon: LucideIcon
  color: string
}

// AI engines / tools that plug into the MCP endpoint, arranged as a constellation.
const NODES: GraphNode[] = [
  { x: 55, y: 50, Icon: Sparkles, color: '#4285F4' },
  { x: 145, y: 34, Icon: Code2, color: '#18181b' },
  { x: 232, y: 56, Icon: Asterisk, color: '#D97757' },
  { x: 250, y: 114, Icon: Compass, color: '#1FA8A0' },
  { x: 40, y: 118, Icon: Bot, color: '#10A37F' },
]

const EDGES: Array<{ d: string; hi?: boolean }> = [
  { d: 'M55,50 Q100,26 145,34' },
  { d: 'M145,34 Q192,40 232,56' },
  { d: 'M232,56 Q256,82 250,114' },
  { d: 'M55,50 Q32,82 40,118' },
  { d: 'M40,118 Q78,156 140,166', hi: true },
  { d: 'M250,114 Q206,150 140,166' },
]

function NodeChip({ node }: { node: GraphNode }): JSX.Element {
  const { Icon } = node
  return (
    <span
      style={{ left: node.x, top: node.y }}
      className="absolute grid h-9 w-9 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full bg-white shadow-[0_3px_10px_rgba(0,0,0,0.1)] ring-1 ring-black/[0.06]"
    >
      <Icon size={16} strokeWidth={2} style={{ color: node.color }} />
    </span>
  )
}

/** Peec-style MCP network graph: AI-engine nodes wired to the API endpoint. */
export function FeaturedGraph(): JSX.Element {
  return (
    <div className="relative mx-auto mt-2 h-[190px] w-[280px]">
      <svg viewBox="0 0 280 190" fill="none" className="absolute inset-0 h-full w-full">
        {EDGES.map((e, i) => (
          <path
            key={i}
            d={e.d}
            stroke={e.hi ? '#e04a3d' : '#e0e0e4'}
            strokeWidth={e.hi ? 1.75 : 1.25}
            strokeLinecap="round"
          />
        ))}
      </svg>
      {NODES.map((n, i) => (
        <NodeChip key={i} node={n} />
      ))}
      <span className="absolute bottom-0 left-1/2 flex -translate-x-1/2 items-center gap-2 rounded-md border border-[#ececec] bg-white px-2.5 py-1.5 shadow-[0_3px_10px_rgba(0,0,0,0.08)]">
        <span className="font-mono text-[11.5px] text-[#3f3f46]">api.signalor.ai/mcp</span>
        <Copy size={13} className="text-[#a1a1aa]" />
      </span>
    </div>
  )
}
