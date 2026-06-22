import { Link } from 'wouter'
import type { TabItemProps } from '../model/types'
import { useTabMemory } from '../model/use-tab-memory'
import { useIsTabActive } from '../model/use-tab-navigation'

/**
 * A single tab entry rendered as a wouter `<Link>`.
 *
 * The link href is the tab's remembered path (`memory.path`), so switching tabs
 * returns the user to where they left off. For non-persistent tabs the href is
 * the tab's base `path`.
 *
 * The `className` prop may be a string or a function receiving the active
 * boolean. Pass any children to customise the entry's appearance.
 *
 * Must be used inside a wouter `<Router>` and a `<TabProvider>`.
 */
export function TabItem({ tab, className, children }: TabItemProps) {
  const active = useIsTabActive(tab.id)
  const [memory] = useTabMemory(tab.id)
  const href = tab.persistent === false ? tab.path : memory.path
  const resolved = typeof className === 'function' ? className(active) : className

  return (
    <Link className={cx('tab-item', resolved)} href={href}>
      {children}
    </Link>
  )
}
