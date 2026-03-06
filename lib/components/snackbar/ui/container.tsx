import type { ReactNode } from 'react'
import type { Snackbar } from '../model/queue'
import style from './style.module.css'

interface SnackbarContainerProps extends Snackbar {
  children: ReactNode
  position: string
}

export default function SnackbarContainer(props: SnackbarContainerProps) {
  const position = {
    top: props.position === 'bottom' ? '100%' : 'unset',
    bottom: props.position === 'top' ? '100%' : 'unset',
  }

  return (
    <div className={style.container} style={position}>
      {props.children}
    </div>
  )
}
