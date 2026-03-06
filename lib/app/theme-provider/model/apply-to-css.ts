import css from '../with-defaults/plain.css?inline'
import type { ColorPalette, Shape, Theme, Typeface } from './types'

export function applyPaletteToCss(palette: ColorPalette): void {
  const root = document.documentElement

  for (const [key, value] of Object.entries(palette)) {
    root.style.setProperty(`--md-sys-color-${key}`, value)
  }
}

export function applyShapeToCss(shape: Shape): void {
  const root = document.documentElement

  for (const [key, value] of Object.entries(shape)) {
    root.style.setProperty(`--md-sys-shape-corner-${key}`, `${value}rem`)
  }
}

export function applyMotionToCss(motion: Theme['motion']): void {
  const root = document.documentElement

  for (const [style, value] of Object.entries(motion)) {
    for (const [speed, val] of Object.entries(value)) {
      for (const [type, v] of Object.entries(val)) {
        root.style.setProperty(`--md-sys-motion-${style}-${speed}-${type}-duration`, `${v.duration}ms`)
        root.style.setProperty(`--md-sys-motion-${style}-${speed}-${type}-curve`, v.curve)
        root.style.setProperty(`--md-sys-motion-${style}-${speed}-${type}-transition`, `${v.duration}ms ${v.curve}`)
      }
    }
  }
}

export function applyTypefaceToCss(typography: Typeface): void {
  const root = document.documentElement
  root.style.setProperty('--md-ref-typeface-brand', typography.brandFamily)
  root.style.setProperty('--md-ref-typeface-plain', typography.plainFamily)

  for (const [scale, sizes] of Object.entries(typography.typeScale)) {
    for (const [size, props] of Object.entries(sizes)) {
      root.style.setProperty(`--md-sys-typescale-${scale}-${size}-size`, `${props.size}rem`)
      root.style.setProperty(`--md-sys-typescale-${scale}-${size}-line-height`, `${props.lineHeight}em`)
      root.style.setProperty(`--md-sys-typescale-${scale}-${size}-weight`, props.weight.toString())
    }
  }
}

export function applyThemeToCss(theme: Theme): void {
  applyPaletteToCss(theme.palette)
  applyShapeToCss(theme.shape)
  applyTypefaceToCss(theme.typeface)
  applyMotionToCss(theme.motion)

  const stylesheet = document.createElement('style')
  stylesheet.innerHTML = css
  document.head.prepend(stylesheet)
}
