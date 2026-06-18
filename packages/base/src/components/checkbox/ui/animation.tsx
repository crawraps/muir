import { type Scope, spring, waapi } from 'animejs'
import type { JSX } from 'react'
import { useRef } from 'react'
import { AnimeScope, type AnimeScopeInit, useComponentDidUpdate } from 'src/shared'

// State layer visual values (background)
// Priority order: idle > active > vague > inactive
const state = {
  inactive: { opacity: 0, scale: 0.5 },
  vague: { opacity: 0.4, scale: 0.65 },
  active: { opacity: 1, scale: 1 },
  idle: { opacity: 0.7, scale: 1.2 },
} as const

type StateKey = keyof typeof state

const boxScale = { resting: 1, held: 0.9 } as const

// Minimum hold duration (ms) for idle state to be visually shown
const pressedThreshold = 80

const fillForwards = { fill: 'forwards' as const }

const init: AnimeScopeInit = (scope, theme) => {
  if (!scope?.root) return

  // 1. DOM queries
  const checkElement = scope.root.querySelector<SVGElement>(`.${cx('check')}`)
  if (!checkElement) return

  const backgroundElement = scope.root.querySelector<HTMLElement>(`.${cx('background')}`)
  if (!backgroundElement) return

  const boxElement = scope.root.querySelector<HTMLElement>(`.${cx('box')}`)
  if (!boxElement) return

  const input = scope.root.querySelector<HTMLInputElement>(`input`)
  if (!input) return

  // 2. Springs & constants
  const spatial = spring(theme.expressive.fast.spatial)
  const effects = spring(theme.expressive.fast.effects)
  const distance = '16%'

  // 3. State machine
  let currentState: StateKey = input.defaultChecked ? 'active' : 'inactive'

  if (input.defaultChecked) {
    backgroundElement.style.opacity = String(state.active.opacity)
    backgroundElement.style.transform = `scale(${state.active.scale})`
  }

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

  // Press & focus tracking
  let isPressed = false
  let pressStart = 0
  let pressTimer: ReturnType<typeof setTimeout> | undefined
  let wasPressShown = false

  // 4. Animators
  const animateBackgroundTo = (to: StateKey, scaleEase?: typeof spatial | typeof effects) => {
    const skippedActive = !wasPressShown && (to === 'active' || currentState === 'active')
    waapi.animate(backgroundElement, {
      scale: { from: state[currentState].scale, to: state[to].scale, ease: scaleEase ?? (skippedActive ? spatial : effects) },
      opacity: { from: state[currentState].opacity, to: state[to].opacity, ease: 'outExpo', duration: effects.duration },
      ...fillForwards,
    })
    currentState = to
  }

  const animateBoxTo = (to: keyof typeof boxScale, from: keyof typeof boxScale, ease: typeof spatial | typeof effects) => {
    waapi.animate(boxElement, { scale: { from: boxScale[from], to: boxScale[to], ease }, ...(to !== 'resting' ? fillForwards : undefined) })
  }

  const animateCheckIcon = (direction: 'in' | 'out') => {
    const isIn = direction === 'in'
    waapi.animate(checkElement, {
      x: { from: isIn ? `-${distance}` : '0%', to: isIn ? '0%' : `${distance}`, ease: spatial },
      opacity: { from: isIn ? 0 : 1, to: isIn ? 1 : 0, ease: isIn ? 'outExpo' : 'inExpo', duration: effects.duration },
      scale: { from: isIn ? 0.5 : 1, to: isIn ? 1 : 0.8, ease: effects },
    })
  }

  // 5. Scope methods
  scope.add('check', () => {
    animateCheckIcon('in')
    animateBackgroundTo(resolveState(isHovering(), wasPressHeld()))
  })

  scope.add('uncheck', () => {
    animateCheckIcon('out')
    animateBackgroundTo(resolveState(isHovering(), wasPressHeld()))
  })

  scope.add('listen', () => {
    const onChange = () => {
      if (input.checked) scope.methods.check()
      else scope.methods.uncheck()
    }
    input.addEventListener('change', onChange)
    scope.add('stopListen', () => input.removeEventListener('change', onChange))
  })

  // 6. Event handlers
  const releasePress = () => {
    const wasHeld = wasPressHeld()
    isPressed = false
    clearTimeout(pressTimer)
    pressTimer = undefined
    wasPressShown = false
    if (wasHeld) animateBoxTo('resting', 'held', spatial)
  }

  interactTarget.addEventListener('mouseenter', () => {
    if (isDisabled()) return
    animateBackgroundTo(resolveState(true, isPressed))
  })

  interactTarget.addEventListener('mouseleave', () => {
    if (isDisabled()) return
    if (isPressed) releasePress()
    animateBackgroundTo(resolveState(false, false))
  })

  interactTarget.addEventListener('mousedown', () => {
    if (isDisabled()) return
    isPressed = true
    pressStart = Date.now()
    animateBackgroundTo(resolveState(true, false))
    pressTimer = setTimeout(() => {
      wasPressShown = true
      animateBackgroundTo('idle')
      animateBoxTo('held', 'resting', effects)
    }, pressedThreshold)
  })

  interactTarget.addEventListener('mouseup', () => {
    if (isDisabled()) return
    releasePress()
    animateBackgroundTo(resolveState(isHovering(), false))
  })
}

export function Animated({ checked, children }: { checked: boolean | undefined; children: JSX.Element }) {
  const ref = useRef<Scope>(null)

  useComponentDidUpdate(() => {
    if (checked === true) {
      ref.current?.methods.check()
    } else if (checked === false) {
      ref.current?.methods.uncheck()
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
