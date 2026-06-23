import { useKeepAliveContext } from '@muir/navigation'
import { useEffect, useRef } from 'react'

/**
 * Saves and restores the scroll position of a scrollable container
 * when a KeepAlive-managed page is deactivated and reactivated.
 *
 * Saves the scroll position continuously on `scroll` events (so the last
 * position is always available even if the cache node is detached from the
 * DOM by KeepAlive), and restores it when the tab becomes active again —
 * deferred to the next animation frame so the browser has laid out the
 * content before we set `scrollTop`.
 *
 * Call inside any component rendered within a <TabView>.
 * `scrollContainerRef` should point to the element that has `overflow-y: auto`.
 */
export function useScrollRestore(scrollContainerRef: React.RefObject<HTMLElement | null>) {
  const scrollPos = useRef(0)
  const { active } = useKeepAliveContext()

  useEffect(() => {
    const el = scrollContainerRef.current
    if (!el) return

    const handleScroll = () => {
      scrollPos.current = el.scrollTop
    }

    el.addEventListener('scroll', handleScroll, { passive: true })
    return () => el.removeEventListener('scroll', handleScroll)
  }, [scrollContainerRef])

  useEffect(() => {
    if (!active || !scrollContainerRef.current) return

    const el = scrollContainerRef.current
    const savedScroll = scrollPos.current

    // Defer to next frame so the browser has laid out the content
    // (the cache node may have just been made visible again).
    const raf = requestAnimationFrame(() => {
      // If content isn't tall enough yet, try again on the following frame.
      if (el.scrollHeight >= savedScroll) {
        el.scrollTop = savedScroll
      } else {
        requestAnimationFrame(() => {
          el.scrollTop = savedScroll
        })
      }
    })

    return () => cancelAnimationFrame(raf)
  }, [active, scrollContainerRef])

  return { active }
}
