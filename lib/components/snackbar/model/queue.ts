import { useEffect, useState } from 'react'
import type { SnackbarContextType } from './context'
import type { Presets } from './presets'

export type Snackbar = {
  message?: string
  duration?: number | Promise<unknown>
  prefix?: React.ReactElement
  suffix?: React.ReactElement
  anchors?: {
    vertical: 'top' | 'bottom'
    horizontal: 'left' | 'right' | 'center'
  }
}

type SnackbarProperties = Snackbar & {
  id: number
  visible: boolean
}

export function useQueue(presets: Presets, animationDuration: number): SnackbarContextType & { list: SnackbarProperties[] } {
  const [queue, setQueue] = useState<SnackbarProperties[]>([])

  useEffect(() => {
    if (queue.find(s => !s.visible)) {
      setTimeout(() => {
        setQueue(queue =>
          queue.filter(snackbar =>
            queue
              .filter(s => s.visible)
              .map(s => s.id)
              .includes(snackbar.id),
          ),
        )
      }, animationDuration)
    }
  }, [queue, animationDuration])

  return {
    list: queue,
    queue: props => {
      const preset = presets.default

      if (props?.preset) {
        Object.assign(preset, presets[props.preset])
        if (!preset) throw new Error(`Preset "${props.preset}" not found`)
      }

      const id = Date.now()
      const snackbar = { ...preset, ...props, id, visible: true }

      if (typeof snackbar.duration === 'number') {
        setTimeout(() => {
          setQueue(prev => prev.map(s => ({ ...s, visible: false })))
        }, snackbar.duration)
      } else if (snackbar.duration != null && typeof snackbar.duration === 'object' && typeof snackbar.duration.then === 'function') {
        snackbar.duration.finally(() => {
          setQueue(prev => prev.map(s => ({ ...s, visible: false })))
        })
      }

      setQueue(prev => [snackbar, ...prev])
      return id
    },
    dismiss: id => {
      if (!queue.find(snackbar => snackbar.id === id)) throw new Error(`Snackbar with the id = ${id} not found`)
      setQueue(prev => prev.map(snackbar => (snackbar.id === id ? { ...snackbar, visible: false } : snackbar)))
    },
    dismissAll: () => {
      setQueue(prev => prev.map(s => ({ ...s, visible: false })))
    },
  }
}
