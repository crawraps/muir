import { Route, Switch, useLocation } from 'wouter'
import { HomePage } from '@/src/pages/home-page'
import { SecondNavPane } from '@/src/widgets/components-pane'
import { DocsPane } from '@/src/widgets/docs-pane'
import './styles/global.css'
import { ThemeProvider } from '@/lib'
import iconsUrl from '@/src/shared/assets/icons.svg?url'
import { injectSvgSprite } from '@/src/shared/lib/inject-svg-sprite'
import { Navbar } from '@/src/widgets/navbar'
import theme from './theme.json'

injectSvgSprite(iconsUrl)

const useRouteParams = () => {
  const [location] = useLocation()
  const segments = location.replace(/^\//, '').split('/').filter(Boolean)
  return segments
}

export const App = () => {
  const { segments } = useRouteParams()

  return (
    <ThemeProvider themes={{ light: theme, dark: theme }}>
      <Navbar />
      <Sidebar />
      <main className={cx('main-content')}>
        <SecondNavPane activeCategory={category} selected={selected} />
        <Switch>
          <Route component={HomePage} path='/' />
          <Route path='/:category'>
            <DocsPane />
          </Route>
          <Route path='/:category/*'>{(params: { category: string; '*': string }) => <DocsPane selected={`${params.category}/${params['*']}`} />}</Route>
          <Route>
            <div>404 - Not Found</div>
          </Route>
        </Switch>
      </main>
    </ThemeProvider>
  )
}
