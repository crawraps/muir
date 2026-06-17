import { type Scope, spring, waapi } from 'animejs'
import type { JSX } from 'react'
import { useRef } from 'react'
import { AnimeScope, type AnimeScopeInit, useComponentDidUpdate } from '../../../shared'

// State layer visual values (dot)
// Priority order: idle > active > vague > inactive
const state = {
  inactive: { opacity: 0, scale: 0 },
  vague: { opacity: 0.12, scale: 1 },
  active: { opacity: 1, scale: 1 },
  idle: { opacity: 0.18, scale: 1.3 },
} as const

type StateKey = keyof typeof state

// Minimum hold duration (ms) for idle state to be visually shown
const pressedThreshold = 80

const fillForwards = { fill: 'forwards' as const }

const init: AnimeScopeInit = (scope, theme) => {
  if (!scope?.root) return

  // 1. DOM queries
  const dotElement = scope.root.querySelector<HTMLElement>(`.${cx('dot')}`)
  if (!dotElement) return

  const input = scope.root.querySelector<HTMLInputElement>(`input`)
  if (!input) return

  // 2. Springs & constants
  const spatial = spring(theme.expressive.fast.spatial)
  const effects = spring(theme.expressive.fast.effects)

  // 3. State machine
  let currentState: StateKey = input.defaultChecked ? 'active' : 'inactive'

  if (input.defaultChecked) {
    dotElement.style.opacity = String(state.active.opacity)
    dotElement.style.transform = `scale(${state.active.scale})`
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
  const animateDotTo = (to: StateKey) => {
    const skippedActive = !wasPressShown && (to === 'active' || currentState === 'active')
    waapi.animate(dotElement, {
      scale: { from: state[currentState].scale, to: state[to].scale, ease: skippedActive ? spatial : effects },
      opacity: { from: state[currentState].opacity, to: state[to].opacity, ease: 'outExpo', duration: effects.duration },
      ...fillForwards,
    })
    currentState = to
  }

  // 5. Scope methods
  scope.add('check', () => {
    animateDotTo(resolveState(isHovering(), wasPressHeld()))
  })

  scope.add('uncheck', () => {
    animateDotTo(resolveState(isHovering(), wasPressHeld()))
  })

  scope.add('listen', () => {
    const ownListener = () => {
      if (input.checked) scope.methods.check()
      else scope.methods.uncheck()
    }
    input.addEventListener('change', ownListener)

    if (input.name && input.form) {
      const siblingListener = () => ownListener()
      input.form.addEventListener('change', siblingListener)
      scope.add('stopListen', () => {
        input.removeEventListener('change', ownListener)
        input.form!.removeEventListener('change', siblingListener)
      })
    } else if (input.name) {
      const handler = (e: Event) => {
        const target = e.target as HTMLInputElement
        if (target.type === 'radio' && target.name === input.name) ownListener()
      }
      document.addEventListener('change', handler)
      scope.add('stopListen', () => {
        input.removeEventListener('change', ownListener)
        document.removeEventListener('change', handler)
      })
    } else {
      scope.add('stopListen', () => input.removeEventListener('change', ownListener))
    }
  })

  // 6. Event handlers
  const releasePress = () => {
    isPressed = false
    clearTimeout(pressTimer)
    pressTimer = undefined
    wasPressShown = false
  }

  interactTarget.addEventListener('mouseenter', () => {
    if (isDisabled()) return
    animateDotTo(resolveState(true, isPressed))
  })

  interactTarget.addEventListener('mouseleave', () => {
    if (isDisabled()) return
    if (isPressed) releasePress()
    animateDotTo(resolveState(false, false))
  })

  interactTarget.addEventListener('mousedown', () => {
    if (isDisabled()) return
    isPressed = true
    pressStart = Date.now()
    animateDotTo(resolveState(true, false))
    pressTimer = setTimeout(() => {
      wasPressShown = true
      animateDotTo('idle')
    }, pressedThreshold)
  })

  interactTarget.addEventListener('mouseup', () => {
    if (isDisabled()) return
    releasePress()
    animateDotTo(resolveState(isHovering(), false))
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
