import { Surface } from '@muir/capacitor'
import type { PaneProps } from '../model/types'

export function Pane({ children, className, ...props }: PaneProps) {
  return (
    <Surface
      className={cx('pane', className)}
      type='crust'
      {...props}
      grain={{
        light: {
          surfaceScale: 5,
          elevation: 15,
          specularity: 1.2,
        },
      }}
    >
      {children}
    </Surface>
  )
}
