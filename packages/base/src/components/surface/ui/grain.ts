export interface GrainFilterParams {
  density: number
  surfaceScale: number
  elevation: number
  specularity: number
}

const STYLE_ELEMENT_ID = 'muir-surface-grain'
const injectedClasses = new Set<string>()

function buildGrainClassName(params: GrainFilterParams): string {
  const slug = `${params.density}-${params.surfaceScale}-${params.elevation}-${params.specularity}`.replace(/\./g, '-')
  return `muir-surface-grain-${slug}`
}

function buildGrainSvg(params: GrainFilterParams): string {
  return [
    '<svg xmlns="http://www.w3.org/2000/svg" width="200" height="200">',
    '<defs>',
    `<filter id="f" x="0" y="0" width="200" height="200" filterUnits="userSpaceOnUse">`,
    `<feTurbulence type="fractalNoise" baseFrequency="${params.density}" numOctaves="4" stitchTiles="stitch" result="noise"/>`,
    `<feSpecularLighting in="noise" surfaceScale="${params.surfaceScale}" specularConstant="${params.specularity}" specularExponent="20" lighting-color="white" result="specular">`,
    `<feDistantLight azimuth="45" elevation="${params.elevation}"/>`,
    `</feSpecularLighting>`,
    `</filter>`,
    `</defs>`,
    `<rect width="200" height="200" filter="url(#f)"/>`,
    `</svg>`,
  ].join('')
}

function encodeSvgDataUri(svg: string): string {
  return `data:image/svg+xml;base64,${btoa(unescape(encodeURIComponent(svg)))}`
}

function getOrCreateStyleElement(): HTMLStyleElement | null {
  if (typeof document === 'undefined') return null

  const existing = document.getElementById(STYLE_ELEMENT_ID)
  if (existing instanceof HTMLStyleElement) return existing

  const style = document.createElement('style')
  style.id = STYLE_ELEMENT_ID
  document.head.appendChild(style)
  return style
}

/**
 * Ensures a CSS class defining a grain texture background-image exists in a single
 * `<style>` element in the document head. Returns the class name to apply to a surface root.
 */
export function ensureGrainClass(params: GrainFilterParams): string {
  const className = buildGrainClassName(params)
  if (injectedClasses.has(className)) return className

  const style = getOrCreateStyleElement()
  if (style) {
    const dataUri = encodeSvgDataUri(buildGrainSvg(params))
    style.sheet?.insertRule(`.${className}{--muir-grain-bg:url("${dataUri}")}`, style.sheet.cssRules.length)
  }

  injectedClasses.add(className)
  return className
}
