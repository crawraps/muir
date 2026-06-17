import { type Scope, spring, waapi } from 'animejs'
import type { JSX } from 'react'
import { useRef } from 'react'
import { AnimeScope, type AnimeScopeInit, useComponentDidUpdate } from '../../../shared'

const init: AnimeScopeInit = (scope, theme) => {
  if (!scope?.root) return

  const backdrop = scope.root.querySelector<HTMLElement>(`.${cx('backdrop')}`)
  const sheet = scope.root.querySelector<HTMLElement>(`.${cx('sheet')}`)
  if (!backdrop || !sheet) return

  const spatial = spring(theme.expressive.default.spatial)
  const effects = spring(theme.expressive.default.effects)

  scope.add('open', () => {
    if (!backdrop || !sheet) return
    waapi.animate(backdrop, {
      opacity: { from: 0, to: 1 },
      visibility: ['hidden', 'visible'],
      duration: effects.duration,
      ease: spatial,
    })
    waapi.animate(sheet, {
      y: { from: '100%', to: '0%' },
      duration: effects.duration,
      ease: spatial,
    })
  })

  scope.add('close', () => {
    if (!backdrop || !sheet) return
    waapi.animate(backdrop, {
      opacity: { from: 1, to: 0 },
      visibility: ['visible', 'hidden'],
      duration: theme.expressive.fast.effects.duration,
      ease: spatial,
    })
    waapi.animate(sheet, {
      y: { from: '0%', to: '100%' },
      duration: theme.expressive.fast.effects.duration,
      ease: spatial,
    })
  })
}

export function Animated({ isOpen, children }: { children: JSX.Element; isOpen: boolean }) {
  const ref = useRef<Scope>(null)

  useComponentDidUpdate(() => {
    if (isOpen) {
      ref.current?.methods.open()
    } else {
      ref.current?.methods.close()
    }
  }, [isOpen])

  return (
    <AnimeScope init={init} ref={ref}>
      {children}
    </AnimeScope>
  )
}
