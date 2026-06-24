import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { useLocation } from 'wouter'
import { defaultMemoryFor, memoizedResolveActiveTab } from '../model/resolve-active-tab'
import type { TabDefinition, TabMemory, TabNavigationContextValue, TabProviderProps } from '../model/types'

/** Stable metadata that rarely changes — tabs list and fallback id. */
export interface TabNavigationMetadata {
  tabs: TabDefinition[]
  fallbackId: string
}

const MetadataContext = createContext<TabNavigationMetadata | null>(null)

/** Keep the public export name for backward compatibility. */
export const TabNavigationContext = createContext<TabNavigationContextValue | null>(null)

function initMemory(tabs: TabDefinition[]): Record<string, TabMemory> {
  const memory: Record<string, TabMemory> = {}
  for (const tab of tabs) {
    memory[tab.id] = defaultMemoryFor(tab)
  }
  return memory
}

export function TabProvider({ tabs, fallbackId, children }: TabProviderProps) {
  const [location] = useLocation()
  const resolvedFallback = fallbackId ?? tabs[0]?.id ?? ''
  const { tab, cacheKey } = memoizedResolveActiveTab(tabs, location, resolvedFallback)

  const [memory, setMemoryState] = useState<Record<string, TabMemory>>(() => initMemory(tabs))

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

  const metadata = useMemo<TabNavigationMetadata>(() => ({ tabs, fallbackId: resolvedFallback }), [tabs, resolvedFallback])

  const state = useMemo<TabNavigationContextValue>(
    () => ({ tabs, activeTab: tab, cacheKey, fallbackId: resolvedFallback, memory, setMemory }),
    [tabs, tab, cacheKey, resolvedFallback, memory, setMemory],
  )

  return (
    <MetadataContext.Provider value={metadata}>
      <TabNavigationContext.Provider value={state}>{children}</TabNavigationContext.Provider>
    </MetadataContext.Provider>
  )
}

/** Internal helper: read metadata context or throw. */
export function useTabMetadata(): TabNavigationMetadata {
  const ctx = useContext(MetadataContext)
  if (!ctx) throw new Error('useTabNavigation must be used within a <TabProvider>.')
  return ctx
}

/** Internal helper: read state context or throw. */
export function useTabState(): TabNavigationContextValue {
  const ctx = useContext(TabNavigationContext)
  if (!ctx) throw new Error('useTabNavigation must be used within a <TabProvider>.')
  return ctx
}

export type { TabDefinition, TabMemory }
