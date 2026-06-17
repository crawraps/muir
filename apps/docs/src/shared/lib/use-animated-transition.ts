import { useCallback, useEffect, useRef, useState } from 'react'

/**
 * Keeps the previous value in state while an exit animation runs,
 * then clears it when the consumer signals completion via `completeExit`.
 * Rapid changes are collapsed: `current` always reflects the latest value,
 * `previous` stays the one currently exiting.
 *
 * All `useState` calls use the updater form `(() => value)` to prevent
 * React from invoking component-function values stored in state.
 */
export function useAnimatedTransition<T>(next: T): {
  previous: T | null
  current: T
  isTransitioning: boolean
  completeExit: () => void
} {
  const [current, setCurrent] = useState(() => next)
  const [previous, setPrevious] = useState<T | null>(() => null)
  const [isTransitioning, setIsTransitioning] = useState(false)
  const isFirstRender = useRef(true)

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false
      return
    }

    if (next === current) return

    if (!current) {
      setCurrent(() => next)
      return
    }

    if (!isTransitioning) {
      setPrevious(() => current)
      setIsTransitioning(true)
    }

    setCurrent(() => next)
  }, [next, current, isTransitioning])

  const completeExit = useCallback(() => {
    setPrevious(() => null)
    setIsTransitioning(false)
  }, [])

  return { previous, current, isTransitioning, completeExit }
}