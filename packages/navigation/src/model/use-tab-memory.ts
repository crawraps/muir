import { useContext } from 'react'
import { TabNavigationContext } from '../ui/tab-provider'
import type { TabMemory } from './types'

/**
 * Read and update a tab's memory.
 *
 * @param tabId - The tab id to access. Defaults to the currently active tab.
 * @returns A tuple of `[memory, setMemory]` for the tab.
 *
 * Must be used inside a `<TabProvider>`.
 */
export function useTabMemory(tabId?: string): [TabMemory, (updater: TabMemory | ((prev: TabMemory) => TabMemory)) => void] {
  const ctx = useContext(TabNavigationContext)
  if (!ctx) {
    throw new Error('useTabMemory must be used within a <TabProvider>.')
  }
  const id = tabId ?? ctx.activeTab.id
  const memory = ctx.memory[id] ?? { path: ctx.tabs.find(t => t.id === id)?.path ?? '/' }
  const setMemory = (updater: TabMemory | ((prev: TabMemory) => TabMemory)) => {
    ctx.setMemory(id, updater)
  }
  return [memory, setMemory]
}
