import { describe, expect, test } from '@rstest/core'
import { fireEvent, render } from '@testing-library/react'
import { Switch } from '../../../src'
import { Wrapper } from '../../helpers/wrapper'

describe('Switch', () => {
  test('renders a native input[type=checkbox]', () => {
    const { container } = render(<Switch />, { wrapper: Wrapper })
    const input = container.querySelector('input') as HTMLInputElement
    expect(input.type).toBe('checkbox')
  })

  test('toggles on click', () => {
    const { container } = render(<Switch />, { wrapper: Wrapper })
    const input = container.querySelector('input') as HTMLInputElement
    expect(input.checked).toBe(false)
    fireEvent.click(input)
    expect(input.checked).toBe(true)
  })

  test('sets is-error attribute without rendering message text', () => {
    const { container, queryByText } = render(<Switch error='Required' />, { wrapper: Wrapper })
    const root = container.querySelector('[is-error]') as HTMLElement
    expect(root).not.toBeNull()
    expect(queryByText('Required')).toBeNull()
  })
})
