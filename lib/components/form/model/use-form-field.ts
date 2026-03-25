import type { FieldValues } from 'react-hook-form'
import { useController } from 'react-hook-form'
import { useFormContext } from './context'
import type { FormFieldState } from './types'

/**
 * Hook for connecting a field component to the parent Form.
 * Returns field state and handlers without exposing react-hook-form internals.
 *
 * @param name - The field name matching a key in the form schema.
 */
export function useFormField<T extends FieldValues = FieldValues>(name: string): FormFieldState {
  const { form } = useFormContext<T>()
  const { field, fieldState } = useController({ name: name as never, control: form.control })

  return {
    value: field.value,
    onChange: field.onChange,
    onBlur: field.onBlur,
    ref: field.ref,
    name: field.name,
    error: !!fieldState.error,
    errorText: fieldState.error?.message,
    isDirty: fieldState.isDirty,
    isTouched: fieldState.isTouched,
  }
}
