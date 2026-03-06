import objectHash from 'object-hash'
import type { Theme } from '../model/types'
import { defaultPaletteDark, defaultPaletteLight } from './palette'

const baseTheme: Omit<Theme, 'name' | 'palette'> = {
  motion: {
    expressive: {
      default: {
        effects: { curve: `cubic-bezier(0.34, 0.80, 0.34, 1.00)`, duration: 200, bounce: 0 },
        spatial: { curve: `cubic-bezier(0.38, 1.21, 0.22, 1.00)`, duration: 350, bounce: 0.35 },
      },
      fast: {
        effects: { curve: `cubic-bezier(0.31, 0.94, 0.34, 1.00)`, duration: 150, bounce: 0 },
        spatial: { curve: `cubic-bezier(0.42, 1.67, 0.21, 0.90)`, duration: 200, bounce: 0.5 },
      },
      slow: {
        effects: { curve: `cubic-bezier(0.34, 0.88, 0.34, 1.00)`, duration: 300, bounce: 0 },
        spatial: { curve: `cubic-bezier(0.39, 1.29, 0.35, 0.98)`, duration: 500, bounce: 0.2 },
      },
    },
    standart: {
      default: {
        effects: { curve: `cubic-bezier(0.34, 0.80, 0.34, 1.00)`, duration: 200, bounce: 0 },
        spatial: { curve: `cubic-bezier(0.27, 1.06, 0.18, 1.00)`, duration: 350, bounce: 0.2 },
      },
      fast: {
        effects: { curve: `cubic-bezier(0.31, 0.94, 0.34, 1.00)`, duration: 150, bounce: 0 },
        spatial: { curve: `cubic-bezier(0.27, 1.06, 0.18, 1.00)`, duration: 200, bounce: 0.3 },
      },
      slow: {
        effects: { curve: `cubic-bezier(0.34, 0.88, 0.34, 1.00)`, duration: 300, bounce: 0 },
        spatial: { curve: `cubic-bezier(0.27, 1.06, 0.18, 1.00)`, duration: 500, bounce: 0.1 },
      },
    },
  },
  shape: {
    'extra-large': 0.75,
    'extra-small': 0.175,
    full: 0.5,
    large: 0.5,
    medium: 0.375,
    none: 0,
    small: 0.25,
  },
  typeface: {
    brandFamily: 'Roboto, sans-serif',
    plainFamily: 'Roboto, sans-serif',
    typeScale: {
      body: {
        large: { lineHeight: 1.5, size: 1.25, weight: 400 },
        medium: { lineHeight: 1.5, size: 1, weight: 400 },
        small: { lineHeight: 1.5, size: 0.875, weight: 400 },
      },
      display: {
        large: { lineHeight: 1.2, size: 3, weight: 600 },
        medium: { lineHeight: 1.2, size: 2.625, weight: 600 },
        small: { lineHeight: 1.2, size: 2.25, weight: 600 },
      },
      headline: {
        large: { lineHeight: 1.2, size: 3.25, weight: 600 },
        medium: { lineHeight: 1.2, size: 2.5, weight: 600 },
        small: { lineHeight: 1.2, size: 2, weight: 600 },
      },
      label: {
        large: { lineHeight: 1.3, size: 1.25, weight: 500 },
        medium: { lineHeight: 1.3, size: 1, weight: 400 },
        small: { lineHeight: 1.3, size: 0.875, weight: 400 },
      },
      title: {
        large: { lineHeight: 1.4, size: 1.75, weight: 600 },
        medium: { lineHeight: 1.4, size: 1.5, weight: 600 },
        small: { lineHeight: 1.4, size: 1.25, weight: 600 },
      },
    },
  },
}

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
