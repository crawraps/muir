import { atr, Button, Icon } from '@muir/capacitor'
import { type TabDefinition, useIsTabActive, useTabItemHref } from '@muir/navigation'
import { Link } from 'wouter'

export function NavEntry({ tab }: { tab: TabDefinition }) {
  const active = useIsTabActive(tab.id)
  const href = useTabItemHref(tab)
  const icon = tab.icon as string | undefined

  // When the tab is already active, the button resets to the tab's base path
  // (e.g. the components list) instead of re-navigating to the remembered path.
  const target = active ? tab.path : href

  return (
    <Link asChild href={target}>
      <Button className={cx('button')} is-active={atr(active)} variant='text'>
        {icon && <Icon name={icon} />}
      </Button>
    </Link>
  )
}
