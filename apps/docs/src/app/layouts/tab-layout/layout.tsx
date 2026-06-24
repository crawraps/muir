// FSD exception: @muir/navigation is imported directly because muir-capacitor
// does not re-export it. This is documented in .omo/plans/navigation-remake.md.
import { type TabDefinition, TabProvider, TabView } from '@muir/navigation'
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

const tabs: TabDefinition[] = [
  { id: 'home', path: '/', element: <HomePage />, icon: 'home', label: 'Home' },
  { id: 'docs', path: '/docs', element: <DocPage />, icon: 'components', label: 'Docs', initialMemory: { path: '/docs/components/button' } },
  { id: 'about', path: '/about', element: <AboutPage />, icon: 'info', label: 'About' },
]

function LayoutContent() {
  const [location] = useLocation()

  const currentBlob = useMemo(() => {
    if (!location.startsWith('/docs/')) return 0
    const docName = location.replace('/docs/', '')
    const frontmatter = getDocFrontmatter(docName)
    const group = frontmatter?.group as string | undefined
    return group && group in groupToBlobIndex ? groupToBlobIndex[group] : 0
  }, [location])

  return (
    <div className={cx('layout')}>
      <Navbar className={cx('navbar')} tabs={tabs} />
      <div className={cx('main-content')}>
        <TabView max={tabs.length} transition />
      </div>
      <BlobScene blob={blobs[currentBlob]} className={cx('blob-scene')} />
    </div>
  )
}

export function TabLayout() {
  return (
    <TabProvider tabs={tabs}>
      <LayoutContent />
    </TabProvider>
  )
}
