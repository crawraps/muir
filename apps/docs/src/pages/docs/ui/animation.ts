import { animate, scrambleText, spring } from 'animejs'
import type { AnimeScopeType, Theme } from 'muir-capacitor'

export function animeInit(scope: AnimeScopeType, motion: Theme['motion']) {
  if (!scope?.root) return

  const ease = spring(motion.expressive.default.effects)

  scope.add('reveal', () => {
    const incoming = scope.root.querySelector<HTMLElement>('[data-transition="incoming"]')
    if (!incoming) return

    animate(incoming, {
      opacity: [0, 1],
      y: [10, 0],
      ease,
    })

    const h1 = incoming.querySelector('h1')
    if (h1) {
      animate(h1, {
        innerHTML: scrambleText({
          cursor: '_',
          settleDuration: 150,
          revealDelay: ease.duration / 2,
        }),
      })
    }
  })

  scope.add('disappear', (onComplete: () => void) => {
    const outgoing = scope.root.querySelector<HTMLElement>('[data-transition="outgoing"]')
    if (!outgoing) {
      onComplete()
      return
    }

    animate(outgoing, {
      opacity: [1, 0],
      y: [0, -10],
      ease,
      onComplete,
    })
  })
}

