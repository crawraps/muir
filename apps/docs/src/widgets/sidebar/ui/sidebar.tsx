import { Link } from 'wouter'
import { Button } from 'muir-capacitor'
import { getAvailableDocs } from 'src/entities/docs'
import { Pane } from 'src/entities/pane'
import type { Props } from '../model/types'

export function Sidebar(props: Props) {
  const docs = getAvailableDocs()

  return (
    <Pane className={cx('sidebar', props.className)}>
      {docs.map(doc => (
        <Link className={isActive => cx({ active: isActive })} href={`/docs/${doc}`} key={doc} replace>
          <Button variant='text'>{doc}</Button>
        </Link>
      ))}
    </Pane>
  )
}
