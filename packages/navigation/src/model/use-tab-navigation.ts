import { useTabMetadata, useTabState } from '../ui/tab-provider'
import { defaultMemoryFor } from './resolve-active-tab'
import type { TabNavigationResult } from './types'

export function useTabNavigation(id?: string): TabNavigationResult {
  const meta = useTabMetadata()
  const state = useTabState()

  const tab = id ? (meta.tabs.find(t => t.id === id) ?? state.activeTab) : state.activeTab
  const memory = state.memory[tab.id] ?? defaultMemoryFor(tab)

  return { tab, memory }
}

export function useIsTabActive(tabId: string): boolean {
  const state = useTabState()
  return state.activeTab.id === tabId
}
