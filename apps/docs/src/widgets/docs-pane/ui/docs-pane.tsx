import { getDocComponent } from 'src/entities/docs'
import { Pane } from 'src/entities/pane'

export const DocsPane = ({ selected }: { selected?: string }) => {
  if (!selected) {
    return (
      <Pane className={cx(['docs-pane', 'empty'])}>
        <div className={cx('empty-message')}>
          <p>Select a component to view its documentation.</p>
        </div>
      </Pane>
    )
  }

  const DocComponent = getDocComponent(selected)

  if (!DocComponent) {
    return (
      <Pane className={cx(['docs-pane', 'empty'])}>
        <div className={cx('empty-message')}>
          <p>Documentation for "{selected}" not found.</p>
        </div>
      </Pane>
    )
  }

  return (
    <Pane className={cx(['docs-pane'])}>
      <div className={cx('docs-content')}>
        <DocComponent />
      </div>
    </Pane>
  )
}
