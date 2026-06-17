export interface GrainFilterParams {
  density: number
  surfaceScale: number
  elevation: number
  specularity: number
}

const injectedFilters = new Set<string>()

function buildFilterId(params: GrainFilterParams): string {
  return `muir-surface-grain-${params.density}-${params.surfaceScale}-${params.elevation}-${params.specularity}`
}

export function ensureGrainFilter(params: GrainFilterParams): string {
  if (typeof document === 'undefined') return ''

  const id = buildFilterId(params)

  if (injectedFilters.has(id)) return id
  if (document.getElementById(id)) {
    injectedFilters.add(id)
    return id
  }

  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg')
  svg.setAttribute('aria-hidden', 'true')
  svg.style.position = 'absolute'
  svg.style.width = '0'
  svg.style.height = '0'
  svg.style.overflow = 'hidden'
  svg.style.pointerEvents = 'none'

  const filter = document.createElementNS('http://www.w3.org/2000/svg', 'filter')
  filter.id = id
  filter.setAttribute('x', '0')
  filter.setAttribute('y', '0')
  filter.setAttribute('width', '200')
  filter.setAttribute('height', '200')
  filter.setAttribute('filterUnits', 'userSpaceOnUse')

  const turbulence = document.createElementNS('http://www.w3.org/2000/svg', 'feTurbulence')
  turbulence.setAttribute('type', 'fractalNoise')
  turbulence.setAttribute('baseFrequency', String(params.density))
  turbulence.setAttribute('numOctaves', '4')
  turbulence.setAttribute('stitchTiles', 'stitch')
  turbulence.setAttribute('result', 'noise')

  const specular = document.createElementNS('http://www.w3.org/2000/svg', 'feSpecularLighting')
  specular.setAttribute('in', 'noise')
  specular.setAttribute('surfaceScale', String(params.surfaceScale))
  specular.setAttribute('specularConstant', String(params.specularity))
  specular.setAttribute('specularExponent', '20')
  specular.setAttribute('lighting-color', 'white')
  specular.setAttribute('result', 'specular')

  const light = document.createElementNS('http://www.w3.org/2000/svg', 'feDistantLight')
  light.setAttribute('azimuth', '45')
  light.setAttribute('elevation', String(params.elevation))

  specular.appendChild(light)

  filter.appendChild(turbulence)
  filter.appendChild(specular)
  svg.appendChild(filter)
  document.body.appendChild(svg)

  injectedFilters.add(id)
  return id
}
