import type React from 'react'

/**
 * @docs
 * Properties for the ErrorMessage component.
 */
export interface ErrorMessageProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'children'> {
  /**
   * Ref to the underlying HTML element.
   */
  ref?: React.Ref<HTMLDivElement>

  /**
   * A single error message or a list of error messages to display.
   * Invisible when undefined, null, false, or an empty array.
   */
  children?: React.ReactNode | React.ReactNode[]
}
