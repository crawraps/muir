import type React from 'react'

/**
 * @docs
 * Properties for the Switch component.
 */
export interface SwitchProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type' | 'children'> {
  /**
   * Ref to the underlying native `<input type="checkbox">` element.
   */
  ref?: React.Ref<HTMLInputElement>

  /**
   * Error message. When set, puts the switch in an error state.
   * The message itself is only rendered when `showError` is `true`.
   */
  error?: React.ReactNode

  /**
   * Whether to show the check icon when the switch is checked.
   * @default true
   */
  showIcon?: boolean
}
