import { describe, expect, test } from '@rstest/core'
import { fireEvent, render } from '@testing-library/react'
import { RadioButton } from '../../../src'
import { Wrapper } from '../../helpers/wrapper'

describe('RadioButton', () => {
  test('renders a native input[type=radio]', () => {
    const { container } = render(<RadioButton name='opt' value='a' />, { wrapper: Wrapper })
    const input = container.querySelector('input') as HTMLInputElement
    expect(input.type).toBe('radio')
  })

  test('selects on click', () => {
    const { container } = render(<RadioButton name='opt' value='a' />, { wrapper: Wrapper })
    const input = container.querySelector('input') as HTMLInputElement
    fireEvent.click(input)
    expect(input.checked).toBe(true)
  })

  test('groups by name so only one is selected', () => {
    const { container } = render(
      <>
        <RadioButton name='group' value='a' />
        <RadioButton name='group' value='b' />
      </>,
      { wrapper: Wrapper },
    )
    const [a, b] = Array.from(container.querySelectorAll('input')) as HTMLInputElement[]
    fireEvent.click(a)
    expect(a.checked).toBe(true)
    fireEvent.click(b)
    expect(a.checked).toBe(false)
    expect(b.checked).toBe(true)
  })

  test('renders error message only when showError is true', () => {
    const first = render(<RadioButton error='Required' />, { wrapper: Wrapper })
    expect(first.queryByText('Required')).toBeNull()
    const second = render(<RadioButton error='Required' showError />, { wrapper: Wrapper })
    expect(second.getByText('Required')).toBeTruthy()
  })
})
