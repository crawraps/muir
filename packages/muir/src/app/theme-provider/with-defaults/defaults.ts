import objectHash from 'object-hash'
import type { Theme } from '..'
import { defaultPaletteDark, defaultPaletteLight } from './palette'
import themeDefaults from './theme-defaults.json'

const baseTheme: Omit<Theme, 'palette' | 'surface'> = themeDefaults.baseTheme

export const defaultThemes = {
  dark: {
    palette: defaultPaletteDark,
    surface: themeDefaults.surfaceDark,
    ...baseTheme,
  } as Theme,
  light: {
    palette: defaultPaletteLight,
    surface: themeDefaults.surfaceLight,
    ...baseTheme,
  } as Theme,
  hash(theme: 'dark' | 'light') {
    return objectHash(this[theme])
  },
}
