import type { TabDefinition, TabMatch, TabMemory } from './types'

/** Whether a location matches a tab's path (prefix match, root is exact). */
export function isTabActive(tab: TabDefinition, location: string): boolean {
  if (tab.path === '/') return location === '/'
  return location === tab.path || location.startsWith(`${tab.path}/`)
}

/**
 * Resolve the active tab for a given location.
 *
 * Tabs are checked in order; the first match wins. If nothing matches, the
 * fallback tab (by id) is returned with `matched: false`.
 */
export function resolveActiveTab(tabs: TabDefinition[], location: string, fallbackId: string): TabMatch {
  for (const tab of tabs) {
    if (isTabActive(tab, location)) {
      return { tab, matched: true, cacheKey: tab.id }
    }
  }
  const fallback = tabs.find(t => t.id === fallbackId) ?? tabs[0]
  return { tab: fallback, matched: false, cacheKey: fallback.id }
}

let lastTabs: TabDefinition[] | null = null
let lastLocation = ''
let lastFallbackId = ''
let lastResult: TabMatch | null = null

/**
 * Memoized version of `resolveActiveTab` — returns the cached result when
 * `tabs`, `location`, and `fallbackId` have not changed.
 */
export function memoizedResolveActiveTab(tabs: TabDefinition[], location: string, fallbackId: string): TabMatch {
  if (tabs === lastTabs && location === lastLocation && fallbackId === lastFallbackId && lastResult) {
    return lastResult
  }
  lastTabs = tabs
  lastLocation = location
  lastFallbackId = fallbackId
  lastResult = resolveActiveTab(tabs, location, fallbackId)
  return lastResult
}

/** Build the default memory object for a tab. */
export function defaultMemoryFor(tab: TabDefinition): TabMemory {
  return { path: tab.path, ...(tab.initialMemory ?? {}) }
}
