import { type Scope, spring, waapi } from 'animejs'
import { useEffect, useRef } from 'react'
import { useFormState } from 'react-hook-form'
import { useTheme } from '../../../app/theme-provider'
import { AnimeScope, type AnimeScopeType, createSmartClsx } from '../../../shared'
import type { FormLoadingIndicatorProps } from '../model/types'
import LoadingIndicator from './loading-indicator'
import style from './style.module.css'

const clsx = createSmartClsx(style)

function FormLoadingIndicator({ className }: FormLoadingIndicatorProps) {
  const formState = useFormState()

  const isLoading = formState.isSubmitting && !formState.isValidating

  const scope = useRef<Scope>(null)
  useEffect(() => {
    if (!scope.current) return
    if (isLoading) {
      scope.current.methods.display()
    } else {
      scope.current.methods.hide()
    }
  }, [isLoading])

  const { theme } = useTheme()
  const scopeInit = (scope: AnimeScopeType) => {
    if (!scope) return

    scope.add('display', () => {
      waapi.animate(scope.root, {
        visibility: 'visible',
        opacity: 1,
        backdropFilter: 'blur(4px)',
        ease: spring(theme.motion.expressive.fast.effects),
      })
    })

    scope.add('hide', () => {
      waapi.animate(scope.root, {
        visibility: {
          to: 'hidden',
          delay: 1000,
        },
        opacity: 0,
        backdropFilter: 'blur(0px)',
        ease: spring(theme.motion.expressive.fast.effects),
      })
    })
  }

  return (
    <AnimeScope init={scopeInit} ref={scope}>
      <div className={clsx('form-loading-indicator', { className })}>
        <LoadingIndicator color={theme.palette.secondary} />
      </div>
    </AnimeScope>
  )
}

export default FormLoadingIndicator
