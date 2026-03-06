import { animate, type JSAnimation, random, randomPick } from 'animejs'
import { roundedPolygonByCircumRadius } from 'curved-polygon'
import { useTheme } from '../../../app/theme-provider'
import type { LoadingIndicatorProps } from '../model/types'

function LoadingIndicator({ playing = true, color, ...props }: LoadingIndicatorProps) {
  const { theme } = useTheme()

  const path = useRef<SVGPathElement>(null)

  const generateKeyframes = useCallback(() => {
    const iterations = random(4, 12)
    const iterationDuration = random(600, 1000)

    return {
      keyframes: new Array(iterations).fill(0).map((_, index) => {
        return {
          rotate: `+=${randomPick([120, 240, 360])}`,
          sideCount: index === 0 || index === iterations - 1 ? 6 : random(3, 9),
          duration: iterationDuration,
        }
      }),
      circumRadius: new Array(iterations)
        .fill(0)
        .map(() => [
          { to: 100, ease: 'out(1.68)', duration: iterationDuration / 2 },
          { to: 94, ease: 'in(1.68)', duration: iterationDuration / 2 },
        ])
        .flat(),
    }
  }, [])

  const args = useRef({
    circumRadius: 94,
    sideCount: 6,
    borderRadius: theme.shape.medium * 50,
    rotate: 0,
    cx: 100,
    cy: 100,
  })

  const animation = useRef<JSAnimation>(null)
  useEffect(() => {
    if (playing) {
      animation.current = animate(args.current, {
        ease: 'inOut',
        ...generateKeyframes(),
        loop: true,
        onUpdate() {
          path.current?.setAttribute('d', roundedPolygonByCircumRadius(args.current).d)
        },
      })
    }
  }, [generateKeyframes, playing])

  return (
    <svg className={clsx(['loading-indicator'], props.className)} viewBox='0 0 200 200'>
      <title>Loading indicator</title>
      <path d={roundedPolygonByCircumRadius(args.current).d} fill={color ?? theme.palette.primary} ref={path} />
    </svg>
  )
}

export default LoadingIndicator
