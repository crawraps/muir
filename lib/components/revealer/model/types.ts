import type { ReactNode } from 'react'

export interface RevealerProps extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * The tag name to use for the root node.
   *
   * @default 'div'
   */
  tagName?: string
  isRevealed?: boolean
  children?: ReactNode
  hiddenVector?: string | number
  /**
   * Whether to animate the text.
   *
   * @default true
   * @prop immutable
   */
  animateText?: boolean
  autoHideOverflow?: boolean
  className?: string
}
