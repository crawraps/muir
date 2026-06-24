import { describe, expect, rs, test } from '@rstest/core'
import { render, screen } from '@testing-library/react'
import { TabView } from '../../src/ui/tab-view'
import { Wrapper } from '../helpers/wrapper'

rs.mock('keepalive-for-react', () => ({
  KeepAlive: ({ children }: { children: React.ReactNode }) => <>{children}</>,
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

describe('TabView', () => {
  test('renders the active tab element', () => {
    const tabs = [
      { id: 'home', path: '/', element: <div data-testid='home-tab'>Home</div> },
      { id: 'docs', path: '/docs', element: <div data-testid='docs-tab'>Docs</div> },
    ]

    render(
      <Wrapper tabs={tabs}>
        <TabView />
      </Wrapper>,
    )

    expect(screen.getByTestId('home-tab')).not.toBeNull()
  })

  test('renders tab.component when provided (takes precedence over element)', () => {
    function SpyComponent() {
      return <div data-testid='spy-component'>spy</div>
    }

    const tabs = [
      {
        id: 'home',
        path: '/',
        element: <div data-testid='home-element'>Home Element</div>,
        component: SpyComponent,
      },
    ]

    render(
      <Wrapper tabs={tabs}>
        <TabView />
      </Wrapper>,
    )

    expect(screen.getByTestId('spy-component')).not.toBeNull()
    expect(screen.queryByTestId('home-element')).toBeNull()
  })

  test('memoizes element: same tab.id does not cause unnecessary re-render', () => {
    let renderCount = 0
    function SpyComponent() {
      renderCount++
      return <div data-testid='spy'>spy</div>
    }

    const tabs = [{ id: 'home', path: '/', component: SpyComponent }]

    const { rerender } = render(
      <Wrapper tabs={tabs}>
        <TabView />
      </Wrapper>,
    )

    expect(renderCount).toBe(1)

    rerender(
      <Wrapper tabs={tabs}>
        <TabView />
      </Wrapper>,
    )

    expect(renderCount).toBe(1)
  })
})
