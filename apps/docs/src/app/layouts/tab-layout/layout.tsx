import { useMemo } from 'react'
import { Redirect, Route, useLocation } from 'react-router-dom'
import { getDocFrontmatter } from 'src/entities/docs'
import { AboutPage } from 'src/pages-obsolete/about'
import { DocPage } from 'src/pages-obsolete/docs'
import { DocsListPage } from 'src/pages-obsolete/docs-list'
import { HomePage } from 'src/pages-obsolete/home'
import { SettingsPage } from 'src/pages-obsolete/settings'
import iconsUrl from 'src/shared/assets/icons.svg?url'
import { useMediaQuery } from 'src/shared/lib'
import { injectSvgSprite } from 'src/shared/lib/inject-svg-sprite'
import { type BlobConfig, BlobScene } from 'src/widgets/blob-scene'
import './style.module.css'

injectSvgSprite(iconsUrl)

const blobs: BlobConfig[] = [
  { points: 10, gScale: 70, hScale: 20, cx: 600, cy: 2400 },
  { points: 14, gScale: 50, hScale: 30, cx: 550, cy: 2200 },
]

const groupToBlobIndex: Record<string, number> = {
  basic: 0,
  extra: 1,
}

interface TabSpec {
  tab: string
  href: string
  icon: string
  label: string
}

const desktopTabs: TabSpec[] = [
  { tab: 'home', href: '/tabs/home', icon: 'home', label: 'Home' },
  { tab: 'docs', href: '/tabs/docs', icon: 'components', label: 'Docs' },
  { tab: 'about', href: '/tabs/about', icon: 'info', label: 'About' },
]

const mobileTabs: TabSpec[] = [
  { tab: 'home', href: '/tabs/home', icon: 'home', label: 'Home' },
  { tab: 'docs', href: '/tabs/docs', icon: 'components', label: 'Docs' },
  { tab: 'settings', href: '/tabs/settings', icon: 'settings', label: 'Settings' },
]

function TabIcon({ name }: { name: string }) {
  return (
    <svg aria-label={name} className={cx('tab-icon')} role='img'>
      <use href={`#${name}`} />
    </svg>
  )
}

function TabsContent() {
  const location = useLocation()
  const isMobile = useMediaQuery('(max-width: 700px)')
  const tabs = isMobile ? mobileTabs : desktopTabs

  const currentBlob = useMemo(() => {
    if (!location.pathname.startsWith('/tabs/docs/')) return 0
    const docName = location.pathname.replace('/tabs/docs/', '')
    const frontmatter = getDocFrontmatter(docName)
    const group = frontmatter?.group as string | undefined
    return group && group in groupToBlobIndex ? groupToBlobIndex[group] : 0
  }, [location.pathname])

  return (
    <div className={cx('layout')}>
      <div className={cx('tabs')}>
        <div className={cx('outlet')}>
          <Redirect exact path='/tabs' to='/tabs/home' />
          <Route exact path='/tabs/home' render={() => <HomePage />} />
          <Route exact path='/tabs/docs' render={() => <DocsListPage />} />
          <Route path='/tabs/docs/:docName+' render={() => <DocPage />} />
          <Route exact path='/tabs/about' render={() => <AboutPage />} />
          <Route exact path='/tabs/settings' render={() => <SettingsPage />} />
        </div>
        <nav className={cx('tab-bar')}>
          {tabs.map(t => (
            <a className={cx('tab-button')} href={t.href} key={t.tab}>
              <TabIcon name={t.icon} />
            </a>
          ))}
        </nav>
      </div>
      <BlobScene blob={blobs[currentBlob]} className={cx('blob-scene')} />
    </div>
  )
}

export function TabLayout() {
  return <TabsContent />
}
