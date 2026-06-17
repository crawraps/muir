import type React from 'react'
import { gruvboxDark, gruvboxLight } from 'react-syntax-highlighter/dist/esm/styles/prism'

function camelToKebab(str: string): string {
  return str
    .replace(/^Moz/, '-moz-')
    .replace(/^Webkit/, '-webkit-')
    .replace(/^ms/, '-ms-')
    .replace(/^O([A-Z])/, '-o-$1')
    .replace(/[A-Z]/g, m => `-${m.toLowerCase()}`)
}

function normalizeSelector(selector: string): string {
  if (/^[.#:]/.test(selector)) {
    return selector
  }
  if (/[>[\s]/.test(selector)) {
    return selector
  }
  if (selector.startsWith('token.')) {
    return `.${selector}`
  }
  return `.token.${selector}`
}

const BLOCKED_PROPERTIES = new Set([
  'background',
  'backgroundColor',
  'margin',
  'marginTop',
  'marginBottom',
  'marginLeft',
  'marginRight',
  'padding',
  'paddingTop',
  'paddingBottom',
  'paddingLeft',
  'paddingRight',
  'borderRadius',
  'borderTopLeftRadius',
  'borderTopRightRadius',
  'borderBottomLeftRadius',
  'borderBottomRightRadius',
])

const BASE_TEXT_SELECTORS = new Set(['pre[class*="language-"]', 'code[class*="language-"]', ':not(pre) > code[class*="language-"]'])

const IMPORTANT_PROPERTIES = new Set(['color'])

function themeToCss(theme: Record<string, React.CSSProperties>, scope: string): string {
  const rules: string[] = []
  for (const [rawSelector, styles] of Object.entries(theme)) {
    const selector = normalizeSelector(rawSelector)
    const entries = Object.entries(styles).filter(([prop]) => !BLOCKED_PROPERTIES.has(prop))
    if (entries.length === 0) continue
    const isBase = BASE_TEXT_SELECTORS.has(rawSelector)
    const cssStyles = entries
      .map(([prop, value]) => {
        const important = isBase && IMPORTANT_PROPERTIES.has(prop) ? ' !important' : ''
        return `${camelToKebab(prop)}: ${value}${important}`
      })
      .join('; ')
    rules.push(`${scope} ${selector} { ${cssStyles}; }`)
  }
  return rules.join('\n')
}

const lightCss = themeToCss(gruvboxLight, '[data-code-theme="light"]')
const darkCss = themeToCss(gruvboxDark, '[data-code-theme="dark"]')

export const codeThemeStyles = `${lightCss}\n${darkCss}`
