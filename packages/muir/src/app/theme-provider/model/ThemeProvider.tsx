import type { ReactNode } from 'react'
import { defaultThemes } from '../with-defaults/defaults'
import { applyThemeToCss } from './apply-to-css'
import type { Theme } from './properties'
import { getSavedThemeLocal, getSavedThemeShared, setSavedThemeLocal, setSavedThemeShared } from './storage'

export type ThemeMode = 'light' | 'dark'

interface ThemeContextType {
  theme: Theme
  mode: ThemeMode
  updateTheme: (theme: Theme | ThemeMode) => void
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

interface ThemeProviderProps {
  children: ReactNode
  themes?: { dark?: DeepPartial<Theme>; light?: DeepPartial<Theme> }
}

function deriveMode(theme: Theme, themes: { dark: Theme; light: Theme }): ThemeMode {
  if (theme === themes.dark) return 'dark'
  return 'light'
}

function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  const themes = useMemo(() => {
    return {
      dark: mergeDeep<Theme>(defaultThemes.dark, props.themes?.dark),
      light: mergeDeep<Theme>(defaultThemes.light, props.themes?.light),
    }
  }, [props.themes])

  const [theme, setTheme] = useState<Theme>(themes.light)
  const [mode, setMode] = useState<ThemeMode>('light')

  useLayoutEffect(() => {
    let theme: Theme = defaultThemes.light

    const savedLocal = getSavedThemeLocal()
    if (savedLocal) {
      theme = savedLocal
    } else {
      theme = window.matchMedia('(prefers-color-scheme: dark)').matches ? themes.dark : themes.light
    }

    setTheme(theme)
    setMode(deriveMode(theme, themes))
    applyThemeToCss(theme)
  }, [themes])

  useEffect(() => {
    getSavedThemeShared().then(theme => {
      if (theme) {
        setTheme(theme)
        setMode(deriveMode(theme, themes))
        applyThemeToCss(theme)
      }
    })
  }, [themes])

  const updateTheme = useCallback<ThemeContextType['updateTheme']>(
    themeInput => {
      let theme: Theme
      let mode: ThemeMode

      if (typeof themeInput === 'string') {
        theme = themes[themeInput]
        mode = themeInput
      } else {
        theme = themeInput
        mode = deriveMode(themeInput, themes)
      }

      setTheme(theme)
      setMode(mode)
      applyThemeToCss(theme)
      setSavedThemeLocal(theme)
      setSavedThemeShared(theme)
    },
    [themes],
  )

  return <ThemeContext value={{ theme, mode, updateTheme }}>{children}</ThemeContext>
}

export { ThemeProvider }

function useTheme() {
  const context = useContext(ThemeContext)
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider')
  }
  return context
}

export { useTheme }

function useSafeThemeMode(): ThemeMode {
  const context = useContext(ThemeContext)
  return context?.mode ?? 'dark'
}

export { useSafeThemeMode }

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
