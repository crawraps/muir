/**
 * Lazily fetches an SVG sprite sheet and injects it into the document body
 * so that `<use href="#symbol-id" />` references resolve correctly.
 */
export function injectSvgSprite(url: string): void {
  fetch(url)
    .then(res => res.text())
    .then(svg => {
      const container = document.createElement('div')
      container.setAttribute('hidden', '')
      container.setAttribute('aria-hidden', 'true')
      container.style.position = 'absolute'
      container.style.width = '0'
      container.style.height = '0'
      container.style.overflow = 'hidden'
      container.innerHTML = svg
      document.body.insertBefore(container, document.body.firstChild)
    })
}
