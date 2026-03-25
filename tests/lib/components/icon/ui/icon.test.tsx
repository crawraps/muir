import { describe, expect, test } from '@rstest/core'
import { render } from '@testing-library/react'
import { ThemeProvider } from '../../../../../lib/app/theme-provider/model/ThemeProvider'
import Icon from '../../../../../lib/components/icon/ui/icon'

const Wrapper = ({ children }: { children: React.ReactNode }) => <ThemeProvider>{children}</ThemeProvider>

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

  test('applies default size of 24', () => {
    const { container } = render(<Icon name='home' />, { wrapper: Wrapper })
    const svg = container.querySelector('svg')
    expect(svg?.getAttribute('width')).toBe('24')
    expect(svg?.getAttribute('height')).toBe('24')
  })

  test('applies custom size', () => {
    const { container } = render(<Icon name='home' size={48} />, { wrapper: Wrapper })
    const svg = container.querySelector('svg')
    expect(svg?.getAttribute('width')).toBe('48')
    expect(svg?.getAttribute('height')).toBe('48')
  })

  test('is always square (width equals height)', () => {
    const { container } = render(<Icon name='home' size={32} />, { wrapper: Wrapper })
    const svg = container.querySelector('svg')
    expect(svg?.getAttribute('width')).toBe(svg?.getAttribute('height'))
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
