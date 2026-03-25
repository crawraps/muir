import type React from 'react'

/**
 * @docs
 * Properties for the Button component.
 */
export interface ButtonProps extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'prefix'> {
  /**
   * Ref to the underlying HTML element.
   */
  ref?: React.Ref<HTMLElement>
  /**
   * The visual variant of the button.
   * @default 'filled'
   */
  variant?: 'elevated' | 'filled' | 'outlined' | 'text' | 'filled-tonal'

  /**
   * If defined, the component will render as an `<a>` tag instead of a `<button>`.
   */
  href?: string

  /**
   * The target attribute if the button acts as a link.
   */
  target?: '_blank' | '_self' | '_parent' | '_top' | string

  /**
   * If true, prevents user interaction but unlike disabled, may still be focusable.
   */
  readOnly?: boolean

  /**
   * If true, forces the button into a square icon-button shape (no padding, width equals height).
   */
  icon?: boolean

  /**
   * The content of the button. Can accept multiple children in a row.
   */
  children?: React.ReactNode
}
