import type { Scope } from 'animejs'
import { AnimeScope, Icon, useComponentDidUpdate } from '@muir/capacitor'
import { initAnimation } from './animation'
import type { ThemeIconProps } from './props'

export function ThemeIcon(props: ThemeIconProps) {
  const animeRef = useRef<Scope>(null)
  const mode = props.theme

  useEffect(() => {
    if (!animeRef.current) return
    animeRef.current.methods.instantlyCycleTo(mode)
  }, [])

  useComponentDidUpdate(() => {
    if (!animeRef.current) return
    animeRef.current.methods.cycleTo(mode)
  }, [mode])

  return (
    <AnimeScope init={initAnimation} ref={animeRef}>
      <div className={cx('root')} {...props}>
        <div className={cx('icon-container')} data-name='line'>
          <Icon data-mode='light' name='sun' />
          <Icon data-mode='dark' name='moon' />
          <Icon data-mode='auto' name='auto-theme' />
        </div>
      </div>
    </AnimeScope>
  )
}
