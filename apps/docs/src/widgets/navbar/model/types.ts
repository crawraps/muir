import type { TabDefinition } from '@muir/navigation'
import type { HTMLAttributes } from 'react'

export interface Props extends HTMLAttributes<HTMLDivElement> {
  tabs: TabDefinition[]
}
