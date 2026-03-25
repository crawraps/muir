import { SecondNavPane } from '../../../widgets/components-pane'
import { DocsPane } from '../../../widgets/docs-pane'

export const ComponentPage = ({ params }: { params?: { '*'?: string } }) => {
  const selectedComponent = params?.['*']
  const category = selectedComponent?.split('/')[0] || 'components'

  return (
    <div className={cx('component-page')}>
      <SecondNavPane activeCategory={category} selected={selectedComponent} />
      <DocsPane selected={selectedComponent} />
    </div>
  )
}
