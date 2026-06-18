import { useEffect } from 'react'
import type { CodeTheme } from './properties'

export function useCodeThemeChange(theme: CodeTheme, resolvedTheme: 'light' | 'dark', onThemeChange?: (mode: CodeTheme, resolved: 'light' | 'dark') => void) {
  useEffect(() => {
    onThemeChange?.(theme, resolvedTheme)
  }, [theme, resolvedTheme, onThemeChange])
}
