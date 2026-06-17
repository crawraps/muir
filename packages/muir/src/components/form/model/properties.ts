import type React from 'react'
import type { DefaultValues, FieldErrors, FieldPath, FieldValues, Mode } from 'react-hook-form'
import type { ObjectSchema } from 'yup'
import type { CheckboxProps } from '../../checkbox'
import type { RadioButtonProps } from '../../radio-button'
import type { SliderProps } from '../../slider'
import type { SwitchProps } from '../../switch'
import type { TextInputProps } from '../../text-input'
import type { ToggleButtonProps } from '../../toggle-button'

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
 * @docs
 * Properties for the FormCheckbox component.
 */
export interface FormCheckboxProps extends Omit<CheckboxProps, 'name' | 'value' | 'defaultValue' | 'checked' | 'defaultChecked' | 'onChange' | 'onBlur'> {
  /**
   * The field name used to register with react-hook-form.
   */
  name: string
}

/**
 * @docs
 * Properties for the FormSwitch component.
 */
export interface FormSwitchProps extends Omit<SwitchProps, 'name' | 'value' | 'defaultValue' | 'checked' | 'defaultChecked' | 'onChange' | 'onBlur'> {
  /**
   * The field name used to register with react-hook-form.
   */
  name: string
}

/**
 * @docs
 * Properties for the FormRadioButton component.
 */
export interface FormRadioButtonProps extends Omit<RadioButtonProps, 'name' | 'defaultValue' | 'checked' | 'defaultChecked' | 'onChange' | 'onBlur'> {
  /**
   * The field name used to register with react-hook-form.
   */
  name: string

  /**
   * The value assigned to this radio option. Required because radios share a field name.
   */
  value: string | number
}

/**
 * @docs
 * Properties for the FormTextInput component.
 */
export interface FormTextInputProps extends Omit<TextInputProps, 'name' | 'value' | 'defaultValue' | 'onChange' | 'onBlur'> {
  /**
   * The field name used to register with react-hook-form.
   */
  name: string
}

/**
 * @docs
 * Properties for the FormToggleButton component.
 */
export interface FormToggleButtonProps extends Omit<ToggleButtonProps, 'toggled' | 'onToggle'> {
  /**
   * The field name used to register with react-hook-form.
   */
  name: string
}

/**
 * @docs
 * Properties for the FormSlider component.
 */
export interface FormSliderProps extends Omit<SliderProps, 'name' | 'value' | 'defaultValue' | 'onChange' | 'onBlur'> {
  /**
   * The field name used to register with react-hook-form.
   */
  name: string
}
