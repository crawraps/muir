import { getDocComponent } from '../../../shared/api/docs'

export const DocsPane = ({ selected }: { selected?: string }) => {
  if (!selected) {
    return (
      <div className={cx(['docs-pane', 'empty'], 'pane')}>
        <div className={cx('empty-message')}>
          <p>Select a component to view its documentation.</p>
        </div>
      </div>
    )
  }

  const DocComponent = getDocComponent(selected)

  if (!DocComponent) {
    return (
      <div className={cx(['docs-pane', 'empty'], 'pane')}>
        <div className={cx('empty-message')}>
          <p>Documentation for "{selected}" not found.</p>
        </div>
      </div>
    )
  }

  return (
    <div className={cx(['docs-pane'], 'pane')}>
      <div className={cx('docs-content')}>
        <DocComponent />
      </div>
    </div>
  )
}
