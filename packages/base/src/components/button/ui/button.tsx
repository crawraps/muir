import { createElement, Fragment } from 'react'
import { atr } from 'src/shared'
import type { ButtonProps } from '../model/properties'
import { Animated } from './animation'
import styling from './public.module.css'

function Button({ variant = 'filled', size = 'm', round = false, expressive = false, animationAxis = 'horizontal', surface, icon, ...props }: ButtonProps) {
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
          'data-size': size,
          'is-round': atr(round),
          'is-readonly': atr(props.readOnly),
          'is-icon': atr(icon),
          'is-expressive': atr(expressive),
          'data-animation-axis': animationAxis,
          disabled: isAnchor ? undefined : props.disabled,
        },
        <Fragment>
          {expressive || (
            <div className={cx('state-layer')}>
              <span className={cx('hover')} data-hover />
              <span className={cx('ripple')} data-ripple />
            </div>
          )}
          <span className={cx('content')}>{props.children}</span>
        </Fragment>,
      )}
    </Animated>
  )
}

export default Button
