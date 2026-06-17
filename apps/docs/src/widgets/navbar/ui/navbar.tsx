import { Button, Icon, useTheme } from 'muir-capacitor'
import { ThemeIcon } from 'src/shared'
import type { Props } from '../model/types'
import { NavEntry } from './nav-entry'

export const Navbar = (props: Props) => {
  const theme = useTheme()

  return (
    <aside {...props} className={cx('navbar', props.className)}>
      <Button icon variant='text'>
        <Icon name={theme.mode === 'dark' ? 'muir-dark' : 'muir'} />
      </Button>
      <span className={cx('spacer')} />
      <nav>
        {(props.entries ?? []).map(entry => (
          <NavEntry key={entry.href} {...entry} />
        ))}
      </nav>
      <span className={cx('spacer')} />
      <div className={cx('toolbar')}>
        <Button icon onClick={() => theme.updateTheme(theme.mode === 'dark' ? 'light' : 'dark')} variant='text'>
          <ThemeIcon theme={theme.mode} />
        </Button>
      </div>
    </aside>
  )
}
