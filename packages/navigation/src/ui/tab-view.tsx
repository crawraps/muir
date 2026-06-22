import { KeepAlive } from 'keepalive-for-react'
import { useRef } from 'react'
import type { TabViewProps } from '../model/types'
import { useTabNavigation } from '../model/use-tab-navigation'
import styles from './tab-view.module.css'

/**
 * Renders the active tab inside a `keepalive-for-react` `KeepAlive` so that
 * inactive tabs stay mounted and preserve their state (scroll position,
 * form input, React state, etc.).
 *
 * The package owns the container element and the CSS that hides inactive cache
 * nodes (using `visibility: hidden` so DOM state survives). Apps do not need
 * to provide any keepalive-related styling.
 *
 * Must be used inside a `<TabProvider>` (and a wouter `<Router>`).
 *
 * All `keepalive-for-react` props except `activeCacheKey`, `children`,
 * `customContainerRef` and `containerClassName` are forwarded via the rest
 * props (`max`, `transition`, `duration`, `exclude`, `include`, `aliveRef`,
 * `maxAliveTime`, etc.).
 */
export function TabView({ className, ...keepAliveProps }: TabViewProps) {
  const { tab } = useTabNavigation()
  const containerRef = useRef<HTMLDivElement>(null)
  const element = tab.component ? <tab.component /> : tab.element

  return (
    <div className={cx('container', styles.container, className)} ref={containerRef}>
      <KeepAlive activeCacheKey={tab.id} customContainerRef={containerRef as React.RefObject<HTMLDivElement>} {...keepAliveProps}>
        {element}
      </KeepAlive>
    </div>
  )
}
