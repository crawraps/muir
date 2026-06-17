import type { PercentString } from '../model/properties'

/**
 * Resolves a stop or origin value to a percentage (0–100) of the min/max range.
 */
export function toPercent(value: number | PercentString, min: number, max: number): number {
  if (typeof value === 'string' && value.endsWith('%')) {
    return Number.parseFloat(value)
  }
  const num = typeof value === 'number' ? value : Number.parseFloat(value)
  return ((num - min) / (max - min)) * 100
}

/**
 * Snaps a percentage to the nearest stop, if stops are defined.
 */
export function snapToStop(pct: number, stops: (number | PercentString)[] | undefined, min: number, max: number): number {
  if (!stops || stops.length === 0) return pct
  const stopPcts = stops.map(s => toPercent(s, min, max))
  let nearest = stopPcts[0]
  let minDelta = Math.abs(pct - stopPcts[0])
  for (let i = 1; i < stopPcts.length; i++) {
    const delta = Math.abs(pct - stopPcts[i])
    if (delta < minDelta) {
      minDelta = delta
      nearest = stopPcts[i]
    }
  }
  return nearest
}

export interface Segment {
  start: number
  end: number
  length: number
  active: boolean
}

/**
 * Build the list of track segments between key points (origin, stops, value).
 */
export function buildSegments(originPct: number, valuePct: number, stops: (number | PercentString)[] | undefined, min: number, max: number): Segment[] {
  const pointSet = new Set<number>()
  pointSet.add(0)
  if (stops) {
    for (const stop of stops) {
      const pct = toPercent(stop, min, max)
      if (pct > 0 && pct < 100) pointSet.add(pct)
    }
  }
  pointSet.add(originPct)
  pointSet.add(valuePct)
  pointSet.add(100)

  const uniquePoints = Array.from(pointSet).sort((a, b) => a - b)

  const isFillRange = (start: number, end: number): boolean => {
    if (valuePct >= originPct) {
      return start >= originPct && end <= valuePct
    }
    return start >= valuePct && end <= originPct
  }

  return uniquePoints.slice(0, -1).reduce<Segment[]>((acc, start, i) => {
    const end = uniquePoints[i + 1]
    const length = end - start
    if (length > 0) {
      acc.push({ start, end, length, active: isFillRange(start, end) })
    }
    return acc
  }, [])
}
