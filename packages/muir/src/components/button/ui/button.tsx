import { createElement } from 'react'
import { atr } from '../../../shared'
import type { ButtonProps } from '../model/properties'
import { Animated } from './animation'
import styling from './public.module.css'

function Button({ variant = 'filled', surface, ...props }: ButtonProps) {
  const isAnchor = props.href !== undefined

  const handleClick = (ev: React.MouseEvent<HTMLButtonElement>) => {
    if (props.readOnly) return
    if (props.onClick) props.onClick(ev)
  }

  const Tag = isAnchor ? 'a' : 'button'

  return (
    <Animated>
      {createElement(
        Tag,
        {
          ...props,
          className: cx('button', styling.button, props.className),
          onClick: handleClick,
          variant,
          'is-readonly': atr(props.readOnly),
          'is-icon': atr(props.icon),
          disabled: isAnchor ? undefined : props.disabled,
        },
        <div className={cx('state-layer')}>
          <span className={cx('ripple')} />
        </div>,
        <span className={cx('content')}>{props.children}</span>,
      )}
    </Animated>
  )
}

export default Button
