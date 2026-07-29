import { Button } from '@muir/base'
import { useTabController } from '@muir/navigation'
import type { Props } from '../model/properties'

export default function ({ items, ...props }: Props) {
  const { switchTo } = useTabController()

  return (
    <nav className={cx('navbar')}>
      {items.map(item => (
        <Button
          key={item.name}
          onClick={() => {
            switchTo(item.link)
          }}
          variant='filled-tonal'
        >
          {item.name}
        </Button>
      ))}
    </nav>
  )
}
