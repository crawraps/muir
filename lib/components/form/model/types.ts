import type { RefObject } from 'react'
import type { FieldErrors, UseFormProps, UseFormReturn } from 'react-hook-form'
import type { InferType, ObjectSchema } from 'yup'

export type FormValuesFromSchema<Schema extends ObjectSchema<Record<string, unknown>>, FormValues extends Record<string, unknown> = InferType<Schema>> = FormValues

export type FormMethods<FormValues extends Record<string, unknown>> = Omit<UseFormReturn<FormValues, null, InferType<ObjectSchema<FormValues>>>, 'control'>
export type FormMethodsFromSchema<Schema extends ObjectSchema<Record<string, unknown>>> = FormMethods<FormValuesFromSchema<Schema>>

export interface FormProps<FormValues extends Record<string, unknown>> extends Omit<React.FormHTMLAttributes<HTMLFormElement>, 'onSubmit'>, UseFormProps<FormValues> {
  schema: ObjectSchema<FormValues>
  /**
   * Event fires regardless of validation state. If validation fails, data will be `null` and errors will be presented
   */
  onSubmit?: (data: InferType<ObjectSchema<FormValues>> | null, errors?: FieldErrors<FormValues>, event?: React.BaseSyntheticEvent) => unknown
  ref?: RefObject<FormMethods<FormValues> | null>
}
