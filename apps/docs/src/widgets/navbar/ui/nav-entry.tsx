import { atr, Button, Icon } from '@muir/capacitor'
import { Link, useLocation } from 'wouter'
import type { NavEntry as NavEntryType } from '../model/types'

export function NavEntry(entry: NavEntryType) {
  const [location] = useLocation()
  const isActive = entry.href === '/' ? location === '/' : location.startsWith(entry.href)

  return (
    <Link className={cx('nav-entry')} href={entry.href}>
      <Button className={cx('button')} is-active={atr(isActive)} variant='text'>
        <Icon name={entry.icon} />
      </Button>
    </Link>
  )
}
