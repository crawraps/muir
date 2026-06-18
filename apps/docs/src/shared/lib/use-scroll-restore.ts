import { useKeepAliveContext } from 'keepalive-for-react'
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
    if (!active && scrollContainerRef.current) {
      scrollPos.current = scrollContainerRef.current.scrollTop
    }
  }, [active, scrollContainerRef])

  useEffect(() => {
    if (active && scrollContainerRef.current) {
      scrollContainerRef.current.scrollTop = scrollPos.current
    }
  }, [active, scrollContainerRef])

  return { active }
}
