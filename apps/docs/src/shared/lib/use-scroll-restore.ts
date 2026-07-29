import { type RefObject, useEffect, useRef } from 'react'
import { useLocation } from 'react-router-dom'

/**
 * Restores the scroll position of the given element when the user navigates
 * back to a previously visited route. Stores the last scroll top per pathname
 * in an in-memory map keyed by location.pathname.
 */
export function useScrollRestore(ref: RefObject<HTMLElement | null>): void {
  const location = useLocation()
  const positions = useRef<Map<string, number>>(new Map())
  const previousPath = useRef<string | undefined>(undefined)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    // Save the scroll position of the route we're leaving.
    if (previousPath.current && previousPath.current !== location.pathname) {
      positions.current.set(previousPath.current, el.scrollTop)
    }

    // Restore the scroll position of the route we're entering (if any).
    const saved = positions.current.get(location.pathname)
    el.scrollTop = saved ?? 0
    previousPath.current = location.pathname
  }, [location.pathname, ref])
}
