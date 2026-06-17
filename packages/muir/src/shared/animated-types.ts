import type { JSX } from 'react'

/**
 * Base props for the `Animated` wrapper component.
 *
 * Each component's `animation.tsx` should extend this interface to define
 * its own animation-specific props while keeping `children` consistent.
 *
 * @example
 * ```ts
 * // lib/components/switch/ui/animation.tsx
 * interface SwitchAnimatedProps extends BaseAnimatedProps {
 *   checked: boolean | undefined
 *   showIcon: boolean
 * }
 * export function Animated({ checked, showIcon, children }: SwitchAnimatedProps) { ... }
 * ```
 */
export interface BaseAnimatedProps {
  children: JSX.Element
}
