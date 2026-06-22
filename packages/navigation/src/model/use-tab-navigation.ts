import { useContext } from 'react'
import { TabNavigationContext } from '../ui/tab-provider'
import { defaultMemoryFor } from './resolve-active-tab'
import type { TabNavigationResult } from './types'

/**
 * Resolve a tab and its memory from the current navigation context.
 *
 * @param id - Optional tab id. When omitted, the currently active tab is used.
 * When the id is not found, falls back to the active tab.
 *
 * Must be used inside a `<TabProvider>` (and a wouter `<Router>`).
 */
export function useTabNavigation(id?: string): TabNavigationResult {
  const ctx = useContext(TabNavigationContext)
  if (!ctx) {
    throw new Error('useTabNavigation must be used within a <TabProvider>.')
  }

  const tab = id ? (ctx.tabs.find(t => t.id === id) ?? ctx.activeTab) : ctx.activeTab
  const memory = ctx.memory[tab.id] ?? defaultMemoryFor(tab)

  return { tab, memory }
}

/**
 * Returns whether a given tab id corresponds to the currently active tab.
 *
 * Must be used inside a `<TabProvider>`.
 */
export function useIsTabActive(tabId: string): boolean {
  const ctx = useContext(TabNavigationContext)
  if (!ctx) {
    throw new Error('useIsTabActive must be used within a <TabProvider>.')
  }
  return ctx.activeTab.id === tabId
}
