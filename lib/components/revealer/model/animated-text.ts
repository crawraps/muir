import { random, randomPick, splitText, waapi } from 'animejs'
import { useEffect, useState } from 'react'
import { useTheme } from '../../../app/theme-provider'

export function useAnimatedText(root: React.RefObject<HTMLElement | null>, { isRevealed, hiddenVector = '-150%' }: { isRevealed?: boolean; hiddenVector?: string | number }) {
  const themeContext = useTheme()
  const [chars, setChars] = useState<HTMLElement[]>([])

  useEffect(() => {
    if (!root.current) return
    const { chars } = splitText(root.current, { chars: true })
    setChars(chars)
  }, [root.current])

  useEffect(() => {
    const animatedCharacters = chars.map(() => false)

    const duration = themeContext.theme.motion.expressive.default.spatial.duration

    waapi.animate(chars, {
      duration: () => random(duration / 2, duration * 1.5),
      ease: themeContext.theme.motion.expressive.default.spatial.curve,
      y: {
        delay: () => {
          const unanimated = animatedCharacters.reduce((p, n, ind) => {
            if (!n) p.push(ind)
            return p
          }, [] as number[])

          const ind = Number(randomPick(unanimated))
          animatedCharacters[ind] = true

          return ind
        },
        to: isRevealed ? 0 : hiddenVector,
      },
    })
  }, [chars, isRevealed, hiddenVector, themeContext.theme.motion.expressive.default.spatial.curve, themeContext.theme.motion.expressive.default.spatial.duration])
}
