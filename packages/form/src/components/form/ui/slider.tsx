import { useFormContext } from 'react-hook-form'
import { Slider } from '@muir/base'
import type { FormSliderProps } from '../model/properties'

/**
 * A Form-integrated Slider that connects to the parent Form's react-hook-form context.
 * Handles registration, validation errors, and value synchronization automatically.
 */
function FormSlider({ name, error, ...props }: FormSliderProps) {
  const {
    register,
    formState: { errors },
  } = useFormContext()

  const { ref: registerRef, ...field } = register(name)
  const fieldError = errors[name]
  const errorMessage = error ?? (fieldError?.message as React.ReactNode)

  return <Slider error={errorMessage} ref={registerRef} {...field} {...props} />
}

export default FormSlider
