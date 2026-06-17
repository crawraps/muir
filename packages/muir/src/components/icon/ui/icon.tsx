import type { IconProps } from '../model/properties'
import styling from './public.module.css'

/**
 * A Material Design 3 Icon component.
 * Renders an SVG symbol reference as a square icon.
 */
function Icon({ name, size, className, style, ref, ...props }: IconProps) {
  const href = `#${name}`
  const sizeStyle = size !== undefined ? ({ '--size': typeof size === 'number' ? `${size}px` : size } as React.CSSProperties) : undefined

  return (
    <svg aria-hidden='true' className={cx('icon', styling.icon, className)} ref={ref} style={{ ...sizeStyle, ...style }} {...props}>
      <use href={href} />
    </svg>
  )
}

export default Icon
