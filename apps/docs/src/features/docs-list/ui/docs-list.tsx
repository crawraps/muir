import { Button } from '@muir/base'
import { useLocation } from '@muir/navigation'
import { getAvailableDocs } from 'src/entities/docs'
import type { DocsListProps } from '../model/types'

export function DocsList({ className }: DocsListProps) {
  const docs = getAvailableDocs()
  const [, navigate] = useLocation()

  return (
    <div className={cx('docs-list', className)}>
      {docs.map(doc => (
        <Button
          key={doc}
          onClick={() => {
            navigate(`/docs/${doc}`)
          }}
          variant='text'
        >
          {doc}
        </Button>
      ))}
    </div>
  )
}
