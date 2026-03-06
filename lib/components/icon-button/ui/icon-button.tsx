import '@material/web/iconbutton/filled-icon-button.js'
import '@material/web/iconbutton/filled-tonal-icon-button.js'
import '@material/web/iconbutton/icon-button.js'
import '@material/web/iconbutton/outlined-icon-button.js'
import React, { useMemo } from 'react'

import { createSmartClsx } from '../../../shared'
import type { IconButtonProps } from '../model/types'

import style from './style.module.css'

const clsx = createSmartClsx(style)

function IconButton({ variant = 'standard', size = 'medium', icon, selectedIcon, ...props }: IconButtonProps) {
  const childs = useMemo(() => {
    const childs = [
      <svg key='icon'>
        <title>Icon</title>
        <use href={icon} />
      </svg>,
    ]

    if (selectedIcon) {
      childs.push(
        <svg key='selected-icon' slot='selected-icon'>
          <title>Selected Icon</title>
          <use href={selectedIcon} />
        </svg>,
      )
    }

    return childs
  }, [icon, selectedIcon])

  const tagName = variant === 'standard' ? 'md-icon-button' : `md-${variant}-icon-button`

  return React.createElement(tagName, { ...props, className: clsx(['icon-button', size, variant], props.className) }, childs)
}

export default IconButton
