import { Link, useRoute } from 'wouter'
import { atr, Button, Icon } from 'muir-capacitor'
import type { NavEntry as NavEntryType } from '../model/types'

export function NavEntry(entry: NavEntryType) {
  const [match] = useRoute(`${entry.href}/*?`)

  return (
    <Link className={cx('nav-entry')} href={entry.href} replace>
      <Button className={cx('button')} is-active={atr(match)} variant='text'>
        <Icon name={entry.icon} />
      </Button>
    </Link>
  )
}
