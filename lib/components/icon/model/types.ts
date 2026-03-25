import type React from 'react'

/**
 * @docs
 * Properties for the Icon component.
 */
export interface IconProps extends React.SVGAttributes<SVGSVGElement> {
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
   * @default 24
   */
  size?: number
}
