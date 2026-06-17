import type React from 'react'

/**
 * @docs
 * Properties for the Split component.
 */
export interface SplitProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'children'> {
  /**
   * Ref to the underlying HTML element.
   */
  ref?: React.Ref<HTMLDivElement>

  /**
   * If true, children are laid out vertically instead of horizontally.
   * @default false
   */
  vertical?: boolean

  /**
   * If true, children keep their intrinsic size instead of being stretched to equal width
   * (or height when vertical).
   * @default false
   */
  uneven?: boolean

  /**
   * The content of the split group. Accepts Button, Icon, TextInput, or any element.
   */
  children?: React.ReactNode
}
