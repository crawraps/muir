import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import type { SnackEntry, SnackOptions, SnackTemplate } from './properties'

const DEFAULT_TEMPLATES: Record<string, SnackTemplate> = {
  default: {
    duration: 2000,
    content: '',
    anchors: ['bottom', 'left', 'right'],
  },
}

/** Generate a unique snackbar ID. */
let nextId = 1

/** Hook that manages the snackbar queue: show, hide, dismiss, list, auto-hide timers. */
export function useSnackbarQueue(userTemplates?: Record<string, SnackTemplate>) {
  const templates = useMemo(() => ({ ...DEFAULT_TEMPLATES, ...userTemplates }), [userTemplates])
  const [snacks, setSnacks] = useState<SnackEntry[]>([])
  const timersRef = useRef<Map<number, ReturnType<typeof setTimeout>>>(new Map())

  const hide = useCallback((id?: number) => {
    setSnacks(prev => {
      if (id !== undefined) {
        return prev.map(s => (s.id === id ? { ...s, isHiding: true } : s))
      }
      return prev.map(s => ({ ...s, isHiding: true }))
    })
  }, [])

  const dismiss = useCallback((id?: number) => {
    setSnacks(prev => {
      if (id !== undefined) {
        const timer = timersRef.current.get(id)
        if (timer) {
          clearTimeout(timer)
          timersRef.current.delete(id)
        }
        return prev.filter(s => s.id !== id)
      }
      for (const timer of Array.from(timersRef.current.values())) {
        clearTimeout(timer)
      }
      timersRef.current.clear()
      return []
    })
  }, [])

  const show = useCallback(
    (options: SnackOptions): number => {
      const id = nextId++
      const templateKey = options.template ?? 'default'
      const template = templates[templateKey] ?? templates.default!

      const entry: SnackEntry = {
        id,
        content: options.content ?? template.content ?? '',
        template: templateKey,
        duration: options.duration ?? template.duration ?? 2000,
        anchors: options.anchors ?? template.anchors ?? DEFAULT_TEMPLATES.default.anchors!,
        surface: options.surface ?? template.surface,
        contentWrapper: options.contentWrapper ?? template.contentWrapper,
        style: options.style ?? template.style,
        isHiding: false,
      }

      setSnacks(prev => [...prev, entry])
      return id
    },
    [templates],
  )

  const list = useCallback((): SnackEntry[] => {
    return snacks.filter(s => !s.isHiding)
  }, [snacks])

  /** Remove a snackbar from state after its exit animation completes. Called by anime.js onComplete. */
  const onComplete = useCallback((id: number) => {
    setSnacks(prev => prev.filter(s => s.id !== id))
    const timer = timersRef.current.get(id)
    if (timer) {
      clearTimeout(timer)
      timersRef.current.delete(id)
    }
  }, [])

  // Auto-hide snackbars after their duration
  useEffect(() => {
    for (const snack of snacks) {
      if (snack.isHiding || snack.duration <= 0) continue
      if (timersRef.current.has(snack.id)) continue

      const timer = setTimeout(() => {
        hide(snack.id)
      }, snack.duration)

      timersRef.current.set(snack.id, timer)
    }
  }, [snacks, hide])

  // Cleanup all timers on unmount
  useEffect(() => {
    return () => {
      for (const timer of Array.from(timersRef.current.values())) {
        clearTimeout(timer)
      }
      timersRef.current.clear()
    }
  }, [])

  return { snacks, show, hide, dismiss, list, onComplete }
}
