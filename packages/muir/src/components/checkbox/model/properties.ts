import type React from 'react'

/**
 * @docs
 * Properties for the Checkbox component.
 */
export interface CheckboxProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type' | 'children'> {
  /**
   * Ref to the underlying native `<input type="checkbox">` element.
   */
  ref?: React.Ref<HTMLInputElement>

  /**
   * Error message. When set, puts the checkbox in an error state.
   * The message itself is only rendered when `showError` is `true`.
   */
  error?: React.ReactNode

  /**
   * Whether to render the `error` message below the checkbox.
   * @default false
   */
  showError?: boolean
}
