import { KeepAlive } from 'keepalive-for-react'
import type { ReactNode } from 'react'
import { useMemo, useRef } from 'react'
import { getDocFrontmatter } from 'src/entities/docs'
import { AboutPage } from 'src/pages/about'
import { DocPage } from 'src/pages/docs'
import { HomePage } from 'src/pages/home'
import iconsUrl from 'src/shared/assets/icons.svg?url'
import { injectSvgSprite } from 'src/shared/lib/inject-svg-sprite'
import { type BlobConfig, BlobScene } from 'src/widgets/blob-scene'
import { Navbar } from 'src/widgets/navbar'
import { useLocation } from 'wouter'
import './style.module.css'

injectSvgSprite(iconsUrl)

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

function getActiveContent(location: string): { cacheKey: string; element: ReactNode } {
  if (location.startsWith('/docs')) {
    return { cacheKey: location, element: <DocPage /> }
  }
  if (location === '/about') {
    return { cacheKey: '/about', element: <AboutPage /> }
  }
  return { cacheKey: '/', element: <HomePage /> }
}

export function TabLayout() {
  const [location] = useLocation()
  const { cacheKey, element } = getActiveContent(location)
  const lastDocsPath = useRef('/docs/components/surface')

  if (location.startsWith('/docs')) {
    lastDocsPath.current = location
  }

  const currentBlob = useMemo(() => {
    if (!location.startsWith('/docs/')) return 0
    const docName = location.replace('/docs/', '')
    const frontmatter = getDocFrontmatter(docName)
    const group = frontmatter?.group as string | undefined
    return group && group in groupToBlobIndex ? groupToBlobIndex[group] : 0
  }, [location])

  return (
    <div className={cx('layout')}>
      <Navbar
        className={cx('navbar')}
        entries={[
          { href: '/', icon: 'home', label: 'Home' },
          { href: lastDocsPath.current, icon: 'components', label: 'Docs' },
          { href: '/about', icon: 'info', label: 'About' },
        ]}
      />
      <div className={cx('main-content')}>
        <KeepAlive activeCacheKey={cacheKey} containerClassName={cx('keepalive-container')} max={10} transition>
          {element}
        </KeepAlive>
      </div>
      <BlobScene blob={blobs[currentBlob]} className={cx('blob-scene')} />
    </div>
  )
}
