import { describe, expect, test } from '@rstest/core'
import { fireEvent, render, screen } from '@testing-library/react'
import { TextInput } from '../../../src'
import { Wrapper } from '../../helpers/wrapper'

describe('TextInput', () => {
  test('renders with placeholder', () => {
    render(<TextInput placeholder='Enter text' />, { wrapper: Wrapper })
    expect(screen.getByPlaceholderText('Enter text')).toBeDefined()
  })

  test('applies filled variant styling', () => {
    const { container } = render(<TextInput placeholder='Test' />, { wrapper: Wrapper })
    const field = container.querySelector('[class*="field"]')
    expect(field).toBeDefined()
  })

  test('displays supporting text', () => {
    render(<TextInput supportingText='Helper message' />, { wrapper: Wrapper })
    expect(screen.getByText('Helper message')).toBeDefined()
  })

  test('displays error message and hides supporting text', () => {
    render(<TextInput error='Required field' supportingText='Helper' />, { wrapper: Wrapper })
    expect(screen.getByText('Required field')).toBeDefined()
    expect(screen.queryByText('Helper')).toBeNull()
  })

  test('applies is-error attribute when error is set', () => {
    const { container } = render(<TextInput error='Error' />, { wrapper: Wrapper })
    const field = container.querySelector('[class*="field"]')
    expect(field?.hasAttribute('is-error')).toBe(true)
  })

  test('renders as textarea when multiline', () => {
    const { container } = render(<TextInput multiline placeholder='Bio' />, { wrapper: Wrapper })
    expect(container.querySelector('textarea')).toBeDefined()
    expect(container.querySelector('input')).toBeNull()
  })

  test('applies disabled state', () => {
    const { container } = render(<TextInput disabled placeholder='Disabled' />, { wrapper: Wrapper })
    const field = container.querySelector('[class*="field"]')
    expect(field?.hasAttribute('is-disabled')).toBe(true)
    expect(container.querySelector('input')?.disabled).toBe(true)
  })

  test('handles change events', () => {
    let value = ''
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      value = e.target.value
    }
    render(<TextInput onChange={handleChange} placeholder='Type' />, { wrapper: Wrapper })
    fireEvent.change(screen.getByPlaceholderText('Type'), { target: { value: 'hello' } })
    expect(value).toBe('hello')
  })

  test('supports custom error component', () => {
    render(<TextInput error={<strong>Custom error</strong>} />, { wrapper: Wrapper })
    expect(screen.getByText('Custom error')).toBeDefined()
  })

  test('renders password input type', () => {
    const { container } = render(<TextInput placeholder='Password' type='password' />, { wrapper: Wrapper })
    expect(container.querySelector('input')?.getAttribute('type')).toBe('password')
  })
})
