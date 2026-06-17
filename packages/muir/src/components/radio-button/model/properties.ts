import type React from 'react'

/**
 * @docs
 * Properties for the RadioButton component.
 */
export interface RadioButtonProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type' | 'children'> {
  /**
   * Ref to the underlying native `<input type="radio">` element.
   */
  ref?: React.Ref<HTMLInputElement>

  /**
   * Error message. When set, puts the radio in an error state.
   * The message itself is only rendered when `showError` is `true`.
   */
  error?: React.ReactNode

  /**
   * Whether to render the `error` message below the radio.
   * @default false
   */
  showError?: boolean
}
