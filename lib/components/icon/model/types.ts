import type { SVGProps } from 'react'

export interface IconProps extends SVGProps<SVGSVGElement> {
  /**
   * The id of a SVG Symbol defined in the current document
   */
  name: string
  slot?: string
}
