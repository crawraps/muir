import type { SurfaceProps } from '@muir/base'
import type { Scope } from 'animejs'
import type { RefObject } from 'react'

export interface PaneProps extends SurfaceProps {
  animationScope?: RefObject<Scope | null>
}
