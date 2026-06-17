import type React from 'react'

/**
 * @docs
 * Properties for the Icon component.
 */
export interface IconProps extends Omit<React.SVGAttributes<SVGSVGElement>, 'children' | 'name'> {
  /**
   * Ref to the underlying SVG element.
   */
  ref?: React.Ref<SVGSVGElement>
  /**
   * The name of the SVG symbol to display.
   */
  name: string

  /**
   * The size of the icon in pixels. The icon is always rendered as a square.
   * @default 1.25em
   */
  size?: number
}
