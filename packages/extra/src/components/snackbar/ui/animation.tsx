import { AnimeScope, type AnimeScopeInit, useComponentDidUpdate, useTheme } from '@muir/base'
import { type Scope, spring, waapi } from 'animejs'
import type { JSX } from 'react'
import { useRef } from 'react'

const init: AnimeScopeInit = (scope, theme) => {
  if (!scope?.root) return

  const snackbar = scope.root.querySelector<HTMLElement>(`.${cx('snackbar')}`)
  if (!snackbar) return

  const spatial = spring(theme.expressive.default.spatial)
  const effects = spring(theme.expressive.default.effects)

  scope.add('enter', () => {
    if (!snackbar) return
    waapi.animate(snackbar, {
      opacity: [0, 1],
      scale: [0.95, 1],
      y: ['1rem', '0rem'],
      duration: effects.duration,
      ease: spatial,
    })
  })
}

export function Animated({ isHiding, onComplete, children }: { isHiding: boolean; onComplete: () => void; children: JSX.Element }) {
  const scopeRef = useRef<Scope>(null)
  const onCompleteRef = useRef(onComplete)
  onCompleteRef.current = onComplete
  const themeContext = useTheme()
  const hasAnimatedExit = useRef(false)

  useComponentDidUpdate(() => {
    if (isHiding && !hasAnimatedExit.current) {
      hasAnimatedExit.current = true

      const root = scopeRef.current?.root
      if (!root) return
      const snackbar = root.querySelector<HTMLElement>(`.${cx('snackbar')}`)
      if (!snackbar) return

      const spatial = spring(themeContext.theme.motion.expressive.default.spatial)
      waapi.animate(snackbar, {
        opacity: [1, 0],
        scale: [1, 0.95],
        y: ['0rem', '-1rem'],
        duration: themeContext.theme.motion.expressive.fast.effects.duration,
        ease: spatial,
        onComplete: () => {
          onCompleteRef.current()
        },
      })
    } else if (!isHiding) {
      scopeRef.current?.methods.enter()
    }
  }, [isHiding, themeContext.theme.motion])

  return (
    <AnimeScope init={init} ref={scopeRef}>
      {children}
    </AnimeScope>
  )
}
