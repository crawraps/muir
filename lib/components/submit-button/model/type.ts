import type React from 'react'
import type { FieldErrors } from 'react-hook-form'
import type { ButtonProps } from '../../button'

export interface SubmitButtonProps<FormValues extends Record<string, unknown>> extends Omit<ButtonProps, 'onSubmit'> {
  onSubmit?: (data: FormValues | null, errors?: FieldErrors<FormValues>, event?: React.BaseSyntheticEvent) => unknown
  showLoadingState?: boolean
  loadingIcon?: React.ReactElement
}
