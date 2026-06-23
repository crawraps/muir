import { Button } from '@muir/capacitor'
import { useTabPath } from '@muir/navigation'
import { getAvailableDocs } from 'src/entities/docs'
import { Pane } from 'src/entities/pane'
import { Link } from 'wouter'
import type { Props } from '../model/types'

export function Sidebar(props: Props) {
  const docs = getAvailableDocs()
  const location = useTabPath()

  return (
    <Pane className={cx('sidebar', props.className)}>
      {docs.map(doc => (
        <Link className={cx('nav-link', { active: location === `/docs/${doc}` })} href={`/docs/${doc}`} key={doc}>
          <Button variant='text'>{doc}</Button>
        </Link>
      ))}
    </Pane>
  )
}
