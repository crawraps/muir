import { animate, spring } from 'animejs'
import type React from 'react'
import { useTheme } from '../../../app/theme-provider'

export function useAnimatedRoot(root: React.RefObject<HTMLElement | null>, { isRevealed, hiddenVector = '-150%' }: { isRevealed?: boolean; hiddenVector?: string | number }) {
  const themeContext = useTheme()
  useEffect(() => {
    if (!root.current) return

    animate(root.current, {
      ease: spring(themeContext.theme.motion.expressive.default.spatial),
      y: {
        to: isRevealed ? 0 : hiddenVector,
      },
    })
  }, [isRevealed, hiddenVector, root.current, themeContext.theme.motion.expressive.default.spatial])
}
