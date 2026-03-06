import type { ChangeEvent } from 'react'
import type { FieldPath } from 'react-hook-form'

export interface SwitchProps<FormValues extends Record<string, unknown>> {
  /**
   * The name of the control, required for association with form data.
   * Must be undefined if no FormContext provided
   *
   * @prop immutable
   */
  name?: FieldPath<FormValues>
  selected?: boolean
  checked?: boolean
  disabled?: boolean
  required?: boolean
  /**
   * Shows both the selected and deselected icons.
   */
  icons?: boolean
  /**
   * Shows only the selected icon, and not the deselected icon. If true, overrides the behavior of the icons property.
   */
  showOnlySelectedIcon?: boolean
  onChange?: (event: ChangeEvent<HTMLInputElement>) => void
  className?: string
}
