import { describe, expect, test } from '@rstest/core'
import { fireEvent, render, screen } from '@testing-library/react'
import { ThemeProvider } from '../../../../../lib/app/theme-provider/model/ThemeProvider'
import Button from '../../../../../lib/components/button/ui/button'

// A wrapper to provide necessary theme context if needed by AnimeScope
const Wrapper = ({ children }: { children: React.ReactNode }) => <ThemeProvider>{children}</ThemeProvider>

describe('Button', () => {
  test('renders children correctly', () => {
    render(<Button>Click Me</Button>, { wrapper: Wrapper })
    expect(screen.getByText('Click Me')).toBeDefined()
  })

  test('renders as a link when href is provided', () => {
    render(<Button href='https://example.com'>Link</Button>, { wrapper: Wrapper })
    const linkElement = screen.getByText('Link').closest('a')
    expect(linkElement).toBeDefined()
    expect(linkElement?.getAttribute('href')).toBe('https://example.com')
  })

  test('applies variant classes correctly', () => {
    const { container } = render(<Button variant='outlined'>Outlined</Button>, { wrapper: Wrapper })
    expect(container.firstChild).toBeDefined()
    // It should have the variant-outlined class applied, which is a smart-clsx generated class
    // We just check if class attribute contains 'variant-outlined' substring because of CSS modules
    const buttonClass = (container.firstChild as HTMLElement).className
    expect(buttonClass).toContain('variant-outlined')
  })

  test('handles click events', () => {
    let clicked = false
    const handleClick = () => {
      clicked = true
    }
    render(<Button onClick={handleClick}>Clickable</Button>, { wrapper: Wrapper })
    fireEvent.click(screen.getByText('Clickable'))
    expect(clicked).toBe(true)
  })

  test('is disabled when disabled prop is true', () => {
    render(<Button disabled>Disabled</Button>, { wrapper: Wrapper })
    const button = screen.getByText('Disabled').closest('button')
    expect(button?.disabled).toBe(true)
  })
})
