import { ThemeProvider } from '../../lib/app/theme-provider'
import { SnackbarProvider } from '../../lib/components/snackbar'
import { PreviewPage } from '../pages/preview-page'
import './styles/global.css'

const theme = {
  typeface: {
    brandFamily: 'Raleway, sans-serif',
    plainFamily: 'Poppins, sans-serif',
  },
}

export function App() {
  return (
    <ThemeProvider themes={{ dark: theme, light: theme }}>
      <SnackbarProvider>
        <PreviewPage />
      </SnackbarProvider>
    </ThemeProvider>
  )
}
