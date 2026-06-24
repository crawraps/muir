import { useScrollRestore } from '@muir/navigation'
import { useRef } from 'react'
import { Pane } from 'src/entities/pane'

export function HomePage() {
  const scrollRef = useRef<HTMLDivElement>(null)
  useScrollRestore(scrollRef)

  return (
    <div className={cx('page')} ref={scrollRef}>
      <Pane>
        <div className={cx('content')}>
          <h1>Welcome</h1>
          <p>Pick a component from the Docs tab to get started.</p>
        </div>
      </Pane>
    </div>
  )
}
