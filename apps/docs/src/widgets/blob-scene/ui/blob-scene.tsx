import { createBlob } from '../model/generator'
import type { BlobSceneProps } from '../model/properties'
import { Animated } from './animation'

function BlobScene({ blob, layers = 7, scaleStep = 0.9, ...props }: BlobSceneProps) {
  const { path } = createBlob(blob)
  const targetColor = blob?.targetColor ?? 'var(--md-sys-color-primary)'
  const layerCount = Math.max(layers, 1)

  const initialBlob = useMemo(() => createBlob(blob), [])

  return (
    <Animated points={path}>
      <svg aria-hidden viewBox='0 0 3000 3000' {...props}>
        {Array.from({ length: layerCount }, (_, i) => {
          const scale = 1 + (layerCount - 1 - i) * scaleStep
          const pct = ((i + 1) / layerCount) * 100
          return (
            <path
              d={initialBlob.path}
              key={`layer-${i}-${scale}`}
              style={{
                fill: `color-mix(in oklch, ${targetColor} ${pct}%, var(--md-sys-color-surface-container))`,
                transform: `scale(${scale})`,
                transformOrigin: `${450}px ${2400}px`,
              }}
            />
          )
        })}
        <path className={cx('blob-target')} />
      </svg>
    </Animated>
  )
}

export default BlobScene
