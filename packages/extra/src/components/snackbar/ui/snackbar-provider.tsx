import { atr } from '@muir/base'
import { useEffect, useMemo } from 'react'
import type { ResolvedPosition, SnackbarActions, SnackbarProviderProps, SnackEntry } from '../model/properties'
import { resolveAnchors } from '../model/properties'
import { registerProvider, SnackbarContext, unregisterProvider } from '../model/snackbar-context'
import { useSnackbarQueue } from '../model/use-snackbar-queue'
import Snackbar from './snackbar'
import styles from './style.module.css'

/** Group snackbars by their resolved anchor position. */
function groupByPosition(entries: SnackEntry[]): Map<string, { position: ResolvedPosition; entries: SnackEntry[] }> {
  const map = new Map<string, { position: ResolvedPosition; entries: SnackEntry[] }>()
  for (const entry of entries) {
    const position = resolveAnchors(entry.anchors)
    const key = `${position.vertical}-${position.horizontal}`
    const group = map.get(key)
    if (group) {
      group.entries.push(entry)
    } else {
      map.set(key, { position, entries: [entry] })
    }
  }
  return map
}

/**
 * SnackbarProvider renders snackbars at viewport edges, grouped by anchor position.
 * Register with the module-level `snackbar` object for imperative control.
 */
function SnackbarProvider({ children, templates, style }: SnackbarProviderProps) {
  const { snacks, show, hide, dismiss, list, onComplete } = useSnackbarQueue(templates)

  console.log(
    '[snackbar] SnackbarProvider render: snacks=',
    snacks.length,
    snacks.map(s => ({ id: s.id, isHiding: s.isHiding, content: s.content })),
  )

  const actions = useMemo<SnackbarActions>(() => ({ show, hide, dismiss, list }), [show, hide, dismiss, list])

  useEffect(() => {
    registerProvider(actions)
    return () => {
      unregisterProvider()
    }
  }, [actions])

  const groups = useMemo(() => groupByPosition(snacks), [snacks])
  console.log(
    '[snackbar] SnackbarProvider: groups=',
    Array.from(groups.entries()).map(([k, v]) => ({ key: k, position: v.position, count: v.entries.length })),
  )

  return (
    <SnackbarContext.Provider value={actions}>
      {children}
      {Array.from(groups.entries()).map(([, { position, entries }]) => (
        <div
          className={cx('anchor-group', styles.anchorGroup)}
          data-horizontal={atr(position.horizontal)}
          data-vertical={atr(position.vertical)}
          key={`${position.vertical}-${position.horizontal}`}
          style={style}
        >
          {entries.map(entry => (
            <Snackbar entry={entry} key={entry.id} onComplete={onComplete} onHide={hide} />
          ))}
        </div>
      ))}
    </SnackbarContext.Provider>
  )
}

export default SnackbarProvider
