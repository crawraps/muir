import { AnimeScope, type AnimeScopeInit, useComponentDidUpdate, useTheme } from '@muir/base'
import { type Scope, spring, waapi } from 'animejs'
import type { JSX } from 'react'
import { useRef } from 'react'

const init: AnimeScopeInit = (scope, theme) => {
  console.log('[snackbar] animation init: scope=', scope?.root ? 'has root' : 'no root', 'theme=', theme ? 'has theme' : 'no theme')
  if (!scope?.root) return

  const snackbar = scope.root.querySelector<HTMLElement>(`.${cx('snackbar')}`)
  console.log('[snackbar] animation init: found .snackbar element=', !!snackbar)
  if (!snackbar) return

  const spatial = spring(theme.expressive.default.spatial)
  const effects = spring(theme.expressive.default.effects)

  scope.add('enter', () => {
    console.log('[snackbar] animation enter: running')
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

  console.log('[snackbar] Animated render: isHiding=', isHiding, 'hasAnimatedExit=', hasAnimatedExit.current)

  useComponentDidUpdate(() => {
    console.log('[snackbar] Animated componentDidUpdate: isHiding=', isHiding, 'hasAnimatedExit=', hasAnimatedExit.current)
    if (isHiding && !hasAnimatedExit.current) {
      hasAnimatedExit.current = true
      console.log('[snackbar] Animated: starting exit animation')

      const root = scopeRef.current?.root
      console.log('[snackbar] Animated exit: scopeRef.current?.root=', root ? 'found' : 'null')
      if (!root) return
      const snackbar = root.querySelector<HTMLElement>(`.${cx('snackbar')}`)
      console.log('[snackbar] Animated exit: found .snackbar=', !!snackbar)
      if (!snackbar) return

      const spatial = spring(themeContext.theme.motion.expressive.default.spatial)
      console.log('[snackbar] Animated exit: calling waapi.animate, duration=', themeContext.theme.motion.expressive.fast.effects.duration)
      waapi.animate(snackbar, {
        opacity: [1, 0],
        scale: [1, 0.95],
        y: ['0rem', '-1rem'],
        duration: themeContext.theme.motion.expressive.fast.effects.duration,
        ease: spatial,
        onComplete: () => {
          console.log('[snackbar] Animated exit: anime.js onComplete fired')
          onCompleteRef.current()
        },
      })
    } else if (!isHiding) {
      console.log('[snackbar] Animated: calling scope.methods.enter()')
      scopeRef.current?.methods.enter()
    }
  }, [isHiding, themeContext.theme.motion])

  return (
    <AnimeScope init={init} ref={scopeRef}>
      {children}
    </AnimeScope>
  )
}
