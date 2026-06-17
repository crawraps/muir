import { useEffect, useState } from 'react'
import { useTheme } from '../../../app/theme-provider'
import { atr } from '../../../shared/attributify'
import type { GrainOverrides, SurfaceProps } from '../model/properties'
import { ensureGrainFilter, type GrainFilterParams } from './filter'
import styling from './public.module.css'

function Surface({ type, grain, children, ...props }: SurfaceProps) {
  const [filterId, setFilterId] = useState('')

  const { theme } = useTheme()
  const isCrust = (type ?? theme.surface.type) === 'crust'

  const grainConfig: Required<GrainOverrides> & { light: Required<NonNullable<GrainOverrides['light']>> } = {
    density: grain?.density ?? theme.surface.grain.density,
    opacity: grain?.opacity ?? theme.surface.grain.opacity,
    light: {
      surfaceScale: grain?.light?.surfaceScale ?? theme.surface.grain.light.surfaceScale,
      elevation: grain?.light?.elevation ?? theme.surface.grain.light.elevation,
      specularity: grain?.light?.specularity ?? theme.surface.grain.light.specularity,
    },
  }

  useEffect(() => {
    if (!isCrust) {
      setFilterId('')
      return
    }

    const params: GrainFilterParams = {
      density: grainConfig.density,
      surfaceScale: grainConfig.light.surfaceScale,
      elevation: grainConfig.light.elevation,
      specularity: grainConfig.light.specularity,
    }

    setFilterId(ensureGrainFilter(params))
  }, [isCrust, grainConfig.density, grainConfig.light.surfaceScale, grainConfig.light.elevation, grainConfig.light.specularity])

  return (
    <div
      {...props}
      className={cx('root', styling.root, props.className)}
      data-surface={atr(type ?? theme.surface.type)}
      style={{ '--surface-opacity': grain?.opacity, ...props.style } as React.CSSProperties}
    >
      {isCrust && filterId && (
        <svg aria-hidden='true' className={cx('grain')}>
          <defs>
            <pattern height='200' id={`${filterId}-pattern`} patternUnits='userSpaceOnUse' width='200'>
              <rect filter={`url(#${filterId})`} height='200' width='200' />
            </pattern>
          </defs>
          <rect fill={`url(#${filterId}-pattern)`} height='100%' width='100%' />
        </svg>
      )}
      <div className={cx('content')} data-content=''>
        {children}
      </div>
    </div>
  )
}

export default Surface
