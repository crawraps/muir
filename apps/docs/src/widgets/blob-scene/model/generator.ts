/**
 * Procedural blob SVG-path generator.
 *
 * Faithful TypeScript port of the original algorithm. Given the
 * same configuration the generator produces a cubic-Bézier loop
 * suitable for assignment to a `<path>`'s `d` attribute.
 *
 * @module
 */

import type { BlobConfig } from './properties'

/** Result of a single generation call. */
interface GenerateBlobResult {
  path: string
  cx: number
  cy: number
}

const PI = Math.PI

function f1(t: number, b: number): number {
  return Math.sin(4 * (t + PI / b))
}

function f2(t: number, a: number): number {
  return Math.cos(2 * (t + PI / a))
}

function f3(t: number, a: number, b: number): number {
  return 0.5 * Math.sin(2 * (t + PI / b)) - 0.5 * Math.cos(4 * (t - (2 * PI) / b / a))
}

function g(t: number, a: number, b: number, c: number): number {
  return Math.abs(f1(t + c, b)) + Math.abs(f2(t + 2 * c, a)) + Math.abs(f3(t + 3 * c, a, b)) + 0.0001
}

function h(t: number, a: number, b: number, c: number): number {
  return Math.abs(f1(t + 3 * c, b)) + Math.abs(f2(t + c, a)) + Math.abs(f3(t + 2 * c, a, b)) + 1
}

function random(min: number, max: number): number {
  return Math.random() * (max - min) + min
}

function convertBezierProper(xCoords: number[], yCoords: number[], initHandleX: number, initHandleY: number): [number[], number[]] {
  const properX: number[] = []
  const properY: number[] = []

  properX.push(xCoords[xCoords.length - 1])
  properX.push(2 * xCoords[xCoords.length - 1] - initHandleX)
  properX.push(xCoords[0])
  properX.push(xCoords[1])

  properY.push(yCoords[yCoords.length - 1])
  properY.push(2 * yCoords[yCoords.length - 1] - initHandleY)
  properY.push(yCoords[0])
  properY.push(yCoords[1])

  for (let i = 2; i < xCoords.length - 2; i += 2) {
    properX.push(2 * xCoords[i - 1] - xCoords[i - 2])
    properX.push(xCoords[i])
    properX.push(xCoords[i + 1])

    properY.push(2 * yCoords[i - 1] - yCoords[i - 2])
    properY.push(yCoords[i])
    properY.push(yCoords[i + 1])
  }

  properX.push(2 * xCoords[xCoords.length - 3] - xCoords[xCoords.length - 4])
  properX.push(initHandleX)
  properX.push(xCoords[xCoords.length - 1])

  properY.push(2 * yCoords[yCoords.length - 3] - yCoords[yCoords.length - 4])
  properY.push(initHandleY)
  properY.push(yCoords[yCoords.length - 1])

  return [properX, properY]
}

function isSmooth(properX: number[], properY: number[]): boolean {
  for (let i = 0; i < properX.length - 3; i += 3) {
    const x2 = properX[i + 1]
    const x3 = properX[i + 2]
    const x4 = properX[i + 3]

    const y2 = properY[i + 1]
    const y3 = properY[i + 2]
    const y4 = properY[i + 3]

    const f32 = y3 / y2
    const f42 = y4 / y2

    const canonicalX = (x4 - x2 * f42) / (x3 - x2 * f32)
    const canonicalY = f42 + (1 - f32) * canonicalX

    if (canonicalY >= 1) {
      continue
    }

    if (canonicalX >= 1) {
      continue
    }

    if (canonicalX <= 0) {
      if (canonicalY < (3 * canonicalX - canonicalX ** 2) / 3) {
        continue
      }
      return false
    }

    if (canonicalY < ((12 * canonicalX - 3 * canonicalX ** 2) ** 0.5 - canonicalX) / 2) {
      continue
    }
    return false
  }

  return true
}

/**
 * Generates a procedural blob SVG path.
 *
 * Each call produces a new shape using `Math.random()` for the
 * radius parameters, unless `a`, `b`, or `c` are provided in
 * the config to override them.
 */
export function createBlob(config: BlobConfig = {}): GenerateBlobResult {
  const rawPoints = config.points ?? 10
  const gScale = config.gScale ?? 60
  const hScale = config.hScale ?? 30
  const cx = config.cx ?? 500
  const cy = config.cy ?? 220
  let enforceSmooth = config.enforceSmooth ?? true

  // For large values of points the smoothing isn't noticeable
  // and takes very long to complete
  if (rawPoints > 12) {
    enforceSmooth = false
  }

  // Round to nearest even integer — the algorithm alternates two
  // radius functions and requires an even count to close the loop.
  const numPoints = Math.round(rawPoints / 2) * 2

  const a = config.a ?? random(0.1, 0.7)
  const b = config.b ?? random(0.1, 0.7)
  const c = config.c ?? random(0, 2 * PI)

  // Thetas
  const points: number[] = []
  const intervalSize = (2 * PI) / numPoints

  for (let i = 0; i < numPoints; i++) {
    points.push(random(intervalSize * i, intervalSize * (i + 1)))
  }

  // Radius for thetas
  const rPoints: number[] = []

  for (let i = 0; i < numPoints; i++) {
    if (i % 2 === 0) {
      rPoints.push(hScale * h(points[i], a, b, c))
    } else {
      rPoints.push(gScale * g(points[i], a, b, c))
    }
  }

  // Cartesian coords
  const xCoords: number[] = []
  const yCoords: number[] = []

  for (let i = 0; i < numPoints; i++) {
    xCoords.push(rPoints[i] * Math.cos(points[i]))
    yCoords.push(rPoints[i] * Math.sin(points[i]))
  }

  const initHandlePoint = random(2 * (PI - intervalSize), 2 * PI - intervalSize)
  const initHandle = hScale * h(initHandlePoint, a, b, c)
  const initHandleX = initHandle * Math.cos(initHandlePoint)
  const initHandleY = initHandle * Math.sin(initHandlePoint)

  let path = `M ${xCoords[xCoords.length - 1] + cx},${yCoords[yCoords.length - 1] + cy} C ${2 * xCoords[xCoords.length - 1] - initHandleX + cx},${2 * yCoords[yCoords.length - 1] - initHandleY + cy} ${xCoords[0] + cx},${yCoords[0] + cy} ${xCoords[1] + cx},${yCoords[1] + cy}`

  for (let i = 2; i < xCoords.length - 3; i += 2) {
    path += ` S ${xCoords[i] + cx},${yCoords[i] + cy} ${xCoords[i + 1] + cx},${yCoords[i + 1] + cy}`
  }

  // Match the last handle with the first handle
  path += ` S ${initHandleX + cx},${initHandleY + cy} ${xCoords[xCoords.length - 1] + cx},${yCoords[yCoords.length - 1] + cy}`

  // Smoothness enforcement with bounded retries
  const properXY = convertBezierProper(xCoords, yCoords, initHandleX, initHandleY)

  if (!isSmooth(properXY[0], properXY[1]) && enforceSmooth) {
    // Retry with new random params for a, b, c
    return createBlob({ ...config, a: random(0.1, 0.7), b: random(0.1, 0.7), c: random(0, 2 * PI) })
  }

  return { path, cx, cy }
}
