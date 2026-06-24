import { KeepAlive } from 'keepalive-for-react'
import { useMemo } from 'react'
import type { TabViewProps } from '../model/types'
import { useTabNavigation } from '../model/use-tab-navigation'
import { createSmartClsx } from '../shared/smart-clsx'
import styles from './tab-view.module.css'

const cx = createSmartClsx(styles)

/**
 * Renders the active tab inside a `keepalive-for-react` `KeepAlive` so that
 * inactive tabs stay mounted and preserve their state (scroll position,
 * form input, React state, etc.).
 *
 * The package owns the container className and the CSS that hides inactive
 * cache nodes (using `visibility: hidden` so DOM state survives). Apps do not
 * need to provide any keepalive-related styling.
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

  const element = useMemo(() => {
    return tab.component ? <tab.component /> : tab.element
  }, [tab.component, tab.element])

  return (
    <KeepAlive activeCacheKey={tab.id} containerClassName={cx('container', styles.container, className)} {...keepAliveProps}>
      {element}
    </KeepAlive>
  )
}
