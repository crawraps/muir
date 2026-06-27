import { atr } from '@muir/capacitor'
import { useScrollRestore, useTabPath } from '@muir/navigation'
import { useRef } from 'react'
import { getDocComponent } from 'src/entities/docs'
import { Pane } from 'src/entities/pane'
import { DocsMDXProvider } from 'src/features/mdx-renderer'
import { useMediaQuery } from 'src/shared/lib'
import { Sidebar } from 'src/widgets/sidebar'

export function DocPage() {
  const path = useTabPath()
  const docName = path.replace('/docs/', '').replace(/^\//, '')
  const DocComponent = docName ? getDocComponent(docName) : null
  const scrollRef = useRef<HTMLDivElement>(null)
  useScrollRestore(scrollRef)

  const isMobile = useMediaQuery('(max-width: 1200px)')
  const showList = !isMobile || (isMobile && !DocComponent)

  return (
    <div className={cx('doc-layout')} is-sidebar-hidden={atr(!showList)}>
      <Sidebar className={cx('sidebar')} />
      <div className={cx('doc-content')}>
        <Pane>
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
        </Pane>
      </div>
    </div>
  )
}
