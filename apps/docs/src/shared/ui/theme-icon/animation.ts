import { animate, set, spring, waapi } from 'animejs'
import type { AnimeScopeType, Theme } from 'muir-capacitor'

const mapping = {
  light: '36%',
  dark: '0%',
  auto: '-37%',
}

export function initAnimation(scope: AnimeScopeType, motion: Theme['motion']) {
  if (!scope?.root) return
  const line = scope.root.querySelector('[data-name="line"]') as HTMLElement

  const ease = spring(motion.expressive.default.spatial)
  scope.add('cycleTo', (theme: keyof typeof mapping) => {
    animate(line, {
      y: mapping[theme],
      ease,
    })
  })

  scope.add('instantlyCycleTo', (theme: keyof typeof mapping) => {
    console.log(line, mapping[theme])
    set(line, { y: mapping[theme] })
  })
}
