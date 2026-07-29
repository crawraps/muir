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
   * If true, uses equal horizontal and vertical padding for a compact square shape.
   */
  icon?: boolean
  /**
   * The size scale of the button.
   * @default 'm'
   */
  size?: 'xs' | 's' | 'm' | 'l' | 'xl'
  /**
   * If true, the button will have rounded corners.
   * @default false
   */
  round?: boolean
  /**
   * If true, enables expressive hover/active/release animations (proportional border-radius and padding pop).
   * @default false
   */
  expressive?: boolean
  /**
   * The axis along which expressive padding animations are applied.
   * @default 'horizontal'
   */
  animationAxis?: 'horizontal' | 'vertical'
  /**
   * Custom surface element rendered behind the content for filled, filled-tonal, and elevated variants.
   * Defaults to `<Surface />`.
   */
  surface?: React.ReactNode
  /**
   * The content of the button. Can accept multiple children in a row.
   */
  children?: React.ReactNode
}
