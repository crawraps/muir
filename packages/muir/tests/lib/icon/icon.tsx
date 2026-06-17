import { describe, expect, test } from '@rstest/core'
import { render } from '@testing-library/react'
import { Icon } from '../../../src'
import { Wrapper } from '../../helpers/wrapper'

describe('Icon', () => {
  test('renders an svg element', () => {
    const { container } = render(<Icon name='home' />, { wrapper: Wrapper })
    const svg = container.querySelector('svg')
    expect(svg).toBeDefined()
  })

  test('renders a use element with correct href', () => {
    const { container } = render(<Icon name='home' />, { wrapper: Wrapper })
    const use = container.querySelector('use')
    expect(use?.getAttribute('href')).toBe('#home')
  })

  test('applies custom size via --size variable', () => {
    const { container } = render(<Icon name='home' size={48} />, { wrapper: Wrapper })
    const svg = container.querySelector('svg') as SVGElement
    expect(svg.style.getPropertyValue('--size')).toBe('48px')
  })

  test('is always square (aspect-ratio preserved)', () => {
    const { container } = render(<Icon name='home' size={32} />, { wrapper: Wrapper })
    const svg = container.querySelector('svg') as SVGElement
    expect(svg.style.getPropertyValue('--size')).toBe('32px')
  })

  test('has aria-hidden attribute', () => {
    const { container } = render(<Icon name='home' />, { wrapper: Wrapper })
    const svg = container.querySelector('svg')
    expect(svg?.getAttribute('aria-hidden')).toBe('true')
  })

  test('passes additional svg props', () => {
    const { container } = render(<Icon data-testid='icon-test' name='home' />, { wrapper: Wrapper })
    const svg = container.querySelector('svg')
    expect(svg?.getAttribute('data-testid')).toBe('icon-test')
  })
})
