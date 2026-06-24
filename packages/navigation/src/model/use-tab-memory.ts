import { useCallback } from 'react'
import { useTabMetadata, useTabState } from '../ui/tab-provider'
import type { TabMemory } from './types'

export function useTabMemory(tabId?: string): [TabMemory, (updater: TabMemory | ((prev: TabMemory) => TabMemory)) => void] {
  const meta = useTabMetadata()
  const state = useTabState()

  const id = tabId ?? state.activeTab.id
  const memory = state.memory[id] ?? { path: meta.tabs.find(t => t.id === id)?.path ?? '/' }

  const setMemory = useCallback(
    (updater: TabMemory | ((prev: TabMemory) => TabMemory)) => {
      state.setMemory(id, updater)
    },
    [state, id],
  )

  return [memory, setMemory]
}
