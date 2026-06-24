import { describe, expect, test } from '@rstest/core'
import { renderHook } from '@testing-library/react'
import type { ReactNode } from 'react'
import type { TabDefinition } from '../../src/model/types'
import { useTabItemHref } from '../../src/model/use-tab-item-href'
import { Wrapper } from '../helpers/wrapper'

describe('useTabItemHref', () => {
  test('returns tab.path for non-persistent tabs', () => {
    const tabs: TabDefinition[] = [
      { id: 'home', path: '/' },
      { id: 'temp', path: '/temp', persistent: false },
    ]
    const { result } = renderHook(() => useTabItemHref(tabs[1]), {
      wrapper: (props: { children: ReactNode }) => <Wrapper tabs={tabs}>{props.children}</Wrapper>,
    })

    expect(result.current).toBe('/temp')
  })

  test('returns tab.path for persistent tabs when memory not yet updated', () => {
    const tabs: TabDefinition[] = [
      { id: 'home', path: '/' },
      { id: 'docs', path: '/docs' },
    ]
    const { result } = renderHook(() => useTabItemHref(tabs[1]), {
      wrapper: (props: { children: ReactNode }) => <Wrapper tabs={tabs}>{props.children}</Wrapper>,
    })

    expect(result.current).toBe('/docs')
  })

  test('returns initialMemory path when set', () => {
    const tabs: TabDefinition[] = [
      { id: 'home', path: '/' },
      { id: 'docs', path: '/docs', initialMemory: { path: '/docs/components/button' } },
    ]
    const { result } = renderHook(() => useTabItemHref(tabs[1]), {
      wrapper: (props: { children: ReactNode }) => <Wrapper tabs={tabs}>{props.children}</Wrapper>,
    })

    expect(result.current).toBe('/docs/components/button')
  })
})
