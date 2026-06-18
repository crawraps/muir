import type { ReactElement } from 'react'
import { createElement } from 'react'
import { atr } from 'src/shared/attributify'
import type { TextProps } from '../model/properties'
import { useText } from '../model/use-text'
import styling from './public.module.css'

/**
 * A Material Design 3 Text component.
 * Renders semantic HTML elements with theme-based typography styles.
 */
function Text({ type, size, className, ref, ...props }: TextProps): ReactElement {
  const { tag, scale, resolvedSize } = useText({ type, size })

  return createElement(tag, {
    className: cx('text', styling.text, className),
    scale,
    'text-size': resolvedSize,
    'is-anchor': atr(type === 'anchor'),
    ref,
    ...props,
  })
}

export default Text
