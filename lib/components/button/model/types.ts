import type React from 'react'
export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'elevated' | 'filled' | 'outlined' | 'text' | 'filled-tonal'
  size?: 'small' | 'medium' | 'large'
  /**
   * link to an SVG Symbol (e.g. '#icon-id')
   */
  icon?: string
  trailingIcon?: boolean
  href?: string
  target?: '_blank' | '_self' | '_parent' | '_top' | string
  children?: React.ReactNode
  readOnly?: boolean
}
