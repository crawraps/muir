import { useTabState } from '../ui/tab-provider'
import type { TabDefinition } from './types'

/**
 * Returns the href for a tab entry — the tab's remembered path for persistent
 * tabs, or the tab's base path for non-persistent tabs.
 *
 * Must be used inside a `<TabProvider>`.
 */
export function useTabItemHref(tab: TabDefinition): string {
  const state = useTabState()
  if (tab.persistent === false) return tab.path
  return state.memory[tab.id]?.path ?? tab.path
}
