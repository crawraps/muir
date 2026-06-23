import { RadioButton } from '@muir/base'
import { useFormContext } from 'react-hook-form'
import type { FormRadioButtonProps } from '../model/properties'

/**
 * A Form-integrated RadioButton that connects to the parent Form's react-hook-form context.
 * Handles registration, validation errors, and value synchronization automatically.
 */
function FormRadioButton({ name, error, ...props }: FormRadioButtonProps) {
  const {
    register,
    formState: { errors },
  } = useFormContext()

  const { ref: registerRef, ...field } = register(name)
  const fieldError = errors[name]
  const errorMessage = error ?? (fieldError?.message as React.ReactNode)

  return <RadioButton error={errorMessage} ref={registerRef} {...field} {...props} />
}

export default FormRadioButton
