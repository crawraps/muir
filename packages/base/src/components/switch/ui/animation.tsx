import { type Scope, spring, waapi } from 'animejs'
import type { JSX } from 'react'
import { useRef } from 'react'
import { AnimeScope, type AnimeScopeInit, useComponentDidUpdate } from 'src/shared'

// Thumb state layer visual values (scale only — colors handled by CSS)
// Priority order: idle > active > vague > inactive
const state = {
  inactive: 0.6,
  vague: 0.7,
  active: 1,
  idle: 1.1,
} as const

type StateKey = keyof typeof state

// Minimum hold duration (ms) for idle state to be visually shown
const pressedThreshold = 60

const fillForwards = { fill: 'forwards' as const }

const init: AnimeScopeInit = (scope, theme) => {
  if (!scope?.root) return

  // 1. DOM queries
  const thumbElement = scope.root.querySelector<HTMLElement>(`.${cx('thumb')}`)
  if (!thumbElement) return

  const checkIcon = scope.root.querySelector<SVGElement>('svg')

  const input = scope.root.querySelector<HTMLInputElement>(`input`)
  if (!input) return

  // 2. Springs & constants
  const spatial = spring(theme.expressive.fast.spatial)
  const effects = spring(theme.expressive.fast.effects)

  // 3. State machine
  let currentState: StateKey = input.defaultChecked ? 'active' : 'inactive'

  const interactTarget = (scope.root.closest('label') as HTMLElement) ?? scope.root

  const isHovering = () => interactTarget.matches(':hover')
  const wasPressHeld = () => isPressed && Date.now() - pressStart >= pressedThreshold
  const isDisabled = () => input.disabled

  const resolveState = (hovering: boolean, pressing: boolean): StateKey => {
    if (pressing) return 'idle'
    if (input.checked) return 'active'
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
    const skippedActive = !wasPressShown && (to === 'active' || currentState === 'active')
    waapi.animate(thumbElement, {
      scale: { from: state[currentState], to: state[to], ease: easeOverride ?? (skippedActive ? spatial : effects) },
      ...fillForwards,
    })
    currentState = to
  }

  const animateThumbX = (from: string, to: string, ease: typeof spatial) => {
    waapi.animate(thumbElement, { x: { from, to, ease } })
  }

  const animateCheckIcon = (direction: 'in' | 'out') => {
    if (!checkIcon) return
    const isIn = direction === 'in'
    waapi.animate(checkIcon, {
      x: { from: isIn ? '-60%' : '0%', to: isIn ? '0%' : '-40%', ease: spatial },
      scale: { from: isIn ? '.8' : '1', to: isIn ? '1' : '.8', ease: spatial },
      opacity: { from: isIn ? 0 : 1, to: isIn ? 1 : 0, ease: effects },
      ...(isIn ? { delay: spatial.duration / 2 } : undefined),
    })
  }

  // 5. Scope methods
  scope.add('check', (withIcon: boolean) => {
    animateThumbX('0', '130%', spatial)
    animateThumbTo(resolveState(isHovering(), wasPressHeld()))
    if (withIcon) animateCheckIcon('in')
  })

  scope.add('uncheck', (withIcon: boolean) => {
    animateThumbX('130%', '0', spatial)
    animateThumbTo(resolveState(isHovering(), wasPressHeld()), spatial)
    if (withIcon) animateCheckIcon('out')
  })

  scope.add('listen', () => {
    const listener = () => {
      if (input.checked) scope.methods.check(true)
      else scope.methods.uncheck(true)
    }
    input.addEventListener('change', listener)
    scope.add('stopListen', () => input.removeEventListener('change', listener))
  })

  // 6. Event handlers
  const releasePress = () => {
    const wasHeld = wasPressHeld()
    isPressed = false
    clearTimeout(pressTimer)
    pressTimer = undefined
    wasPressShown = false
    if (wasHeld) animateThumbTo(resolveState(isHovering(), false), spatial)
  }

  interactTarget.addEventListener('mouseenter', () => {
    if (isDisabled()) return
    animateThumbTo(resolveState(true, isPressed))
  })

  interactTarget.addEventListener('mouseleave', () => {
    if (isDisabled()) return
    if (isPressed) releasePress()
    animateThumbTo(resolveState(false, false))
  })

  interactTarget.addEventListener('mousedown', () => {
    if (isDisabled()) return
    isPressed = true
    pressStart = Date.now()
    animateThumbTo(resolveState(true, false))
    pressTimer = setTimeout(() => {
      wasPressShown = true
      animateThumbTo('idle')
    }, pressedThreshold)
  })

  interactTarget.addEventListener('mouseup', () => {
    if (isDisabled()) return
    releasePress()
    animateThumbTo(resolveState(isHovering(), false))
  })
}

export function Animated({ checked, showIcon, children }: { checked: boolean | undefined; showIcon: boolean; children: JSX.Element }) {
  const ref = useRef<Scope>(null)

  useComponentDidUpdate(() => {
    if (checked === true) {
      ref.current?.methods.check(showIcon)
    } else if (checked === false) {
      ref.current?.methods.uncheck(showIcon)
    }
  }, [checked])

  useEffect(() => {
    if (checked !== undefined) return

    ref.current?.methods.listen()
    return () => {
      ref.current?.methods.stopListen()
    }
  }, [])

  return (
    <AnimeScope init={init} ref={ref}>
      {children}
    </AnimeScope>
  )
}
