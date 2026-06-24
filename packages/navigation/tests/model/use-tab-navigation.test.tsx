import { describe, expect, test } from '@rstest/core'
import { renderHook } from '@testing-library/react'
import { useIsTabActive, useTabNavigation } from '../../src/model/use-tab-navigation'
import { Wrapper } from '../helpers/wrapper'

describe('useTabNavigation', () => {
  test('returns active tab when no id given', () => {
    const { result } = renderHook(() => useTabNavigation(), { wrapper: Wrapper })
    expect(result.current.tab.id).toBe('home')
    expect(result.current.memory.path).toBe('/')
  })

  test('returns specified tab when id given', () => {
    const { result } = renderHook(() => useTabNavigation('docs'), { wrapper: Wrapper })
    expect(result.current.tab.id).toBe('docs')
    expect(result.current.memory.path).toBe('/docs')
  })

  test('falls back to active tab when id not found', () => {
    const { result } = renderHook(() => useTabNavigation('nonexistent'), { wrapper: Wrapper })
    expect(result.current.tab.id).toBe('home')
  })

  test('throws when used outside TabProvider', () => {
    expect(() => renderHook(() => useTabNavigation())).toThrow()
  })
})

describe('useIsTabActive', () => {
  test('returns true for active tab id', () => {
    const { result } = renderHook(() => useIsTabActive('home'), { wrapper: Wrapper })
    expect(result.current).toBe(true)
  })

  test('returns false for inactive tab id', () => {
    const { result } = renderHook(() => useIsTabActive('docs'), { wrapper: Wrapper })
    expect(result.current).toBe(false)
  })

  test('throws when used outside TabProvider', () => {
    expect(() => renderHook(() => useIsTabActive('home'))).toThrow()
  })
})
