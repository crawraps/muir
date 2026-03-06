import { spring, waapi } from 'animejs'
import { useTheme } from '../../../app/theme-provider'

const dismissPoint = 1
const verticalOffsetScale = 500

export const useAnimations = (top = false, onDismiss?: () => void) => {
  const { theme } = useTheme()
  const root = useRef<HTMLDivElement>(null)

  const animate = useCallback(
    (position: number, dragDismiss = false) => {
      if (!root.current) return

      waapi.animate(root.current, {
        ease: spring(theme.motion.expressive.default.spatial),
        maxWidth: {
          ease: spring({ ...theme.motion.expressive.slow.spatial, duration: theme.motion.expressive.slow.spatial.duration * 2 }),
          to: position === -1 ? '2.5rem' : '45rem',
          delay: position === -1 ? 0 : theme.motion.expressive.slow.spatial.duration / 2,
        },
        '--dim': Math.max(position * 0.3, 0),
        scale: Math.min(1 - position * 0.05, 1),
        y: {
          to: `calc((100% + 1rem) * ${(Math.sqrt(position + 1)).toFixed(2)} * ${top ? '' : '-'}1)`,
          delay: position === -1 ? theme.motion.expressive.default.spatial.duration * 1.5 : 0,
        },
        ...(dragDismiss && { translate: `0 ${dismissPoint * 100}%` }),
      })
    },
    [theme, top],
  )

  useEffect(() => {
    if (!root.current) return

    const absoluteDismissPoint = Math.sqrt(root.current.getBoundingClientRect().height * dismissPoint * verticalOffsetScale)

    let origin = -1
    let offset = 0

    const handleDragStart = (e: MouseEvent) => {
      origin = e.clientX
      e.preventDefault()

      window.addEventListener('mousemove', handleDrag)
    }
    const handleDragEnd = (e: MouseEvent) => {
      e.preventDefault()
      window.removeEventListener('mousemove', handleDrag)

      if (Math.abs(offset) > absoluteDismissPoint) {
        animate(-1, true)
        onDismiss?.()
      } else {
        snapToOrigin()
      }

      origin = -1
      offset = 0
    }

    const handleDrag = (e: MouseEvent) => {
      if (!root.current) return

      offset = e.clientX - origin
      const yDiff = offset ** 2 / verticalOffsetScale
      root.current.style.translate = `${offset}px ${yDiff}px`

      if (Math.abs(offset) > absoluteDismissPoint) {
        handleDragEnd(e)
      }
    }

    const snapToOrigin = () => {
      if (!root.current) return new Promise<void>(resolve => resolve())

      root.current.style.transition = `${theme.motion.expressive.default.spatial.duration}ms translate ${theme.motion.expressive.default.spatial.curve}`
      root.current.style.translate = `0 0`

      return new Promise<void>(resolve =>
        setTimeout(() => {
          if (!root.current) return

          root.current.style.transition = ''
          resolve()
        }, theme.motion.expressive.default.spatial.duration),
      )
    }

    root.current.addEventListener('mousedown', handleDragStart)
    window.addEventListener('mouseup', handleDragEnd)
    return () => {
      root.current?.removeEventListener('mousedown', handleDragStart)
      window.removeEventListener('mouseup', handleDragEnd)
    }
  }, [animate, onDismiss, theme.motion.expressive.default.spatial.curve, theme.motion.expressive.default.spatial.duration])

  return { root, animate }
}
