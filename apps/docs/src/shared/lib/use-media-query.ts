import { useEffect, useState } from 'react'

/**
 * Subscribes to a CSS media query and returns whether it currently matches.
 *
 * `query` must be a stable string (e.g. `'(max-width: 1200px)'`); the hook
 * re-subscribes whenever it changes. SSR-safe: returns `false` until the
 * effect runs on the client.
 */
export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(false)

  useEffect(() => {
    const mql = window.matchMedia(query)
    const update = () => setMatches(mql.matches)
    update()
    mql.addEventListener('change', update)
    return () => mql.removeEventListener('change', update)
  }, [query])

  return matches
}
