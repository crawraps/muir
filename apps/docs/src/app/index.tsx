import { Router } from 'wouter'
import { TabLayout } from './layouts/tab-layout/layout'
import './global.css'
import { type Theme, ThemeProvider } from '@muir/base'
import { CodeStyleProvider, SnackbarProvider } from '@muir/extra'
import theme from 'src/app/theme.json'

export const App = () => {
  return (
    <ThemeProvider themes={{ light: theme as Partial<Theme>, dark: theme as Partial<Theme> }}>
      <CodeStyleProvider>
        <SnackbarProvider>
          <Router>
            <TabLayout />
          </Router>
        </SnackbarProvider>
      </CodeStyleProvider>
    </ThemeProvider>
  )
}
