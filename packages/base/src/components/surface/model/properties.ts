import type React from 'react'
import type { SurfaceLightConfig } from 'src/app/theme-provider'

export interface GrainOverrides {
  density?: number
  opacity?: number
  light?: SurfaceLightConfig
}

/**
 * @docs
 * Properties for the Surface component.
 *
 * Crust variant visual properties are configured via CSS custom properties:
 * - `--surface-blur` — Backdrop blur amount (default: from theme)
 * - `--surface-opacity` — Surface transparency (default: from theme)
 * - `--surface-grain-density` — Grain pattern density (default: from theme)
 * - `--surface-grain-opacity` — Grain overlay opacity (default: from theme)
 */
export interface SurfaceProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'children'> {
  /**
   * Ref to the underlying HTML element.
   */
  ref?: React.Ref<HTMLDivElement>

  /**
   * Surface type.
   * - `plain` — solid color fill
   * - `crust` — frosted glass with backdrop blur and grain overlay
   * @default from theme's surface.type
   */
  type?: 'plain' | 'crust'

  /**
   * Grain configuration overrides. When provided, these values override
   * the theme's default surface grain settings.
   */
  grain?: GrainOverrides

  /**
   * The content rendered on top of the surface.
   */
  children?: React.ReactNode
}
