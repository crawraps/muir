import { useFormState } from 'react-hook-form'
import { useTheme } from '../../../app/theme-provider'
import { Button } from '../../button'
import { LoadingIndicator } from '../../loading-indicator'
import { Revealer } from '../../revealer'
import type { SubmitButtonProps } from '../model/type'

function SubmitButton<FormValues extends Record<string, unknown>>({
  variant = 'filled',
  size = 'medium',
  onSubmit,
  loadingIcon,
  children,
  className,
  readOnly,
  showLoadingState,
  ...props
}: SubmitButtonProps<FormValues>) {
  const formState = useFormState()
  const { theme } = useTheme()

  const isLoading = showLoadingState && formState.isSubmitting && !formState.isValidating

  return (
    <Button
      {...props}
      className={clsx(['button', { error: Object.keys(formState.errors).length, loading: isLoading, success: formState.isSubmitSuccessful }], className)}
      readOnly={readOnly || isLoading}
      size={size}
      type='submit'
      variant={variant}
    >
      <Revealer isRevealed={!isLoading}>{children}</Revealer>
      <Revealer className={clsx(['loading-icon-revealer'])} hiddenVector='150%' isRevealed={isLoading}>
        {loadingIcon ?? <LoadingIndicator color={theme.palette['on-primary']} />}
      </Revealer>
    </Button>
  )
}

export default SubmitButton
