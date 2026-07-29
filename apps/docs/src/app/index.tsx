import { ThemeProvider } from '@muir/base'
import { CodeStyleProvider, SnackbarProvider } from '@muir/extra'
import { Router } from './routes'

import { themes } from './styles'
import './styles/global.css'

export function App() {
  return (
    <ThemeProvider themes={themes}>
      <CodeStyleProvider>
        <SnackbarProvider>
          <Router />
        </SnackbarProvider>
      </CodeStyleProvider>
    </ThemeProvider>
  )
}
