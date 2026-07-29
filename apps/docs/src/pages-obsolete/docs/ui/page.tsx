import { atr } from '@muir/base'
import { useRef } from 'react'
import { useParams } from 'react-router-dom'
import { getDocComponent } from 'src/entities/docs'
import { Pane } from 'src/entities/pane'
import { DocsMDXProvider } from 'src/features/mdx-renderer'
import { useMediaQuery, useScrollRestore } from 'src/shared/lib'
import { Sidebar } from 'src/widgets/sidebar'

export function DocPage() {
  const { docName } = useParams<{ docName: string }>()
  const DocComponent = docName ? getDocComponent(docName) : null
  const scrollRef = useRef<HTMLDivElement>(null)
  useScrollRestore(scrollRef)

  const isMobile = useMediaQuery('(max-width: 1200px)')
  const showList = !isMobile || (isMobile && !DocComponent)

  return (
    <Pane className={cx('page')}>
      <div className={cx('doc-layout')} is-hidden={atr(!showList)}>
        <Sidebar className={cx('sidebar')} />
        <div className={cx('doc-content')}>
          {DocComponent ? (
            <div className={cx('docs-content')} ref={scrollRef}>
              <DocsMDXProvider>
                <DocComponent />
              </DocsMDXProvider>
            </div>
          ) : (
            <div className={cx('docs-content', 'empty')}>
              <p>Select a component from the sidebar to view its documentation.</p>
            </div>
          )}
        </div>
      </div>
    </Pane>
  )
}
