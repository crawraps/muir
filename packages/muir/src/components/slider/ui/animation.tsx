import { type Scope, spring, waapi } from 'animejs'
import type { JSX } from 'react'
import { useRef } from 'react'
import { AnimeScope, type AnimeScopeInit, useComponentDidUpdate } from '../../../shared'

// Thumb state layer visual values (scale only)
// Priority order: idle > active > vague > inactive
const state = {
  inactive: 0.8,
  vague: 0.9,
  active: 1,
  idle: 1.1,
} as const

type StateKey = keyof typeof state

// Minimum hold duration (ms) for idle state to be visually shown
const pressedThreshold = 80

const fillForwards = { fill: 'forwards' as const }

const init: AnimeScopeInit = (scope, theme) => {
  if (!scope?.root) return

  // 1. DOM queries
  const thumbElement = scope.root.querySelector<HTMLElement>(`.${cx('thumb')}`)
  if (!thumbElement) return

  const interactTarget = (scope.root.closest('label') as HTMLElement) ?? scope.root

  // 2. Springs & constants
  const spatial = spring(theme.expressive.fast.spatial)
  const effects = spring(theme.expressive.fast.effects)

  // 3. State machine
  let currentState: StateKey = 'inactive'

  const isHovering = () => interactTarget.matches(':hover')
  const wasPressHeld = () => isPressed && Date.now() - pressStart >= pressedThreshold

  const resolveState = (hovering: boolean, pressing: boolean): StateKey => {
    if (pressing) return 'idle'
    if (hovering) return 'vague'
    return 'inactive'
  }

  // Press tracking
  let isPressed = false
  let pressStart = 0
  let pressTimer: ReturnType<typeof setTimeout> | undefined
  let wasPressShown = false

  // 4. Animators
  const animateThumbTo = (to: StateKey, easeOverride?: typeof spatial | typeof effects) => {
    waapi.animate(thumbElement, {
      scale: { from: state[currentState], to: state[to], ease: easeOverride ?? effects },
      ...fillForwards,
    })
    currentState = to
  }

  // 5. Scope methods
  scope.add('settle', () => {
    animateThumbTo(resolveState(isHovering(), false), spatial)
  })

  scope.add('listen', () => {
    const onHoverStart = () => {
      animateThumbTo(resolveState(true, isPressed))
    }

    const onHoverEnd = () => {
      if (isPressed) releasePress()
      animateThumbTo(resolveState(false, false))
    }

    const onPressStart = () => {
      isPressed = true
      pressStart = Date.now()
      animateThumbTo(resolveState(true, false))
      pressTimer = setTimeout(() => {
        wasPressShown = true
        animateThumbTo('idle')
      }, pressedThreshold)
    }

    const onPressEnd = () => {
      releasePress()
      animateThumbTo(resolveState(isHovering(), false))
    }

    const releasePress = () => {
      const wasHeld = wasPressHeld()
      isPressed = false
      clearTimeout(pressTimer)
      pressTimer = undefined
      wasPressShown = false
      if (wasHeld) animateThumbTo(resolveState(isHovering(), false), spatial)
    }

    interactTarget.addEventListener('mouseenter', onHoverStart)
    interactTarget.addEventListener('mouseleave', onHoverEnd)
    interactTarget.addEventListener('mousedown', onPressStart)
    interactTarget.addEventListener('mouseup', onPressEnd)

    scope.add('stopListen', () => {
      interactTarget.removeEventListener('mouseenter', onHoverStart)
      interactTarget.removeEventListener('mouseleave', onHoverEnd)
      interactTarget.removeEventListener('mousedown', onPressStart)
      interactTarget.removeEventListener('mouseup', onPressEnd)
    })
  })
}

export function Animated({ value, children }: { value: number | undefined; children: JSX.Element }) {
  const ref = useRef<Scope>(null)

  useComponentDidUpdate(() => {
    if (value !== undefined) {
      ref.current?.methods.settle()
    }
  }, [value])

  return (
    <AnimeScope init={init} ref={ref}>
      {children}
    </AnimeScope>
  )
}
