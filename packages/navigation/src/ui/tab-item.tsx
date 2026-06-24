import { Link } from 'wouter'
import type { TabItemProps } from '../model/types'
import { useTabItemHref } from '../model/use-tab-item-href'
import { useIsTabActive } from '../model/use-tab-navigation'
import { createSmartClsx } from '../shared/smart-clsx'
import styles from './style.module.css'

const cx = createSmartClsx(styles)

export function TabItem({ tab, className, children }: TabItemProps) {
  const active = useIsTabActive(tab.id)
  const href = useTabItemHref(tab)
  const resolved = typeof className === 'function' ? className(active) : className

  return (
    <Link className={cx('tab-item', resolved)} href={href}>
      {children}
    </Link>
  )
}
