import { useRef } from 'react'
import { Pane } from 'src/entities/pane'
import { DocsList } from 'src/features/docs-list'
import { useScrollRestore } from 'src/shared/lib'

export function DocsListPage() {
  const scrollRef = useRef<HTMLDivElement>(null)
  useScrollRestore(scrollRef)

  return (
    <Pane className={cx('docs-list-page')}>
      <div className={cx('scroll-area')} ref={scrollRef}>
        <DocsList />
      </div>
    </Pane>
  )
}
