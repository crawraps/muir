import type React from 'react'

/**
 * A percentage string literal type for stop/origin values.
 * Use this when a value should be interpreted as a percentage of the range.
 */
export type PercentString = `${number}%`

/**
 * @docs
 * Properties for the Slider component.
 */
export interface SliderProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type' | 'children'> {
  /**
   * Ref to the underlying native `<input type="range">` element.
   */
  ref?: React.Ref<HTMLInputElement>

  /**
   * Error message. When set, puts the slider in an error state.
   * The message itself is only rendered when `showError` is `true`.
   */
  error?: React.ReactNode

  /**
   * Whether to render the `error` message below the slider.
   * @default false
   */
  showError?: boolean

  /**
   * Orientation of the slider.
   * @default 'horizontal'
   */
  orientation?: 'horizontal' | 'vertical'

  /**
   * Snap points for the slider thumb. Values can be absolute numbers
   * (within min/max range) or percentage strings (e.g. `'25%'`).
   * When provided, the slider thumb snaps to the nearest stop during drag.
   */
  stops?: (number | PercentString)[]

  /**
   * Origin point for the active fill. The fill stretches from the origin
   * to the current value, enabling bi-directional sliders.
   * Defaults to the `min` prop value when not set.
   * Accepts an absolute number or a percentage string.
   */
  origin?: number | PercentString
}
