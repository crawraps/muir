import type React from 'react'
import type { DefaultValues, FieldErrors, FieldPath, FieldValues, Mode, UseFormReturn } from 'react-hook-form'
import type { ObjectSchema } from 'yup'

/**
 * @docs
 * Imperative handle for the Form component.
 * Provides programmatic access to form methods without interacting with react-hook-form directly.
 */
export interface FormHandle<T extends FieldValues = FieldValues> {
  /** Submit the form programmatically. */
  submit: () => Promise<void>
  /** Reset form to defaultValues or provided values. */
  reset: (values?: DefaultValues<T>) => void
  /** Get current form values. */
  getValues: () => T
  /** Set a single field value. */
  setValue: (name: FieldPath<T>, value: unknown, options?: { shouldValidate?: boolean }) => void
  /** Trigger validation for specific fields or all fields. */
  validate: (name?: FieldPath<T> | FieldPath<T>[]) => Promise<boolean>
  /** Clear specific or all errors. */
  clearErrors: (name?: FieldPath<T> | FieldPath<T>[]) => void
  /** Set focus on a field. */
  setFocus: (name: FieldPath<T>) => void
}

/**
 * @docs
 * Properties for the Form component.
 */
export interface FormProps<T extends FieldValues = FieldValues> extends Omit<React.FormHTMLAttributes<HTMLFormElement>, 'onSubmit' | 'onError'> {
  /**
   * Ref to the imperative form handle.
   */
  ref?: React.Ref<FormHandle<T>>

  /**
   * Yup schema for validation. Drives type inference for the entire form.
   */
  schema?: ObjectSchema<T>

  /**
   * Default values for form fields.
   */
  defaultValues?: DefaultValues<T>

  /**
   * Validation strategy: when to validate fields.
   * @default 'onSubmit'
   */
  validateOn?: Mode

  /**
   * Validation strategy for re-validation after an error.
   * @default 'onChange'
   */
  revalidateOn?: Exclude<Mode, 'all' | 'onTouched'>

  /**
   * Called on successful validation with the form data.
   */
  onSubmit?: (data: T, event?: React.BaseSyntheticEvent) => void | Promise<void>

  /**
   * Called when validation fails.
   */
  onError?: (errors: FieldErrors<T>, event?: React.BaseSyntheticEvent) => void
}

/**
 * Value exposed by the internal form context to child field components.
 */
export interface FormContextValue<T extends FieldValues = FieldValues> {
  /** The underlying react-hook-form instance. Used internally by field components. */
  form: UseFormReturn<T>
}

/**
 * Field state exposed by the useFormField hook.
 */
export interface FormFieldState {
  /** Current field value. */
  value: unknown
  /** onChange handler. */
  onChange: (...event: unknown[]) => void
  /** onBlur handler. */
  onBlur: () => void
  /** Field ref for focus management. */
  ref: React.RefCallback<HTMLElement>
  /** Whether the field has a validation error. */
  error: boolean
  /** The error message string, if any. */
  errorText?: string
  /** Whether the field value has been modified. */
  isDirty: boolean
  /** Whether the field has been interacted with. */
  isTouched: boolean
  /** The field name. */
  name: string
}

/**
 * @docs
 * Properties for the Form.Field render-prop component.
 */
export interface FormFieldProps<T extends FieldValues = FieldValues> {
  /**
   * The field name, corresponding to a key in the form schema.
   */
  name: FieldPath<T>

  /**
   * Render function receiving the field state.
   */
  children: (field: FormFieldState) => React.ReactNode
}
