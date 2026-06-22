import { useCallback, useEffect, useMemo, useState } from 'react'
import { useLocation } from 'wouter'
import { defaultMemoryFor, resolveActiveTab } from '../model/resolve-active-tab'
import type { TabDefinition, TabMemory, TabNavigationContextValue, TabProviderProps } from '../model/types'

export const TabNavigationContext = createContext<TabNavigationContextValue | null>(null)

function initMemory(tabs: TabDefinition[]): Record<string, TabMemory> {
  const memory: Record<string, TabMemory> = {}
  for (const tab of tabs) {
    memory[tab.id] = defaultMemoryFor(tab)
  }
  return memory
}

/**
 * Provides tab definitions, active-tab resolution and per-tab memory to
 * descendants.
 *
 * Does not render a wouter `<Router>` — wrap your app with one. Resolves the
 * active tab from the current location on every render and keeps each tab's
 * memory (`path` plus arbitrary keys) in sync with the location.
 */
export function TabProvider({ tabs, fallbackId, children }: TabProviderProps) {
  const [location] = useLocation()
  const resolvedFallback = fallbackId ?? tabs[0]?.id ?? ''
  const { tab, cacheKey } = resolveActiveTab(tabs, location, resolvedFallback)

  const [memory, setMemoryState] = useState<Record<string, TabMemory>>(() => initMemory(tabs))

  // Keep each tab's memory in sync with the location. When the location moves
  // inside a persistent tab, remember it; non-persistent tabs keep their base.
  useEffect(() => {
    if (tab.persistent === false) return
    setMemoryState(prev => ({ ...prev, [tab.id]: { ...prev[tab.id], path: location } }))
  }, [location, tab.id, tab.persistent])

  const setMemory = useCallback<TabNavigationContextValue['setMemory']>(
    (tabId, updater) => {
      setMemoryState(prev => {
        const current = prev[tabId] ?? defaultMemoryFor(tabs.find(t => t.id === tabId) ?? tabs[0])
        const next = typeof updater === 'function' ? (updater as (p: TabMemory) => TabMemory)(current) : updater
        return { ...prev, [tabId]: next }
      })
    },
    [tabs],
  )

  const ctx = useMemo<TabNavigationContextValue>(
    () => ({ tabs, activeTab: tab, cacheKey, fallbackId: resolvedFallback, memory, setMemory }),
    [tabs, tab, cacheKey, resolvedFallback, memory, setMemory],
  )

  return <TabNavigationContext.Provider value={ctx}>{children}</TabNavigationContext.Provider>
}

export type { TabDefinition, TabMemory }
