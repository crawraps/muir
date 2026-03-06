import { createSmartClsx } from '../../../shared'
import type { Props } from '../model/types'
import styles from './style.module.css'

const clsx = createSmartClsx(styles)

function Container({ className, shape = 'none', emphasis = 'none', children, ...props }: Props) {
  return (
    <div className={clsx(['container'], className)} md-emphasis={emphasis} md-shape={shape} {...props}>
      {children}
    </div>
  )
}

export default Container
