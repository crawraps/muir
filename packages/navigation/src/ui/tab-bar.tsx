import { Fragment } from 'react'
import type { TabBarProps } from '../model/types'
import { createSmartClsx } from '../shared/smart-clsx'
import { TabItem } from './tab-item'
import { useTabMetadata, useTabState } from './tab-provider'
import styles from './tab-view.module.css'

const cx = createSmartClsx(styles)

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
  const meta = useTabMetadata()
  const state = useTabState()
  const list = tabs ?? meta.tabs

  return (
    <nav className={cx('tab-bar', styles['tab-bar'], className)}>
      {list.map(tab => {
        const active = tab.id === state.activeTab.id
        return renderItem ? (
          <Fragment key={`${keyPrefix}-${tab.id}`}>{renderItem(tab, active)}</Fragment>
        ) : (
          <TabItem key={`${keyPrefix}-${tab.id}`} tab={tab}>
            {typeof tab.label === 'string' ? tab.label : tab.id}
          </TabItem>
        )
      })}
      {children}
    </nav>
  )
}
