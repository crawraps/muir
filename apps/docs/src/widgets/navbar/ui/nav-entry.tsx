import { atr, Button, Icon } from '@muir/capacitor'
import { type TabDefinition, useIsTabActive, useTabMemory } from '@muir/navigation'
import { Link } from 'wouter'

export function NavEntry({ tab }: { tab: TabDefinition }) {
  const active = useIsTabActive(tab.id)
  const [memory] = useTabMemory(tab.id)
  const href = tab.persistent === false ? tab.path : memory.path
  const icon = tab.icon as string | undefined

  return (
    <Link asChild href={href}>
      <Button className={cx('button')} is-active={atr(active)} variant='text'>
        {icon && <Icon name={icon} />}
      </Button>
    </Link>
  )
}
