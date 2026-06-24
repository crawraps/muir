import { describe, expect, rs, test } from '@rstest/core'
import { renderHook } from '@testing-library/react'
import type { ReactNode } from 'react'
import { useTabPath } from '../../src/model/use-tab-path'
import { Wrapper } from '../helpers/wrapper'

rs.mock('keepalive-for-react', () => ({
  useKeepAliveContext: () => ({
    active: true,
    _cacheKey: 'home',
    refresh: () => {},
    destroy: async () => {},
    destroyAll: async () => {},
    destroyOther: async () => {},
    getCacheNodes: () => [],
  }),
}))

describe('useTabPath', () => {
  test('returns the remembered path for the active tab', () => {
    const { result } = renderHook(() => useTabPath(), { wrapper: Wrapper })
    expect(result.current).toBe('/')
  })

  test('falls back to tab.path when memory has no custom path', () => {
    const tabs = [
      { id: 'home', path: '/' },
      { id: 'docs', path: '/docs' },
    ]
    const { result } = renderHook(() => useTabPath(), {
      wrapper: (props: { children: ReactNode }) => <Wrapper tabs={tabs}>{props.children}</Wrapper>,
    })
    expect(result.current).toBe('/')
  })

  test('throws when used outside TabProvider', () => {
    expect(() => renderHook(() => useTabPath())).toThrow()
  })
})
