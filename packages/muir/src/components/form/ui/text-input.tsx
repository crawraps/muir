import { useFormContext } from 'react-hook-form'
import { TextInput } from '../../text-input'
import type { FormTextInputProps } from '../model/properties'

function FormTextInput({ name, errors, ...props }: FormTextInputProps) {
  const {
    register,
    formState: { errors: formErrors },
  } = useFormContext()

  const { ref: registerRef, ...field } = register(name)
  const fieldError = formErrors[name]
  const errorMessage = errors ?? (fieldError?.message as React.ReactNode)

  return <TextInput errors={errorMessage} ref={registerRef} {...field} {...props} />
}

export default FormTextInput
