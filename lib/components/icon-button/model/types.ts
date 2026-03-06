import type { ButtonProps } from '../../button/model/types'

export interface IconButtonProps extends Omit<ButtonProps, 'children' | 'icon' | 'trailingIcon' | 'variant'> {
  variant?: 'standard' | 'filled' | 'filled-tonal' | 'outlined'
  icon: string
  toggle?: boolean
  selectedIcon?: string
}
