import { useCallback, useContext, useMemo, useState } from 'react'
import { useSafeThemeMode } from '@muir/base'
import type { CodeStyleContextType, CodeStyleProviderProps, CodeTheme } from './properties'
import { getSavedCodeTheme, setSavedCodeTheme } from './storage'

const CodeStyleContext = createContext<CodeStyleContextType | null>(null)

export function useCodeStyle(): CodeStyleContextType {
  const ctx = useContext(CodeStyleContext)
  if (!ctx) {
    return {
      theme: 'auto',
      setTheme: () => {},
      resolvedTheme: 'dark',
      cycle: () => {},
    }
  }
  return ctx
}

export function CodeStyleProvider({ children, defaultTheme = 'auto' }: CodeStyleProviderProps) {
  const [theme, setThemeState] = useState<CodeTheme>(() => getSavedCodeTheme() ?? defaultTheme)
  const globalMode = useSafeThemeMode()

  const resolvedTheme = useMemo(() => {
    if (theme === 'auto') return globalMode
    return theme
  }, [theme, globalMode])

  const setTheme = useCallback((next: CodeTheme) => {
    setThemeState(next)
    setSavedCodeTheme(next)
  }, [])

  const cycle = useCallback(() => {
    setThemeState(prev => {
      const next = prev === 'auto' ? 'dark' : prev === 'dark' ? 'light' : 'auto'
      setSavedCodeTheme(next)
      return next
    })
  }, [])

  return <CodeStyleContext value={{ theme, setTheme, resolvedTheme, cycle }}>{children}</CodeStyleContext>
}
