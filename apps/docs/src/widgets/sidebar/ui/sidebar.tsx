import { Button } from '@muir/capacitor'
import { getAvailableDocs } from 'src/entities/docs'
import { Pane } from 'src/entities/pane'
import { Link, useLocation } from 'wouter'
import type { Props } from '../model/types'

export function Sidebar(props: Props) {
  const docs = getAvailableDocs()
  const [location] = useLocation()

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
