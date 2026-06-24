import { describe, expect, test } from '@rstest/core'
import { defaultMemoryFor, isTabActive, memoizedResolveActiveTab, resolveActiveTab } from '../../src/model/resolve-active-tab'
import type { TabDefinition } from '../../src/model/types'

describe('isTabActive', () => {
  const tabs: TabDefinition[] = [
    { id: 'home', path: '/' },
    { id: 'docs', path: '/docs' },
    { id: 'about', path: '/about' },
  ]

  test('returns true for exact match', () => {
    expect(isTabActive(tabs[0], '/')).toBe(true)
    expect(isTabActive(tabs[1], '/docs')).toBe(true)
    expect(isTabActive(tabs[2], '/about')).toBe(true)
  })

  test('returns true for prefix match', () => {
    expect(isTabActive(tabs[1], '/docs/components/button')).toBe(true)
  })

  test('returns false for non-matching path', () => {
    expect(isTabActive(tabs[0], '/docs')).toBe(false)
    expect(isTabActive(tabs[1], '/about')).toBe(false)
    expect(isTabActive(tabs[2], '/')).toBe(false)
  })

  test('root / matches exactly only', () => {
    expect(isTabActive(tabs[0], '/')).toBe(true)
    expect(isTabActive(tabs[0], '/anything')).toBe(false)
  })
})

describe('resolveActiveTab', () => {
  const tabs: TabDefinition[] = [
    { id: 'home', path: '/' },
    { id: 'docs', path: '/docs', element: <div>Docs</div> },
    { id: 'about', path: '/about', element: <div>About</div> },
  ]

  test('returns matching tab for exact path match', () => {
    const result = resolveActiveTab(tabs, '/docs', 'home')
    expect(result.tab.id).toBe('docs')
    expect(result.matched).toBe(true)
    expect(result.cacheKey).toBe('docs')
  })

  test('returns matching tab for prefix match', () => {
    const result = resolveActiveTab(tabs, '/docs/components/button', 'home')
    expect(result.tab.id).toBe('docs')
    expect(result.matched).toBe(true)
  })

  test('returns fallback tab with matched: false when no tab matches', () => {
    const result = resolveActiveTab(tabs, '/unknown/path', 'about')
    expect(result.tab.id).toBe('about')
    expect(result.matched).toBe(false)
  })

  test('root / matches exactly only', () => {
    const result = resolveActiveTab(tabs, '/', 'home')
    expect(result.tab.id).toBe('home')
    expect(result.matched).toBe(true)
  })
})

describe('memoizedResolveActiveTab', () => {
  const tabs: TabDefinition[] = [
    { id: 'home', path: '/' },
    { id: 'docs', path: '/docs', element: <div>Docs</div> },
  ]

  test('returns same object reference for same inputs', () => {
    const result1 = memoizedResolveActiveTab(tabs, '/docs', 'home')
    const result2 = memoizedResolveActiveTab(tabs, '/docs', 'home')
    expect(result1).toBe(result2)
  })

  test('returns new object when inputs change', () => {
    const result1 = memoizedResolveActiveTab(tabs, '/docs', 'home')
    const result2 = memoizedResolveActiveTab(tabs, '/about', 'home')
    expect(result1).not.toBe(result2)
  })

  test('clears cache when tabs reference changes', () => {
    const tabs1 = [{ id: 'home', path: '/' }]
    const result1 = memoizedResolveActiveTab(tabs1, '/', 'home')

    const tabs2 = [{ id: 'home', path: '/' }]
    const result2 = memoizedResolveActiveTab(tabs2, '/', 'home')
    expect(result1).not.toBe(result2)
  })
})

describe('defaultMemoryFor', () => {
  test('returns { path: tab.path } by default', () => {
    const tab = { id: 'docs', path: '/docs', element: <div>Docs</div> }
    const memory = defaultMemoryFor(tab)
    expect(memory).toEqual({ path: '/docs' })
  })

  test('merges initialMemory when provided', () => {
    const tab = {
      id: 'docs',
      path: '/docs',
      element: <div>Docs</div>,
      initialMemory: { path: '/docs/getting-started', customKey: 'value' },
    }
    const memory = defaultMemoryFor(tab)
    expect(memory).toEqual({ path: '/docs/getting-started', customKey: 'value' })
  })

  test('tab.path is overridden by initialMemory path', () => {
    const tab = {
      id: 'docs',
      path: '/docs',
      element: <div>Docs</div>,
      initialMemory: { path: '/docs/subpage' },
    }
    const memory = defaultMemoryFor(tab)
    expect(memory.path).toBe('/docs/subpage')
  })
})
