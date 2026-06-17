import type { Scope } from 'animejs'
import { useEffect, useRef } from 'react'
import { useLocation } from 'wouter'
import { AnimeScope, atr } from 'muir-capacitor'
import { getDocComponent } from 'src/entities/docs'
import { DocsMDXProvider } from 'src/features/mdx-renderer'
import { useAnimatedTransition } from 'src/shared/lib'
import { animeInit } from './animation'

export function Page() {
  const [location] = useLocation()
  const Component = getDocComponent(location.replace('/docs/', ''))

  const anime = useRef<Scope>(null)
  const { previous: Previous, current: Current, isTransitioning, completeExit } = useAnimatedTransition(Component)

  useEffect(() => {
    if (isTransitioning && Previous && anime.current) {
      anime.current.methods.disappear(completeExit)
      anime.current.methods.reveal()
    }
  }, [isTransitioning, Previous, completeExit])
  //
  // useEffect(() => {
  //   if (!isTransitioning && anime.current) {
  //     anime.current.methods.reveal()
  //   }
  // }, [Current, isTransitioning])

  if (!Current && !Previous) return null
  return (
    <AnimeScope init={animeInit} ref={anime}>
      <div className={cx('page')}>
        <div className={cx(['docs-pane'])}>
          {Previous && isTransitioning && (
            <div className={cx('docs-content', 'outgoing')} data-transition='outgoing'>
              <DocsMDXProvider>
                <Previous />
              </DocsMDXProvider>
            </div>
          )}
          {Current && (
            <div className={cx('docs-content')} data-transition='incoming' is-transitioning={atr(isTransitioning)}>
              <DocsMDXProvider>
                <Current />
              </DocsMDXProvider>
            </div>
          )}
        </div>
      </div>
    </AnimeScope>
  )
}

