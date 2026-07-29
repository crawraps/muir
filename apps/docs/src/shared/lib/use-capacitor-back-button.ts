import { App } from '@capacitor/app'
import { useEffect } from 'react'

let registered = false

/**
 * Wires the native/Capacitor back button (and Android back gesture) into
 * the browser history. Uses `window.history.back()` so the navigation
 * library decides whether to navigate back within the current tab stack.
 *
 * Call once at app startup. In a normal browser (no Capacitor runtime) the
 * listener is a no-op.
 */
export function useCapacitorBackButton() {
  useEffect(() => {
    if (registered) return
    registered = true

    const listenerPromise = App.addListener('backButton', () => {
      window.history.back()
    })

    return () => {
      registered = false
      listenerPromise
        .then(listener => listener.remove())
        .catch((error: unknown) => {
          if (import.meta.env.DEV) {
            console.debug('[docs] Capacitor back-button listener not available', error)
          }
        })
    }
  }, [])
}

/**
 * Imperative registration variant for use outside React components.
 * Falls back to `window.history.back()` when router context is
 * unavailable (e.g. before the app mounts).
 */
export function registerCapacitorBackButton() {
  if (registered) return () => {}
  registered = true

  App.addListener('backButton', () => {
    window.history.back()
  }).catch((error: unknown) => {
    if (import.meta.env.DEV) {
      console.debug('[docs] Capacitor back-button listener not available', error)
    }
  })

  return () => {
    registered = false
  }
}
