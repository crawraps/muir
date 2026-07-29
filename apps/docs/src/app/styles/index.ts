import type { Theme } from '@muir/base'
import type { DeepPartial } from 'src/shared'
import darkTheme from './dark-theme.json'
import lightTheme from './light-theme.json'

type CustomTheme = DeepPartial<Theme>

export const themes = {
  dark: darkTheme as CustomTheme,
  light: lightTheme as CustomTheme,
}
