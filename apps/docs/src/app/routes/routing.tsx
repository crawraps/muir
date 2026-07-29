import { Redirect, Route, Switch, TabProvider, Tabs } from '@muir/navigation'
import * as Pages from 'src/pages'
import { SidebarLayout } from '../layouts/sidebar'
import { NavbarLayout } from '../layouts/tabs'

export function Router() {
  return (
    <Switch>
      <Route nest path='/checkout'>
        <Switch>
          <Route path='/cart/:id'>
            <div />
          </Route>
          <Route path='/billing'>
            <div />
          </Route>
          <Route>
            <div />
          </Route>
        </Switch>
      </Route>
      <Route nest path='/tabs'>
        <TabProvider>
          <NavbarLayout>
            <Tabs>
              <Route path='/landing'>
                <Pages.Landing />
              </Route>
              <Route nest path='/docs'>
                <SidebarLayout>
                  <Switch>
                    <Route path='/*'>
                      <Pages.Doc />
                    </Route>
                    <Route>
                      <Pages.Docs />
                    </Route>
                  </Switch>
                </SidebarLayout>
              </Route>
              <Route path='/more'>
                <Pages.More />
              </Route>
            </Tabs>
          </NavbarLayout>
        </TabProvider>
      </Route>
      <Route path='/'>
        <Redirect to='/tabs/landing' />
      </Route>
      <Route>404</Route>
    </Switch>
  )
}
