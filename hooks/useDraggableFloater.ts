'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import type { CSSProperties, PointerEvent as ReactPointerEvent, RefObject } from 'react'

/** Pointer travel (px) before a press counts as a drag rather than a click. */
const DRAG_THRESHOLD = 4
/** Keep at least this much of a gap between the floater and the viewport edge. */
const EDGE_MARGIN = 8

export interface FloaterPoint {
  x: number
  y: number
}

interface DragOrigin {
  pointerX: number
  pointerY: number
  left: number
  top: number
  width: number
  height: number
}

/** What a drag handle needs; pass this down to whichever element grabs. */
export interface DragHandle {
  dragging: boolean
  /** Attach to whatever acts as the drag handle. */
  startDrag: (e: ReactPointerEvent) => void
}

/**
 * Swallow the synthetic click that browsers fire after a drag, so a handle that
 * is also a button (the collapsed pill) does not activate on drop. The listener
 * is torn down on the next tick - click follows pointerup in the same task, so
 * it can never linger and eat an unrelated click.
 */
function swallowNextClick(): void {
  const swallow = (e: MouseEvent): void => {
    e.stopPropagation()
    e.preventDefault()
  }
  window.addEventListener('click', swallow, { capture: true, once: true })
  window.setTimeout(() => window.removeEventListener('click', swallow, { capture: true }), 0)
}

export interface DraggableFloater extends DragHandle {
  /** Callback ref for the positioned wrapper: `<div ref={drag.setContainer}>`.
   *  State-backed so effects re-run once the element actually mounts. */
  setContainer: (el: HTMLDivElement | null) => void
  /** `left`/`top` once moved; undefined while parked at its CSS default. */
  style: CSSProperties | undefined
}

function readStored(key: string): FloaterPoint | null {
  if (typeof window === 'undefined') return null
  try {
    const raw = window.localStorage.getItem(key)
    if (!raw) return null
    const parsed = JSON.parse(raw) as Partial<FloaterPoint>
    if (typeof parsed.x !== 'number' || typeof parsed.y !== 'number') return null
    return { x: parsed.x, y: parsed.y }
  } catch {
    return null
  }
}

function writeStored(key: string, point: FloaterPoint): void {
  try {
    window.localStorage.setItem(key, JSON.stringify(point))
  } catch {
    /* storage disabled - position just won't persist */
  }
}

function clampToViewport(point: FloaterPoint, width: number, height: number): FloaterPoint {
  const maxX = Math.max(EDGE_MARGIN, window.innerWidth - width - EDGE_MARGIN)
  const maxY = Math.max(EDGE_MARGIN, window.innerHeight - height - EDGE_MARGIN)
  return {
    x: Math.min(Math.max(point.x, EDGE_MARGIN), maxX),
    y: Math.min(Math.max(point.y, EDGE_MARGIN), maxY),
  }
}

interface DragMoveArgs {
  dragging: boolean
  origin: RefObject<DragOrigin | null>
  moved: RefObject<boolean>
  apply: (point: FloaterPoint) => void
  onEnd: () => void
}

/** Window-level pointer tracking, live only while a drag is in progress. */
function useDragMove({ dragging, origin, moved, apply, onEnd }: DragMoveArgs): void {
  useEffect(() => {
    if (!dragging) return
    const onMove = (e: PointerEvent): void => {
      const o = origin.current
      if (!o) return
      const dx = e.clientX - o.pointerX
      const dy = e.clientY - o.pointerY
      if (Math.abs(dx) > DRAG_THRESHOLD || Math.abs(dy) > DRAG_THRESHOLD) moved.current = true
      apply(clampToViewport({ x: o.left + dx, y: o.top + dy }, o.width, o.height))
    }
    window.addEventListener('pointermove', onMove)
    window.addEventListener('pointerup', onEnd)
    window.addEventListener('pointercancel', onEnd)
    return () => {
      window.removeEventListener('pointermove', onMove)
      window.removeEventListener('pointerup', onEnd)
      window.removeEventListener('pointercancel', onEnd)
    }
  }, [dragging, origin, moved, apply, onEnd])
}

/**
 * Re-clamp whenever the viewport or the floater itself resizes, so expanding
 * the card (or shrinking the window) can never strand it off-screen.
 */
function useKeepInViewport(
  el: HTMLDivElement | null,
  posRef: RefObject<FloaterPoint | null>,
  apply: (point: FloaterPoint) => void,
): void {
  useEffect(() => {
    if (!el) return
    const clampNow = (): void => {
      const current = posRef.current
      if (!current) return
      const rect = el.getBoundingClientRect()
      const next = clampToViewport(current, rect.width, rect.height)
      if (next.x !== current.x || next.y !== current.y) apply(next)
    }
    const observer = new ResizeObserver(clampNow)
    observer.observe(el)
    window.addEventListener('resize', clampNow)
    return () => {
      observer.disconnect()
      window.removeEventListener('resize', clampNow)
    }
  }, [el, posRef, apply])
}

/**
 * Makes a fixed-position floater draggable by a handle. The position is stored
 * as viewport `left`/`top`, clamped to stay on screen, and persisted so it
 * stays where the user parked it across reloads.
 *
 * Attach via the returned `setContainer` callback ref. It is state-backed on
 * purpose: the floater renders `null` on its first pass, so an effect keyed on
 * a plain ref would run before the element exists and never re-run.
 */
export function useDraggableFloater(storageKey: string): DraggableFloater {
  const [container, setContainer] = useState<HTMLDivElement | null>(null)
  const origin = useRef<DragOrigin | null>(null)
  const moved = useRef(false)
  const posRef = useRef<FloaterPoint | null>(null)
  const [pos, setPos] = useState<FloaterPoint | null>(() => readStored(storageKey))
  const [dragging, setDragging] = useState(false)

  useEffect(() => {
    posRef.current = pos
  }, [pos])

  const apply = useCallback((point: FloaterPoint): void => {
    posRef.current = point
    setPos(point)
  }, [])

  const onEnd = useCallback((): void => {
    setDragging(false)
    origin.current = null
    if (posRef.current) writeStored(storageKey, posRef.current)
    if (moved.current) swallowNextClick()
  }, [storageKey])

  const startDrag = useCallback(
    (e: ReactPointerEvent): void => {
      if (!container || e.button !== 0) return
      const rect = container.getBoundingClientRect()
      origin.current = {
        pointerX: e.clientX,
        pointerY: e.clientY,
        left: rect.left,
        top: rect.top,
        width: rect.width,
        height: rect.height,
      }
      moved.current = false
      setDragging(true)
    },
    [container],
  )

  useDragMove({ dragging, origin, moved, apply, onEnd })
  useKeepInViewport(container, posRef, apply)

  return {
    setContainer,
    style: pos ? { left: pos.x, top: pos.y, right: 'auto', bottom: 'auto' } : undefined,
    dragging,
    startDrag,
  }
}
