import { Switch, useTheme } from '@muir/base'
import { useRef } from 'react'
import { Pane } from 'src/entities/pane'
import { useScrollRestore } from 'src/shared/lib'

export function SettingsPage() {
  const scrollRef = useRef<HTMLDivElement>(null)
  useScrollRestore(scrollRef)
  const theme = useTheme()

  const isDark = theme.mode === 'dark'

  return (
    <Pane className={cx('page')} ref={scrollRef}>
      <div className={cx('content')}>
        <h1>Settings</h1>
        <label className={cx('setting')}>
          <span className={cx('label')}>Dark theme</span>
          <Switch checked={isDark} onChange={() => theme.updateTheme(isDark ? 'light' : 'dark')} />
        </label>
      </div>
    </Pane>
  )
}
