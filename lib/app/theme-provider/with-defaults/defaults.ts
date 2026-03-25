import objectHash from 'object-hash'
import type { Theme } from '../model/types'
import { defaultPaletteDark, defaultPaletteLight } from './palette'
import themeDefaults from './theme-defaults.json'

const baseTheme: Omit<Theme, 'palette'> = themeDefaults.baseTheme

export const defaultThemes = {
  dark: {
    palette: defaultPaletteDark,
    ...baseTheme,
  } as Theme,
  light: {
    palette: defaultPaletteLight,
    ...baseTheme,
  } as Theme,
  hash(theme: 'dark' | 'light') {
    return objectHash(this[theme])
  },
}
