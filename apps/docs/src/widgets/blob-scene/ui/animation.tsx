import { animate, type Scope, stagger, svg } from 'animejs'
import type { JSX } from 'react'
import { AnimeScope, type AnimeScopeInit } from 'muir-capacitor'

const init: AnimeScopeInit = (scope, _motion) => {
  if (!scope?.root) return

  const allPaths = Array.from(scope.root.querySelectorAll('path'))
  const visiblePaths = allPaths.slice(0, -1).reverse()
  const targetPath = allPaths[allPaths.length - 1]

  scope.add('morph', (points: string) => {
    targetPath.setAttribute('d', points)

    animate(visiblePaths, {
      d: svg.morphTo(targetPath, 0.1),
      ease: 'outExpo',
      duration: 1500,
      delay: stagger(80),
    })
  })
}

/**
 * Wraps the blob SVG in an `AnimeScope`. Each visible `<path>`
 * is morphed with a staggered delay so back layers start
 * slightly after front layers.
 */
export function Animated({ children, points }: { children: JSX.Element; points: string }) {
  const scopeRef = useRef<Scope>(null)

  useEffect(() => {
    scopeRef.current?.methods.morph(points)
  }, [points])

  return (
    <AnimeScope init={init} ref={scopeRef}>
      {children}
    </AnimeScope>
  )
}
