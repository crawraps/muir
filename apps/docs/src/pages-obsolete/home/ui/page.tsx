import { useRef } from 'react'
import { Pane } from 'src/entities/pane'
import { useScrollRestore } from 'src/shared/lib'

export function Page() {
  const scrollRef = useRef<HTMLDivElement>(null)
  useScrollRestore(scrollRef)

  return (
    <Pane className={cx('page')} ref={scrollRef}>
      <div className={cx('content')}>
        <h1>Welcome</h1>
        <p>Pick a component from the Docs tab to get started.</p>
      </div>
    </Pane>
  )
}
