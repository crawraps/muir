import type { HTMLAttributes } from 'react'

export interface Props extends HTMLAttributes<HTMLDivElement> {
  entries: NavEntry[]
}

export type NavEntry = {
  label: string
  href: string
  icon: string
}
