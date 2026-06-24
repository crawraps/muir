import { describe, expect, test } from '@rstest/core'
import { act, renderHook } from '@testing-library/react'
import { useTabMemory } from '../../src/model/use-tab-memory'
import { Wrapper } from '../helpers/wrapper'

describe('useTabMemory', () => {
  test('returns memory for active tab by default', () => {
    const { result } = renderHook(() => useTabMemory(), { wrapper: Wrapper })
    expect(result.current[0]).toEqual({ path: '/' })
  })

  test('returns memory for specified tab', () => {
    const { result } = renderHook(() => useTabMemory('docs'), { wrapper: Wrapper })
    expect(result.current[0]).toEqual({ path: '/docs' })
  })

  test('setter updates memory for the correct tab', () => {
    const { result } = renderHook(() => useTabMemory(), { wrapper: Wrapper })

    act(() => {
      result.current[1]({ path: '/new-path' })
    })

    expect(result.current[0].path).toBe('/new-path')
  })

  test('setter updates memory when callback is provided', () => {
    const { result } = renderHook(() => useTabMemory('docs'), { wrapper: Wrapper })

    act(() => {
      result.current[1](prev => ({ ...prev, customKey: 'value' }))
    })

    expect(result.current[0].path).toBe('/docs')
    expect(result.current[0].customKey).toBe('value')
  })

  test('setter has stable identity across renders (useCallback)', () => {
    const { result, rerender } = renderHook(() => useTabMemory(), { wrapper: Wrapper })

    const [, setMemory1] = result.current
    rerender()
    const [, setMemory2] = result.current

    expect(setMemory1).toBe(setMemory2)
  })

  test('throws when used outside TabProvider', () => {
    expect(() => renderHook(() => useTabMemory())).toThrow()
  })
})
