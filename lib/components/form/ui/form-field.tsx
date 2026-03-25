import type { FieldValues } from 'react-hook-form'
import type { FormFieldProps } from '../model/types'
import { useFormField } from '../model/use-form-field'

/**
 * A render-prop component for connecting custom inputs to the parent Form.
 * Exposes field state without leaking react-hook-form internals.
 */
function FormField<T extends FieldValues = FieldValues>({ name, children }: FormFieldProps<T>) {
  const field = useFormField<T>(name)

  return <>{children(field)}</>
}

export default FormField
