import { useKeepAliveContext } from 'keepalive-for-react'
import { useContext } from 'react'
import { TabNavigationContext } from '../ui/tab-provider'

/**
 * Returns the remembered path for the tab this component belongs to.
 *
 * This is designed to be used **inside** a `<TabView>` (i.e. within a
 * `keepalive-for-react` KeepAlive subtree). It reads the cache key from the
 * keepalive context to determine which tab the calling component belongs to,
 * then returns that tab's remembered path from the tab navigation memory.
 *
 * Unlike wouter's `useLocation()`, this does **not** change when the user
 * navigates to a different tab — each cached tab keeps seeing its own
 * last-active path. This prevents inactive cached tabs from re-rendering
 * and unmounting their content when the user switches tabs.
 *
 * Must be used inside a `<TabProvider>` and a `<TabView>`.
 */
export function useTabPath(): string {
  const ctx = useContext(TabNavigationContext)
  if (!ctx) {
    throw new Error('useTabPath must be used within a <TabProvider>.')
  }
  const { _cacheKey } = useKeepAliveContext()
  const tabId = _cacheKey
  const memory = ctx.memory[tabId]
  const tab = ctx.tabs.find(t => t.id === tabId)
  return memory?.path ?? tab?.path ?? '/'
}
