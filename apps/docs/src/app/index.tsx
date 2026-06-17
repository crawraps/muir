import { Route, Switch } from 'wouter'
import { CodeStyleProvider, SnackbarProvider, type Theme, ThemeProvider } from 'muir-capacitor'
import iconsUrl from 'src/shared/assets/icons.svg?url'
import { injectSvgSprite } from 'src/shared/lib/inject-svg-sprite'
import { DocPage } from '../pages/docs'
import { SidebarLayout } from './layouts/sidebar-layout/layout'

import theme from './theme.json'
import './global.css'

injectSvgSprite(iconsUrl)

export const App = () => {
  return (
    <ThemeProvider themes={{ light: theme as Partial<Theme>, dark: theme as Partial<Theme> }}>
      <CodeStyleProvider>
        <SnackbarProvider>
          <SidebarLayout>
            <Switch>
              <Route path='/docs/*?'>
                <DocPage />
              </Route>
              <Route>
                <div>404 - Not Found</div>
              </Route>
            </Switch>
          </SidebarLayout>
        </SnackbarProvider>
      </CodeStyleProvider>
    </ThemeProvider>
  )
}
