import { useRef } from 'react'
import { Pane } from 'src/entities/pane'
import { useScrollRestore } from 'src/shared/lib'

export function AboutPage() {
  const scrollRef = useRef<HTMLDivElement>(null)
  useScrollRestore(scrollRef)

  return (
    <div className={cx('page')} ref={scrollRef}>
      <Pane>
        <div className={cx('content')}>
          <h1>About</h1>
          <p>Cuil is a set of accessible, customizable React components and utilities.</p>
        </div>
      </Pane>
    </div>
  )
}
