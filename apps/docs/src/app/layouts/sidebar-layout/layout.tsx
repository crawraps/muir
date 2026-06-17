import { type ReactNode, useEffect, useState } from 'react'
import { useLocation } from 'wouter'
import { getDocFrontmatter } from 'src/entities/docs'
import { Pane } from 'src/entities/pane'
import { type BlobConfig, BlobScene } from 'src/widgets/blob-scene'
import { Navbar } from 'src/widgets/navbar'
import { Sidebar } from 'src/widgets/sidebar'

const blobs: BlobConfig[] = [
  {
    points: 10,
    gScale: 70,
    hScale: 20,
    cx: 600,
    cy: 2400,
  },
  {
    points: 14,
    gScale: 50,
    hScale: 30,
    cx: 550,
    cy: 2200,
  },
]

const groupToBlobIndex: Record<string, number> = {
  basic: 0,
  extra: 1,
}

export const SidebarLayout = ({ children }: { children: ReactNode }) => {
  const [location] = useLocation()
  const [currentBlob, setCurrentBlob] = useState(0)

  useEffect(() => {
    if (!location.startsWith('/docs/')) {
      setCurrentBlob(0)
      return
    }
    const docName = location.replace('/docs/', '')
    const frontmatter = getDocFrontmatter(docName)
    const group = frontmatter?.group as string | undefined
    const blobIndex = group && group in groupToBlobIndex ? groupToBlobIndex[group] : 0
    setCurrentBlob(blobIndex)
  }, [location])

  return (
    <div className={cx('layout')}>
      <Navbar
        className={cx('navbar')}
        entries={[
          { href: '/', icon: 'home', label: 'Home' },
          { href: '/docs/components/surface', icon: 'components', label: 'Docs' },
          { href: '/about', icon: 'info', label: 'About' },
        ]}
      />
      <Sidebar className={cx('sidebar')} />
      <Pane className={cx('main-content')}>{children}</Pane>
      <BlobScene blob={blobs[currentBlob]} className={cx('blob-scene')} />
    </div>
  )
}
