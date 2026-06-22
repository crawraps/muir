import { useContext } from 'react'
import type { TabBarProps } from '../model/types'
import styles from './style.module.css'
import { TabItem } from './tab-item'
import { TabNavigationContext } from './tab-provider'

/**
 * UI-agnostic bottom/side tab bar. Renders a `<nav>` with one entry per tab.
 *
 * By default each entry is a `TabItem` (a wouter `<Link>` pointing at the tab's
 * remembered path). Provide `renderItem` to fully customise the entry markup
 * while still getting the active state.
 *
 * Must be used inside a `<TabProvider>`.
 */
export function TabBar({ tabs, renderItem, className, keyPrefix = 'tab', children }: TabBarProps) {
  const ctx = useContext(TabNavigationContext)
  if (!ctx) {
    throw new Error('TabBar must be used within a <TabProvider>.')
  }
  const list = tabs ?? ctx.tabs

  return (
    <nav className={cx('tab-bar', styles['tab-bar'], className)}>
      {list.map(tab => {
        const active = tab.id === ctx.activeTab.id
        return (
          <span key={`${keyPrefix}-${tab.id}`}>{renderItem ? renderItem(tab, active) : <TabItem tab={tab}>{typeof tab.label === 'string' ? tab.label : tab.id}</TabItem>}</span>
        )
      })}
      {children}
    </nav>
  )
}
