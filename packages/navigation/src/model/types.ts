import type { KeepAliveProps } from 'keepalive-for-react'
import type { ComponentType, ReactNode } from 'react'

/**
 * Arbitrary per-tab memory. `path` is always present and tracks the last
 * visited location inside the tab. Apps may store any other keys freely.
 */
export interface TabMemory extends Record<string, unknown> {
  /** Last visited location inside the tab (defaults to the tab's `path`). */
  path: string
}

/**
 * A single tab in a mobile-like tab navigation.
 *
 * `id`, `path` and `element` are required. Any other string key may be added
 * freely (e.g. `icon`, `label`, `group`...) and is preserved as-is so apps can
 * attach their own metadata without fighting the type system.
 */
export interface TabDefinition extends Record<string, unknown> {
  /** Stable identifier used as the keepalive cache key. Must be unique. */
  id: string

  /**
   * Route path that activates this tab. Prefix matching is used by default
   * (so `/docs` matches `/docs/components/surface`). The root `/` always
   * matches exactly to avoid shadowing every other tab.
   */
  path: string

  /** Content rendered (and kept alive) when this tab is active. */
  element: ReactNode

  /**
   * Optional component rendered instead of `element`. When provided it takes
   * precedence over `element`. Useful for lazy/async tabs.
   */
  component?: ComponentType

  /**
   * Whether the tab remembers its last visited path (and any other memory
   * keys) when the user navigates away and comes back.
   * @default true
   */
  persistent?: boolean

  /**
   * Initial memory merged into the tab's default memory. Use this to set an
   * initial `path` (e.g. a default sub-page) or any other app-specific keys.
   * @default { path: tab.path }
   */
  initialMemory?: Partial<TabMemory>
}

/** Subset of `keepalive-for-react` props forwarded by `TabView`. */
export type TabViewKeepAliveProps = Omit<KeepAliveProps, 'activeCacheKey' | 'children' | 'customContainerRef' | 'containerClassName'>

/** Match result for a tab against the current location. */
export interface TabMatch {
  /** The tab that matched, or the fallback tab if none matched. */
  tab: TabDefinition
  /** Whether the tab matched the location directly (vs. falling back). */
  matched: boolean
  /** The cache key used for keepalive (the tab id). */
  cacheKey: string
}

/** Value provided by `TabProvider` via context. */
export interface TabNavigationContextValue {
  /** All registered tab definitions. */
  tabs: TabDefinition[]
  /** The currently active tab (resolved from the location). */
  activeTab: TabDefinition
  /** The keepalive cache key for the active tab (its id). */
  cacheKey: string
  /** The fallback tab id used when no tab matches the location. */
  fallbackId: string
  /** Per-tab memory store (keyed by tab id). */
  memory: Record<string, TabMemory>
  /** Update memory for a single tab. */
  setMemory: (tabId: string, updater: TabMemory | ((prev: TabMemory) => TabMemory)) => void
}

/** Props for `TabProvider`. */
export interface TabProviderProps {
  /** Tab definitions. Order matters only for fallback resolution. */
  tabs: TabDefinition[]
  /**
   * Id of the tab to render when the current location matches none.
   * @default tabs[0].id
   */
  fallbackId?: string
  /** Children rendered inside the provider. */
  children?: ReactNode
}

/** Props for `TabView`. */
export interface TabViewProps extends TabViewKeepAliveProps {
  /** Optional className applied to the keepalive container. */
  className?: string
}

/** Props for `TabBar`. */
export interface TabBarProps {
  /** Tab definitions to render entries for. Defaults to the provider's tabs. */
  tabs?: TabDefinition[]
  /** Render function for each entry. Receives the tab and active state. */
  renderItem?: (tab: TabDefinition, active: boolean) => ReactNode
  /** Class name applied to the `<nav>` element. */
  className?: string
  /** Optional key prefix for entries (defaults to 'tab'). */
  keyPrefix?: string
  /** Children rendered after the entries. */
  children?: ReactNode
}

/** Props for `TabItem`. */
export interface TabItemProps {
  /** The tab definition this item links to. */
  tab: TabDefinition
  /** Optional class name. When a function, receives the active boolean. */
  className?: string | ((active: boolean) => string)
  /** Children rendered inside the link. */
  children?: ReactNode
}

/** Return type of `useTabNavigation`. */
export interface TabNavigationResult {
  /** The resolved tab (active tab if no id given, or the requested one). */
  tab: TabDefinition
  /** The tab's memory object. */
  memory: TabMemory
}

/** Return type of `useTabItemHref`. */
export type TabItemHref = string
