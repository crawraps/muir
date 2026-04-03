import { createElement } from 'react'
import type { ButtonProps } from '@/lib/components/button/model/types'

/**
 * A Material Design 3 Button component.
 * Allows multiple children in a row and supports multiple visual variants.
 */
function Button({ variant = 'filled', href, readOnly, icon, children, className, ...props }: ButtonProps) {
  const isAnchor = href !== undefined

  return createElement(
    isAnchor ? 'a' : 'button',
    {
      href,
      className: cx(['button', `variant-${variant}`, readOnly && 'readonly', icon && 'icon'], className),
      ...(isAnchor ? props : { ...props, disabled: props.disabled }),
    },
    createElement('div', { className: cx('state-layer') }),
    createElement('span', { className: cx('content') }, children),
  )
}

export default Button
