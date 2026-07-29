import type { ComponentType, ReactElement, ReactNode } from 'react'

export interface RouteProps {
  path?: string
  nest?: boolean
  default?: boolean
  children?: ReactNode
  component?: ComponentType<Record<string, unknown>>
}

export interface StackProps {
  children?: ReactNode
  className?: string
}

export interface TabsProps {
  children?: ReactNode
  className?: string
}

export interface TabProviderProps {
  children?: ReactNode
}

export interface TabController {
  activeTab: string
  scopedLocation: string
  scopedNavigate: (to: string) => void
  switchTo: (tabPath: string) => void
  goBack: () => void
  canGoBack: boolean
}

export interface TabEntry {
  path: string
  absolutePath: string
  default: boolean
  element: ReactElement
}
