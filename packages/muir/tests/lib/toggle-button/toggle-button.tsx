import { describe, expect, test } from '@rstest/core'
import { fireEvent, render } from '@testing-library/react'
import { ToggleButton } from '../../../src'
import { Wrapper } from '../../helpers/wrapper'

describe('ToggleButton', () => {
  test('renders with filled-tonal variant by default', () => {
    const { container } = render(<ToggleButton>Toggle</ToggleButton>, { wrapper: Wrapper })
    const button = container.firstChild as HTMLElement
    expect(button.getAttribute('variant')).toBe('filled-tonal')
    expect(button.getAttribute('aria-pressed')).toBe('false')
  })

  test('toggles state on click (uncontrolled)', () => {
    const { container } = render(<ToggleButton>Toggle</ToggleButton>, { wrapper: Wrapper })
    const button = container.firstChild as HTMLElement
    fireEvent.click(button)
    expect(button.getAttribute('aria-pressed')).toBe('true')
    expect(button.getAttribute('variant')).toBe('filled')
    fireEvent.click(button)
    expect(button.getAttribute('aria-pressed')).toBe('false')
    expect(button.getAttribute('variant')).toBe('filled-tonal')
  })

  test('calls onToggle with next state', () => {
    const calls: boolean[] = []
    const { container } = render(<ToggleButton onToggle={v => calls.push(v)}>Toggle</ToggleButton>, { wrapper: Wrapper })
    fireEvent.click(container.firstChild as HTMLElement)
    fireEvent.click(container.firstChild as HTMLElement)
    expect(calls).toEqual([true, false])
  })

  test('respects controlled checked prop', () => {
    const { container, rerender } = render(<ToggleButton checked={false}>Toggle</ToggleButton>, {
      wrapper: Wrapper,
    })
    const button = container.firstChild as HTMLElement
    fireEvent.click(button)
    expect(button.getAttribute('aria-pressed')).toBe('false')
    rerender(<ToggleButton checked={true}>Toggle</ToggleButton>)
    expect(button.getAttribute('aria-pressed')).toBe('true')
  })

  test('backward compat: toggled prop still works', () => {
    const { container } = render(<ToggleButton toggled={true}>Toggle</ToggleButton>, { wrapper: Wrapper })
    const button = container.firstChild as HTMLElement
    expect(button.getAttribute('aria-pressed')).toBe('true')
    expect(button.getAttribute('variant')).toBe('filled')
  })

  test('shows check icon when checked by default', () => {
    const { container } = render(<ToggleButton checked>Toggle</ToggleButton>, { wrapper: Wrapper })
    const svg = container.querySelector('svg')
    expect(svg).not.toBeNull()
  })

  test('hides check icon when showCheckIcon is false', () => {
    const { container } = render(
      <ToggleButton checked showCheckIcon={false}>
        Toggle
      </ToggleButton>,
      { wrapper: Wrapper },
    )
    const svg = container.querySelector('svg')
    expect(svg).toBeNull()
  })

  test('does not show check icon when unchecked', () => {
    const { container } = render(<ToggleButton>Toggle</ToggleButton>, { wrapper: Wrapper })
    const svg = container.querySelector('svg')
    expect(svg).toBeNull()
  })
})
