import { afterEach, describe, expect, rs, test } from '@rstest/core'
import { cleanup, render, screen } from '@testing-library/react'
import { Router } from 'wouter'
import { TabProvider, TabView, useIsTabActive, useTabMemory, useTabNavigation, useTabPath } from '../../src'
import type { TabDefinition } from '../../src/model/types'

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

afterEach(cleanup)

function CombinedConsumer() {
  const { tab } = useTabNavigation()
  const active = useIsTabActive(tab.id)
  const [memory] = useTabMemory(tab.id)
  const path = useTabPath()

  return (
    <div>
      <span data-testid='active-tab-id'>{tab.id}</span>
      <span data-testid='is-active'>{String(active)}</span>
      <span data-testid='memory-path'>{memory.path}</span>
      <span data-testid='tab-path'>{path}</span>
    </div>
  )
}

const tabs: TabDefinition[] = [
  { id: 'home', path: '/', element: <div>Home</div> },
  { id: 'docs', path: '/docs', element: <div>Docs</div> },
  { id: 'about', path: '/about', element: <div>About</div> },
]

describe('Combined provider integration', () => {
  test('all hooks return consistent values at default location', () => {
    render(
      <Router>
        <TabProvider tabs={tabs}>
          <CombinedConsumer />
        </TabProvider>
      </Router>,
    )

    expect(screen.getByTestId('active-tab-id').textContent).toBe('home')
    expect(screen.getByTestId('is-active').textContent).toBe('true')
    expect(screen.getByTestId('memory-path').textContent).toBe('/')
    expect(screen.getByTestId('tab-path').textContent).toBe('/')
  })

  test('TabView renders the active tab element alongside hook consumers', () => {
    const tabsWithContent: TabDefinition[] = [{ id: 'home', path: '/', element: <div data-testid='tab-content'>Home Content</div> }]

    render(
      <Router>
        <TabProvider tabs={tabsWithContent}>
          <TabView />
          <CombinedConsumer />
        </TabProvider>
      </Router>,
    )

    expect(screen.getByTestId('tab-content').textContent).toBe('Home Content')
    expect(screen.getByTestId('active-tab-id').textContent).toBe('home')
  })

  test('memory persists across re-renders', () => {
    const { rerender } = render(
      <Router>
        <TabProvider tabs={tabs}>
          <CombinedConsumer />
        </TabProvider>
      </Router>,
    )

    expect(screen.getByTestId('memory-path').textContent).toBe('/')

    rerender(
      <Router>
        <TabProvider tabs={tabs}>
          <CombinedConsumer />
        </TabProvider>
      </Router>,
    )

    expect(screen.getByTestId('memory-path').textContent).toBe('/')
  })

  test('useIsTabActive returns false for inactive tab', () => {
    function InactiveTabChecker() {
      const isActive = useIsTabActive('docs')
      return <span data-testid='docs-active'>{String(isActive)}</span>
    }

    render(
      <Router>
        <TabProvider tabs={tabs}>
          <InactiveTabChecker />
        </TabProvider>
      </Router>,
    )

    expect(screen.getByTestId('docs-active').textContent).toBe('false')
  })
})
