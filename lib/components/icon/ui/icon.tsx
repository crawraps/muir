import type { IconProps } from '../model/types'

/**
 * A Material Design 3 Icon component.
 * Renders an SVG symbol reference as a square icon.
 */
function Icon({ name, size, className, ...props }: IconProps) {
  const href = `#${name}`

  return (
    <svg aria-hidden='true' className={cx('icon', className)} height={size} width={size} {...props}>
      <use href={href} />
    </svg>
  )
}

Icon.displayName = 'Icon'

export default Icon
