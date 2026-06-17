import { useFormContext } from 'react-hook-form'
import { Checkbox } from '../../checkbox'
import type { FormCheckboxProps } from '../model/properties'

/**
 * A Form-integrated Checkbox that connects to the parent Form's react-hook-form context.
 * Handles registration, validation errors, and value synchronization automatically.
 */
function FormCheckbox({ name, error, ...props }: FormCheckboxProps) {
  const {
    register,
    formState: { errors },
  } = useFormContext()

  const { ref: registerRef, ...field } = register(name)
  const fieldError = errors[name]
  const errorMessage = error ?? (fieldError?.message as React.ReactNode)

  return <Checkbox error={errorMessage} ref={registerRef} {...field} {...props} />
}

export default FormCheckbox
