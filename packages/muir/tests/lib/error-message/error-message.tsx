import { describe, expect, test } from '@rstest/core'
import { render } from '@testing-library/react'
import { ErrorMessage } from '../../../src'
import { Wrapper } from '../../helpers/wrapper'

describe('ErrorMessage', () => {
  test('renders a single error message', () => {
    const { getByText } = render(<ErrorMessage>Please enter a valid email</ErrorMessage>, { wrapper: Wrapper })
    expect(getByText('Please enter a valid email')).toBeDefined()
  })

  test('renders multiple error messages', () => {
    const { getByText } = render(
      <ErrorMessage>
        <span>Error one</span>
        <span>Error two</span>
      </ErrorMessage>,
      { wrapper: Wrapper },
    )
    expect(getByText('Error one')).toBeDefined()
    expect(getByText('Error two')).toBeDefined()
  })

  test('renders an array of error messages', () => {
    const errors = ['First', 'Second']
    const { getByText } = render(
      <ErrorMessage>
        {errors.map(e => (
          <span key={e}>{e}</span>
        ))}
      </ErrorMessage>,
      { wrapper: Wrapper },
    )
    expect(getByText('First')).toBeDefined()
    expect(getByText('Second')).toBeDefined()
  })

  test('is invisible when children is undefined', () => {
    const { container } = render(<ErrorMessage />, { wrapper: Wrapper })
    expect(container.firstChild).toBeNull()
  })

  test('is invisible when children is null', () => {
    const { container } = render(<ErrorMessage>{null}</ErrorMessage>, { wrapper: Wrapper })
    expect(container.firstChild).toBeNull()
  })

  test('is invisible when children is false', () => {
    const { container } = render(<ErrorMessage>{false}</ErrorMessage>, { wrapper: Wrapper })
    expect(container.firstChild).toBeNull()
  })

  test('is invisible when children is an empty array', () => {
    const { container } = render(<ErrorMessage>{[]}</ErrorMessage>, { wrapper: Wrapper })
    expect(container.firstChild).toBeNull()
  })

  test('applies alert role', () => {
    const { container } = render(<ErrorMessage>Validation failed</ErrorMessage>, { wrapper: Wrapper })
    const el = container.querySelector('[role="alert"]')
    expect(el).not.toBeNull()
  })

  test('applies custom className', () => {
    const { container } = render(<ErrorMessage className='my-error'>Test</ErrorMessage>, { wrapper: Wrapper })
    const el = container.querySelector('[role="alert"]')
    expect(el?.classList.contains('my-error')).toBe(true)
  })

  test('wraps each child in an item wrapper', () => {
    const { container } = render(
      <ErrorMessage>
        <span>A</span>
        <span>B</span>
      </ErrorMessage>,
      { wrapper: Wrapper },
    )
    const items = container.querySelectorAll('[class*="item"]')
    expect(items.length).toBe(2)
  })
})
