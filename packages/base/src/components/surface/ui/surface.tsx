import { useTheme } from 'src/app/theme-provider'
import { atr } from 'src/shared/attributify'
import type { GrainOverrides, SurfaceProps } from '../model/properties'
import { ensureGrainClass, type GrainFilterParams } from './grain'
import styling from './public.module.css'

function Surface({ type, grain, children, ...props }: SurfaceProps) {
  const { theme } = useTheme()
  const resolvedType = type ?? theme.surface.type
  const isCrust = resolvedType === 'crust'

  const grainConfig: Required<GrainOverrides> & { light: Required<NonNullable<GrainOverrides['light']>> } = {
    density: grain?.density ?? theme.surface.grain.density,
    opacity: grain?.opacity ?? theme.surface.grain.opacity,
    light: {
      surfaceScale: grain?.light?.surfaceScale ?? theme.surface.grain.light.surfaceScale,
      elevation: grain?.light?.elevation ?? theme.surface.grain.light.elevation,
      specularity: grain?.light?.specularity ?? theme.surface.grain.light.specularity,
    },
  }

  const grainClass = isCrust
    ? ensureGrainClass({
        density: grainConfig.density,
        surfaceScale: grainConfig.light.surfaceScale,
        elevation: grainConfig.light.elevation,
        specularity: grainConfig.light.specularity,
      } satisfies GrainFilterParams)
    : ''

  return (
    <div
      {...props}
      className={cx('root', styling.root, props.className, grainClass)}
      data-surface={atr(resolvedType)}
      style={{ '--surface-opacity': grain?.opacity, ...props.style } as React.CSSProperties}
    >
      <div className={cx('content')} data-content=''>
        {children}
      </div>
    </div>
  )
}

export default Surface
