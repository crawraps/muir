import { describe, expect, test } from '@rstest/core'
import { fireEvent, render, screen } from '@testing-library/react'
import { Button } from '../../../src'
import { Wrapper } from '../../helpers/wrapper'

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

  test('applies variant attribute correctly', () => {
    const { container } = render(<Button variant='outlined'>Outlined</Button>, { wrapper: Wrapper })
    expect(container.firstChild).toBeDefined()
    expect((container.firstChild as HTMLElement).getAttribute('variant')).toBe('outlined')
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
