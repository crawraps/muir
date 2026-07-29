import { animate, type JSAnimation, type Scope, set, spring, type WAAPIAnimation, waapi } from 'animejs'
import type { JSX } from 'react'
import { useRef } from 'react'
import { AnimeScope, type AnimeScopeInit } from 'src/shared'

const init: AnimeScopeInit = (scope, theme) => {
  if (!(scope?.root instanceof HTMLElement)) return

  const button = scope.root
  const effects = spring(theme.expressive.fast.effects)
  const spatial = spring(theme.expressive.fast.spatial)

  const rippleOpacity = Number(window.getComputedStyle(button).getPropertyValue('--active-state-opacity').trim())
  if (Number.isNaN(rippleOpacity)) return

  const activeRipple: HTMLElement | null = button.querySelector(`[data-ripple]`) as HTMLElement
  let activeAnimation: WAAPIAnimation | null = null
  let paddingAnimation: JSAnimation | null = null
  let keyboardPressed = false
  let isPressed = false

  const isExpressive = button.hasAttribute('is-expressive')
  const isVertical = button.getAttribute('data-animation-axis') === 'vertical'
  const varName = isVertical ? '--padding-y' : '--padding-x'
  const originalVarValue = window.getComputedStyle(button).getPropertyValue(varName)
  const expressiveScale = Number(window.getComputedStyle(button).getPropertyValue('--expressive-length-scale').trim()) || 1.15

  const isInteractive = () => !button.hasAttribute('is-readonly') && !button.hasAttribute('disabled')

  const releaseRipple = () => {
    if (!activeAnimation) return

    activeAnimation = waapi.animate(activeRipple, {
      opacity: 0,
      ease: effects,
      onComplete: () => {
        activeAnimation = null
      },
    })
  }

  const startRipple = (x: number, y: number) => {
    if (!isInteractive()) return

    activeAnimation?.cancel()

    const rect = button.getBoundingClientRect()
    set(activeRipple, {
      left: x - rect.left,
      top: y - rect.top,
      opacity: 'var(--active-state-opacity)',
    })

    activeAnimation = waapi.animate(activeRipple, {
      scale: [0, 1],
      duration: effects.duration,
      ease: 'outExpo',
    })
  }

  const startExpressivePress = () => {
    paddingAnimation?.cancel()
    paddingAnimation = animate(button, {
      [varName]: `*=${expressiveScale}`,
      ease: effects,
    })
  }

  const playExpressivePop = () => {
    paddingAnimation?.cancel()

    paddingAnimation = animate(button, {
      [varName]: [
        {
          to: `*=${expressiveScale}`,
          duration: 50,
        },
        {
          to: originalVarValue,
        },
      ],
      ease: spatial,
      onComplete: () => {
        paddingAnimation = null
      },
    })
  }

  const press = (x: number, y: number) => {
    if (!isInteractive()) return
    isPressed = true

    if (isExpressive) {
      startExpressivePress()
    } else {
      startRipple(x, y)
    }
  }

  const release = () => {
    if (!isPressed) return
    isPressed = false

    if (isExpressive) {
      playExpressivePop()
    } else {
      releaseRipple()
    }
  }

  button.addEventListener('pointerdown', ev => {
    if (ev.button !== 0 && ev.pointerType === 'mouse') return
    button.setPointerCapture(ev.pointerId)
    press(ev.clientX, ev.clientY)
  })

  button.addEventListener('pointerup', () => {
    release()
  })

  button.addEventListener('pointercancel', () => {
    release()
  })

  button.addEventListener('pointerleave', () => {
    release()
  })

  button.addEventListener('keydown', ev => {
    if (keyboardPressed) return
    if (ev.code !== 'Space' && ev.code !== 'Enter') return

    const rect = button.getBoundingClientRect()
    keyboardPressed = true
    press(rect.left + rect.width / 2, rect.top + rect.height / 2)
  })

  button.addEventListener('keyup', ev => {
    if (ev.code !== 'Space' && ev.code !== 'Enter') return
    if (!keyboardPressed) return

    keyboardPressed = false
    release()
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
