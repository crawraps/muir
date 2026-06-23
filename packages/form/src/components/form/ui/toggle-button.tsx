import { ToggleButton } from '@muir/extra'
import { useFormContext } from 'react-hook-form'
import type { FormToggleButtonProps } from '../model/properties'

/**
 * A Form-integrated ToggleButton that connects to the parent Form's react-hook-form context.
 * Handles registration and value synchronization automatically.
 */
function FormToggleButton({ name, ...props }: FormToggleButtonProps) {
  const { register, setValue, watch } = useFormContext()

  register(name)
  const value = !!watch(name)

  return (
    <ToggleButton
      {...props}
      checked={value}
      onToggle={checked => {
        setValue(name, checked, { shouldDirty: true, shouldTouch: true })
      }}
    />
  )
}

export default FormToggleButton
