import { type DependencyList, type EffectCallback, useEffect, useRef } from 'react'

export function useComponentDidUpdate(callback: EffectCallback, deps: DependencyList) {
  const isInitialRender = useRef(true)

  useEffect(() => {
    if (isInitialRender.current) {
      isInitialRender.current = false
    } else {
      return callback()
    }
  }, deps)
}
