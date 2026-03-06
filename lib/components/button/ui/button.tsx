import '@material/web/button/elevated-button.js'
import '@material/web/button/filled-button.js'
import '@material/web/button/filled-tonal-button.js'
import '@material/web/button/outlined-button.js'
import '@material/web/button/text-button.js'
import React, { useMemo } from 'react'

import { createSmartClsx } from '../../../shared'
import type { ButtonProps } from '../model/types'

import style from './style.module.css'

const clsx = createSmartClsx(style)

function Button({ children, variant = 'filled', size = 'medium', icon, readOnly, ...props }: ButtonProps) {
  const adjustShadowStyles = (el: HTMLElement) => {
    if (!el) return

    const sheet = new CSSStyleSheet()
    sheet.replaceSync(`.label { overflow: visible; }`)
    el.shadowRoot?.adoptedStyleSheets.push(sheet)
  }

  const childs = useMemo(() => {
    const childs = React.Children.toArray(children)

    if (icon) {
      childs.unshift(
        <svg key='icon' slot='icon'>
          <title>icon</title>
          <use href={icon} />
        </svg>,
      )
    }

    return childs
  }, [children, icon])

  return React.createElement(
    `md-${variant}-button`,
    {
      type: 'button',
      ...props,
      className: clsx(['button', size, variant, { 'read-only': readOnly }], props.className),
      ref: (el: HTMLElement) => {
        adjustShadowStyles(el)
      },
    },
    childs,
  )
}

export default Button
