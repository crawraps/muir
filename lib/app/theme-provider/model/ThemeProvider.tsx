import type { ReactNode } from 'react'
import { defaultThemes } from '@/lib/app/theme-provider/with-defaults/defaults'
import { applyThemeToCss } from './apply-to-css'
import { getSavedThemeLocal, getSavedThemeShared, setSavedThemeLocal, setSavedThemeShared } from './storage'
import type { Theme } from './types'

interface ThemeContextType {
  theme: Theme
  updateTheme: (theme: Theme) => void
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

interface ThemeProviderProps {
  children: ReactNode
  themes?: { dark?: DeepPartial<Theme>; light?: DeepPartial<Theme> }
}

export const ThemeProvider = ({ children, ...props }: ThemeProviderProps) => {
  const themes = useMemo(() => {
    return {
      dark: mergeDeep<Theme>(defaultThemes.dark, props.themes?.dark),
      light: mergeDeep<Theme>(defaultThemes.light, props.themes?.light),
    }
  }, [props.themes])

  const [theme, setTheme] = useState<Theme>(themes.light)

  useLayoutEffect(() => {
    let theme: Theme = defaultThemes.light

    const savedLocal = getSavedThemeLocal()
    if (savedLocal) {
      theme = savedLocal
    } else {
      theme = window.matchMedia('(prefers-color-scheme: dark)').matches ? themes.dark : themes.light
    }

    setTheme(theme)
    applyThemeToCss(theme)
  }, [themes])

  useEffect(() => {
    getSavedThemeShared().then(theme => {
      if (theme) {
        setTheme(theme)
        applyThemeToCss(theme)
      }
    })
  }, [])

  const updateTheme = useCallback((theme: Theme) => {
    setTheme(theme)
    applyThemeToCss(theme)

    setSavedThemeLocal(theme)
    setSavedThemeShared(theme)
  }, [])

  return <ThemeContext value={{ theme, updateTheme }}>{children}</ThemeContext>
}

export const useTheme = () => {
  const context = use(ThemeContext)
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider')
  }
  return context
}

function isObject(item: unknown): item is Record<string, unknown> {
  return Boolean(item) && typeof item === 'object' && !Array.isArray(item)
}

function mergeDeep<T>(target: unknown, ...sources: unknown[]): T {
  if (!sources.length) return target as T
  const source = sources.shift()

  if (isObject(target) && isObject(source)) {
    for (const key in source) {
      if (isObject(source[key])) {
        if (!target[key]) Object.assign(target, { [key]: {} })
        mergeDeep(target[key], source[key])
      } else {
        Object.assign(target, { [key]: source[key] })
      }
    }
  }

  return mergeDeep(target, ...sources)
}

type DeepPartial<T> = T extends object
  ? {
      [P in keyof T]?: DeepPartial<T[P]>
    }
  : T
