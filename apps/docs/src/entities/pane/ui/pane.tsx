import { AnimeScope, type AnimeScopeInit, Surface } from '@muir/base'
import { animate, spring } from 'animejs'
import type { PaneProps } from '../model/types'

export function Pane({ children, className, animationScope, ...props }: PaneProps) {
  return (
    <AnimeScope init={animationInit} ref={animationScope}>
      <Surface
        className={cx('pane', className)}
        type='crust'
        {...props}
        grain={{
          light: {
            surfaceScale: 3,
            elevation: 5,
            specularity: 2,
          },
        }}
      >
        {children}
      </Surface>
    </AnimeScope>
  )
}

const animationInit: AnimeScopeInit = (scope, motion) => {
  if (!scope?.root) return

  const ease = spring(motion.expressive.default.spatial)

  scope.add('fadeIn', done => {
    animate(scope.root, {
      x: [-40, 0],
      opacity: [0, 1],
      ease,
      onComplete: done,
    })
  })

  scope.add('fadeOut', done => {
    animate(scope.root, {
      x: [0, 40],
      opacity: [1, 0],
      ease,
      onComplete: done,
    })
  })
}
