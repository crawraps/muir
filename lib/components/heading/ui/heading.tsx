import React from 'react'
import { createSmartClsx } from '../../../shared'
import type { Props } from '../model/types'
import styles from './style.module.css'

const clsx = createSmartClsx(styles)

function Heading({ children, className, level = 1, variant = false, ...props }: Props) {
  return React.createElement(
    `h${level}`,
    {
      className: clsx(['heading', variant && 'variant'], className),
      ...props,
    },
    children,
  )
}

export default Heading
