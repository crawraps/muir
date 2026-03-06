import type { FormEventHandler } from 'react'
import type { FieldPath } from 'react-hook-form'

export interface TextFieldProps<FormValues extends Record<string, unknown>> extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size' | 'type' | 'name'> {
  /**
   * The name of the control, required for association with form data.
   * Must be undefined if no FormContext provided
   *
   * @prop immutable
   */
  name?: FieldPath<FormValues>
  variant?: 'filled' | 'outlined'
  size?: 'small' | 'medium' | 'large'
  type?: 'text' | 'textarea' | 'password' | 'email' | 'number' | 'tel' | 'url' | 'search'
  label?: string
  error?: boolean
  errorText?: string
  noAsterisk?: boolean
  prefixText?: string
  suffixText?: string
  supportingText?: string
  textDirection?: 'ltr' | 'rtl' | 'auto'
  rows?: number
  cols?: number
  leadingIcon?: string | React.ReactElement<{ slot: string }>
  trailingIcon?: string | React.ReactElement<{ slot: string }>
  onChange?: FormEventHandler<HTMLElement>
}
