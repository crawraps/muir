import { Surface } from '@muir/base'
import type { SnackEntry, SnackWrapperProps } from '../model/properties'
import { Animated } from './animation'
import styles from './style.module.css'

/** Default content wrapper — simply renders the content. */
function DefaultWrapper({ content }: SnackWrapperProps) {
  return <>{content}</>
}

/** Renders a single snackbar item with enter/exit animation. */
function Snackbar({ entry, onHide, onComplete }: { entry: SnackEntry; onHide: (id?: number) => void; onComplete: (id: number) => void }) {
  const Wrapper = entry.contentWrapper ?? DefaultWrapper

  const surfaceElement = entry.surface ?? <Surface />

  const wrapperProps: SnackWrapperProps = {
    id: entry.id,
    content: entry.content,
    onDismiss: () => onHide(entry.id),
    onHide: () => onHide(entry.id),
    onShow: () => {},
  }

  return (
    <Animated isHiding={entry.isHiding} onComplete={() => onComplete(entry.id)}>
      <div className={cx('snackbar', styles.snackbar)} style={entry.style}>
        {surfaceElement}
        <div className={cx('content', styles.content)}>
          <Wrapper {...wrapperProps} />
        </div>
      </div>
    </Animated>
  )
}

export default Snackbar
