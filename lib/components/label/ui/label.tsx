import React, { useEffect, useRef } from 'react'
import { createSmartClsx } from '../../../shared'
import type { LabelProps } from '../model/types'

import styles from './style.module.css'

const clsx = createSmartClsx(styles)

function Label({ htmlFor, ...props }: LabelProps) {
  const element = useRef<HTMLLabelElement | HTMLSpanElement>(null)

  useEffect(() => {
    if (!element.current) return

    if (Array.from(element.current.children).some(child => child.hasAttribute('disabled'))) {
      element.current.setAttribute('disabled', '')
    } else {
      element.current.removeAttribute('disabled')
    }
  })

  return React.createElement(htmlFor ? 'label' : 'span', {
    ...props,
    className: clsx(['label'], props.className),
    htmlFor: typeof htmlFor === 'string' ? htmlFor : undefined,
    ref: element,
  })
}

export default Label
