const KEY = 'code-theme'

const VALID_THEMES: ReadonlySet<string> = new Set(['light', 'dark', 'auto'])

export function getSavedCodeTheme(): CodeTheme | null {
  try {
    const value = localStorage.getItem(KEY)
    if (value && VALID_THEMES.has(value)) return value as CodeTheme
  } catch {}
  return null
}

export function setSavedCodeTheme(theme: CodeTheme): void {
  try {
    localStorage.setItem(KEY, theme)
  } catch {}
}

type CodeTheme = 'light' | 'dark' | 'auto'
