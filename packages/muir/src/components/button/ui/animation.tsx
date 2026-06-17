import { type Scope, spring, waapi } from 'animejs'
import type { JSX } from 'react'
import { useRef } from 'react'
import { AnimeScope, type AnimeScopeInit } from '../../../shared'

const getRippleElement = (button: HTMLElement | SVGElement, x: number, y: number) => {
  const rect = button.getBoundingClientRect()
  const size = Math.max(rect.width, rect.height) * 2

  const rippleEl = button.querySelector(`.${cx('ripple')}`) satisfies HTMLElement | null
  if (!rippleEl) throw new Error('Ripple element not found')

  rippleEl.style.left = `${x}px`
  rippleEl.style.top = `${y}px`
  rippleEl.style.width = `${size}px`
  rippleEl.style.height = `${size}px`

  return rippleEl
}

const init: AnimeScopeInit = (scope, theme) => {
  if (!(scope?.root instanceof HTMLButtonElement)) return

  const RIPPLE_OPACITY = 0.18

  const effects = spring(theme.expressive.fast.effects)

  const stateLayer = scope.root.querySelector(`.${cx('state-layer')}`)
  if (!stateLayer) return

  scope.root.addEventListener('mousedown', ev => {
    ev.preventDefault()

    const rippleEl = getRippleElement(scope.root, ev.clientX, ev.clientY)
    waapi.animate(rippleEl, {
      scale: [0, 1],
      opacity: [RIPPLE_OPACITY, 0],
      duration: theme.expressive.fast.spatial.duration,
      ease: effects,
    })
  })
}

interface AnimatedProps {
  children: JSX.Element
}

export function Animated({ children }: AnimatedProps) {
  const scopeRef = useRef<Scope>(null)

  return (
    <AnimeScope init={init} ref={scopeRef}>
      {children}
    </AnimeScope>
  )
}
