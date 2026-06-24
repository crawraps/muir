import type { ReactNode } from 'react'
import { Router } from 'wouter'
import type { TabDefinition } from '../../src/model/types'
import { TabProvider } from '../../src/ui/tab-provider'

const defaultTabs: TabDefinition[] = [
  { id: 'home', path: '/', element: <div>Home</div> },
  { id: 'docs', path: '/docs', element: <div>Docs</div> },
  { id: 'about', path: '/about', element: <div>About</div> },
]

export function Wrapper({ children, tabs = defaultTabs }: { children: ReactNode; tabs?: TabDefinition[] }) {
  return (
    <Router>
      <TabProvider tabs={tabs}>{children}</TabProvider>
    </Router>
  )
}
