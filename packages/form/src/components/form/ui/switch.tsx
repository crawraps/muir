import { useFormContext } from 'react-hook-form'
import { Switch } from '@muir/base'
import type { FormSwitchProps } from '../model/properties'

/**
 * A Form-integrated Switch that connects to the parent Form's react-hook-form context.
 * Handles registration, validation errors, and value synchronization automatically.
 */
function FormSwitch({ name, error, ...props }: FormSwitchProps) {
  const {
    register,
    formState: { errors },
  } = useFormContext()

  const { ref: registerRef, ...field } = register(name)
  const fieldError = errors[name]
  const errorMessage = error ?? (fieldError?.message as React.ReactNode)

  return <Switch error={errorMessage} ref={registerRef} {...field} {...props} />
}

export default FormSwitch
