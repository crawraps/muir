import { createContext, useContext } from 'react'
import type { SnackbarActions, SnackEntry, SnackOptions } from './properties'

/** @internal Context for snackbar actions — null means no provider is mounted. */
export const SnackbarContext = createContext<SnackbarActions | null>(null)

/** Hook to consume snackbar actions from context. Throws if no provider. */
export function useSnackbarContext(): SnackbarActions {
  const ctx = useContext(SnackbarContext)
  if (!ctx) {
    console.error('[snackbar] useSnackbarContext: no provider found')
    throw new Error('snackbar must be used within a <SnackbarProvider>')
  }
  return ctx
}

// ── Internal registry ──────────────────────────────────────────────

/** Stored reference to the mounted provider's actions. */
let _provider: SnackbarActions | null = null

/** Register a provider — called when SnackbarProvider mounts. */
export function registerProvider(actions: SnackbarActions): void {
  console.log('[snackbar] registerProvider: provider registered')
  _provider = actions
}

/** Unregister a provider — called when SnackbarProvider unmounts. */
export function unregisterProvider(): void {
  console.log('[snackbar] unregisterProvider: provider unregistered')
  _provider = null
}

/**
 * Module-level snackbar object.
 * Delegates to the mounted SnackbarProvider's context.
 * Throws if called before a provider is mounted.
 */
export const snackbar: SnackbarActions = {
  show(options: SnackOptions): number {
    if (!_provider) {
      console.error('[snackbar] show: no provider registered')
      throw new Error('snackbar must be used within a <SnackbarProvider>')
    }
    const id = _provider.show(options)
    console.log('[snackbar] show: created snackbar id=', id, 'content=', options.content)
    return id
  },
  hide(id?: number): void {
    if (!_provider) {
      console.error('[snackbar] hide: no provider registered')
      throw new Error('snackbar must be used within a <SnackbarProvider>')
    }
    console.log('[snackbar] hide: id=', id)
    _provider.hide(id)
  },
  dismiss(id?: number): void {
    if (!_provider) {
      console.error('[snackbar] dismiss: no provider registered')
      throw new Error('snackbar must be used within a <SnackbarProvider>')
    }
    console.log('[snackbar] dismiss: id=', id)
    _provider.dismiss(id)
  },
  list(): SnackEntry[] {
    if (!_provider) {
      console.error('[snackbar] list: no provider registered')
      throw new Error('snackbar must be used within a <SnackbarProvider>')
    }
    const entries = _provider.list()
    console.log('[snackbar] list:', entries.length, 'active snackbars')
    return entries
  },
}
