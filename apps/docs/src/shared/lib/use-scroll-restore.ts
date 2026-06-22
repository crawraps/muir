import { useKeepAliveContext } from '@muir/navigation'
import { useEffect, useRef } from 'react'

/**
 * Saves and restores the scroll position of a scrollable container
 * when a KeepAlive-managed page is deactivated and reactivated.
 *
 * Call inside any component rendered within a <KeepAlive>.
 * `scrollContainerRef` should point to the element that has `overflow-y: auto`.
 */
export function useScrollRestore(scrollContainerRef: React.RefObject<HTMLElement | null>) {
  const scrollPos = useRef(0)
  const { active } = useKeepAliveContext()

  useEffect(() => {
    if (!scrollContainerRef.current) return

    if (!active) {
      scrollPos.current = scrollContainerRef.current.scrollTop
    } else if (active) {
      scrollContainerRef.current.scrollTop = scrollPos.current
    }
  }, [active, scrollContainerRef])

  return { active }
}
