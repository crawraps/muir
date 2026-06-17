import type { ButtonProps } from '../../button'

/**
 * @docs
 * Properties for the ToggleButton component.
 */
export interface ToggleButtonProps extends Omit<ButtonProps, 'variant' | 'onToggle'> {
  /**
   * The current checked state.
   * If provided, the component becomes controlled.
   */
  checked?: boolean

  /**
   * Alias for `checked`. Kept for backward compatibility.
   * Prefer using `checked` instead.
   */
  toggled?: boolean

  /**
   * Whether to show the check icon when checked.
   * @default true
   */
  showCheckIcon?: boolean

  /**
   * Called whenever the checked state changes.
   */
  onToggle?: (checked: boolean) => void
}
