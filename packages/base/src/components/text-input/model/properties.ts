import type React from 'react'

/**
 * @docs
 * Properties for the TextInput component.
 */
export interface TextInputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'prefix' | 'type' | 'children'> {
  /**
   * Ref to the underlying HTML input or textarea element.
   */
  ref?: React.Ref<HTMLInputElement | HTMLTextAreaElement>

  /**
   * The input type.
   * @default 'text'
   */
  type?: 'text' | 'email' | 'password' | 'number' | 'search' | 'tel' | 'url'

  /**
   * Label text displayed in the chrome header.
   */
  label?: React.ReactNode

  /**
   * Comment text shown below the input.
   */
  comment?: React.ReactNode

  /**
   * Error message(s) shown below the input. When set, the input enters an error state.
   * Pass a ReactNode for a single error, or an array for multiple errors rendered sequentially with animation.
   */
  errors?: React.ReactNode | React.ReactNode[]

  /**
   * If true, renders a `<textarea>` instead of an `<input>`.
   * @default false
   */
  multiline?: boolean

  /**
   * Number of visible rows when multiline is true.
   * @default 3
   */
  rows?: number
}
