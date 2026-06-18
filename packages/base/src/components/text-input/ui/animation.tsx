import { type Scope, spring, stagger, waapi } from 'animejs'
import type { JSX } from 'react'
import { useRef } from 'react'
import { AnimeScope, type AnimeScopeInit, useComponentDidUpdate } from 'src/shared'

const init: AnimeScopeInit = (scope, theme) => {
  if (!scope?.root) return

  const items = scope.root.querySelectorAll<HTMLElement>(`.${cx('error-item')}`)
  if (items.length === 0) return

  const spatial = spring(theme.expressive.default.spatial)
  const effects = spring(theme.expressive.default.effects)

  scope.add('reveal', () => {
    waapi.animate(items, {
      opacity: { from: 0, to: 1, ease: 'outExpo', duration: effects.duration },
      y: { from: '-0.5rem', to: '0rem', ease: spatial, duration: effects.duration },
      delay: stagger(100),
    })
  })

  scope.add('hide', () => {
    waapi.animate(items, {
      opacity: { from: 1, to: 0, ease: 'inExpo', duration: theme.expressive.fast.effects.duration },
      y: { from: '0rem', to: '-0.5rem', ease: spatial, duration: theme.expressive.fast.effects.duration },
      delay: stagger(50),
    })
  })
}

export function AnimatedErrors({ children }: { children: JSX.Element }) {
  const ref = useRef<Scope>(null)
  const isFirstRender = useRef(true)

  useComponentDidUpdate(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false
      return
    }
    ref.current?.methods.reveal()
  }, [])

  useEffect(() => {
    ref.current?.methods.reveal()
  }, [])

  return (
    <AnimeScope init={init} ref={ref}>
      {children}
    </AnimeScope>
  )
}
