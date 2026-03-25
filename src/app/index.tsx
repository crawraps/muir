import { Route, Switch, useLocation } from 'wouter'
import { HomePage } from '../pages/home-page'
import { SecondNavPane } from '../widgets/components-pane'
import { DocsPane } from '../widgets/docs-pane'
import { Sidebar } from '../widgets/sidebar'
import './styles/global.css'
import { ThemeProvider } from '../../lib'
import iconsUrl from '../shared/assets/icons.svg?url'
import { injectSvgSprite } from '../shared/lib/inject-svg-sprite'
import theme from './theme.json'

injectSvgSprite(iconsUrl)

const useRouteParams = () => {
  const [location] = useLocation()
  const segments = location.replace(/^\//, '').split('/').filter(Boolean)
  const category = segments[0] || undefined
  const item = segments[1] || undefined
  const selected = category && item ? `${category}/${item}` : undefined
  return { category, selected }
}

export const App = () => {
  const { category, selected } = useRouteParams()

  return (
    <ThemeProvider themes={{ light: theme, dark: theme }}>
      <div className={cx('app-layout')}>
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
      </div>
    </ThemeProvider>
  )
}
