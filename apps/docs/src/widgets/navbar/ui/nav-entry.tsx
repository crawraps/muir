import { atr, Button, Icon } from '@muir/capacitor'
import { type TabDefinition, useIsTabActive, useTabItemHref } from '@muir/navigation'
import { Link } from 'wouter'

export function NavEntry({ tab }: { tab: TabDefinition }) {
  const active = useIsTabActive(tab.id)
  const href = useTabItemHref(tab)
  const icon = tab.icon as string | undefined

  return (
    <Link asChild href={href}>
      <Button className={cx('button')} is-active={atr(active)} variant='text'>
        {icon && <Icon name={icon} />}
      </Button>
    </Link>
  )
}
