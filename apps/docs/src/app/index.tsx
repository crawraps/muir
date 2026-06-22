import { Router } from 'wouter'
import { TabLayout } from './layouts/tab-layout/layout'
import './global.css'
import { CodeStyleProvider, SnackbarProvider, type Theme, ThemeProvider } from '@muir/capacitor'
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
