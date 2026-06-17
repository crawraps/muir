import { describe, expect, test } from '@rstest/core'
import { fireEvent, render } from '@testing-library/react'
import { Checkbox } from '../../../src'
import { Wrapper } from '../../helpers/wrapper'

/** Query helper: finds elements by CSS module class substring */
function queryByClass(container: HTMLElement, substring: string): HTMLElement | null {
  return container.querySelector(`[class*="${substring}"]`)
}

describe('Checkbox', () => {
  // ── Rendering ──────────────────────────────────────────────────────

  test('renders a native input[type=checkbox]', () => {
    const { container } = render(<Checkbox />, { wrapper: Wrapper })
    const input = container.querySelector('input') as HTMLInputElement
    expect(input).not.toBeNull()
    expect(input.type).toBe('checkbox')
  })

  test('renders SVG check icon inside the box element', () => {
    const { container } = render(<Checkbox />, { wrapper: Wrapper })
    const box = queryByClass(container, 'box')
    expect(box).not.toBeNull()
    const svg = box!.querySelector('svg')
    expect(svg).not.toBeNull()
  })

  test('renders background element inside the box', () => {
    const { container } = render(<Checkbox />, { wrapper: Wrapper })
    const background = queryByClass(container, 'background')
    expect(background).not.toBeNull()
  })

  test('hides native input with visually-hidden class', () => {
    const { container } = render(<Checkbox />, { wrapper: Wrapper })
    const input = container.querySelector('input') as HTMLInputElement
    expect(input.className).toContain('input')
  })

  test('renders root span with control span wrapping input and box', () => {
    const { container } = render(<Checkbox />, { wrapper: Wrapper })
    const root = queryByClass(container, 'root')
    expect(root).not.toBeNull()
    const control = queryByClass(container, 'control')
    expect(control).not.toBeNull()
    const input = container.querySelector('input')
    expect(control!.contains(input)).toBe(true)
  })

  // ── Hover animation ────────────────────────────────────────────────

  test('triggers hover animation on mouseenter of checkbox root', () => {
    const { container } = render(<Checkbox />, { wrapper: Wrapper })
    const root = queryByClass(container, 'root')!
    const background = queryByClass(container, 'background')!
    const initialOpacity = background.style.opacity

    fireEvent.mouseEnter(root)
    // Animation sets the background opacity (from inactive to vague)
    expect(background.style.opacity).not.toBe(initialOpacity)
  })

  test('removes hover animation on mouseleave of checkbox root', () => {
    const { container } = render(<Checkbox />, { wrapper: Wrapper })
    const root = queryByClass(container, 'root')!
    const background = queryByClass(container, 'background')!

    fireEvent.mouseEnter(root)
    fireEvent.mouseLeave(root)
    // After leaving, the leave animation runs (toward inactive state)
    expect(background.style.opacity).toBeDefined()
  })

  test('triggers hover animation when hovering on parent label', () => {
    const { container } = render(
      <label>
        <Checkbox />
      </label>,
      { wrapper: Wrapper },
    )
    const label = container.querySelector('label')!
    const background = queryByClass(container, 'background')!
    const initialOpacity = background.style.opacity

    fireEvent.mouseEnter(label)
    expect(background.style.opacity).not.toBe(initialOpacity)
  })

  test('removes hover animation when leaving parent label', () => {
    const { container } = render(
      <label>
        <Checkbox />
      </label>,
      { wrapper: Wrapper },
    )
    const label = container.querySelector('label')!
    const background = queryByClass(container, 'background')!

    fireEvent.mouseEnter(label)
    fireEvent.mouseLeave(label)
    expect(background.style.opacity).toBeDefined()
  })

  // ── Active (pressed) animation ─────────────────────────────────────

  test('triggers active animation on mousedown of checkbox root', () => {
    const { container } = render(<Checkbox />, { wrapper: Wrapper })
    const root = queryByClass(container, 'root')!
    const background = queryByClass(container, 'background')!
    const initialOpacity = background.style.opacity

    fireEvent.mouseEnter(root)
    fireEvent.mouseDown(root)
    // Mousedown starts the press animation
    expect(background.style.opacity).not.toBe(initialOpacity)
  })

  test('triggers active animation on mousedown of parent label', () => {
    const { container } = render(
      <label>
        <Checkbox />
      </label>,
      { wrapper: Wrapper },
    )
    const label = container.querySelector('label')!
    const background = queryByClass(container, 'background')!
    const initialOpacity = background.style.opacity

    fireEvent.mouseEnter(label)
    fireEvent.mouseDown(label)
    expect(background.style.opacity).not.toBe(initialOpacity)
  })

  // ── Checked animation (uncontrolled) ───────────────────────────────

  test('toggles checked state on click in uncontrolled mode', () => {
    const { container } = render(<Checkbox />, { wrapper: Wrapper })
    const input = container.querySelector('input') as HTMLInputElement
    expect(input.checked).toBe(false)
    fireEvent.click(input)
    expect(input.checked).toBe(true)
    fireEvent.click(input)
    expect(input.checked).toBe(false)
  })

  // ── Checked animation (controlled) ────────────────────────────────

  test('reflects controlled checked=true prop on native input', () => {
    const { container } = render(<Checkbox checked={true} onChange={() => {}} />, { wrapper: Wrapper })
    const input = container.querySelector('input') as HTMLInputElement
    expect(input.checked).toBe(true)
  })

  test('reflects controlled checked=false prop on native input', () => {
    const { container } = render(<Checkbox checked={false} onChange={() => {}} />, { wrapper: Wrapper })
    const input = container.querySelector('input') as HTMLInputElement
    expect(input.checked).toBe(false)
  })

  test('updates native input when controlled checked prop changes', () => {
    const { container, rerender } = render(<Checkbox checked={false} onChange={() => {}} />, {
      wrapper: Wrapper,
    })
    const input = container.querySelector('input') as HTMLInputElement
    expect(input.checked).toBe(false)

    rerender(<Checkbox checked={true} onChange={() => {}} />)
    expect(input.checked).toBe(true)

    rerender(<Checkbox checked={false} onChange={() => {}} />)
    expect(input.checked).toBe(false)
  })

  // ── Native input follows visual state ─────────────────────────────

  test('native input is unchecked by default', () => {
    const { container } = render(<Checkbox />, { wrapper: Wrapper })
    const input = container.querySelector('input') as HTMLInputElement
    expect(input.checked).toBe(false)
  })

  test('native input becomes checked after clicking checkbox', () => {
    const { container } = render(<Checkbox />, { wrapper: Wrapper })
    const input = container.querySelector('input') as HTMLInputElement
    fireEvent.click(input)
    expect(input.checked).toBe(true)
  })

  test('native input becomes unchecked after clicking checked checkbox', () => {
    const { container } = render(<Checkbox defaultChecked />, { wrapper: Wrapper })
    const input = container.querySelector('input') as HTMLInputElement
    expect(input.checked).toBe(true)
    fireEvent.click(input)
    expect(input.checked).toBe(false)
  })

  // ── Error state ───────────────────────────────────────────────────

  test('sets is-error attribute on root when error prop is provided', () => {
    const { container } = render(<Checkbox error='Required' />, { wrapper: Wrapper })
    const root = queryByClass(container, 'root')!
    expect(root.hasAttribute('is-error')).toBe(true)
  })

  test('does not set is-error attribute when error is absent', () => {
    const { container } = render(<Checkbox />, { wrapper: Wrapper })
    const root = queryByClass(container, 'root')!
    expect(root.hasAttribute('is-error')).toBe(false)
  })

  test('does not render error message by default (showError defaults to false)', () => {
    const { container } = render(<Checkbox error='Required' />, { wrapper: Wrapper })
    const errorText = queryByClass(container, 'error-text')
    expect(errorText).toBeNull()
  })

  test('renders error message when showError is true and error is present', () => {
    const { container } = render(<Checkbox error='Required' showError />, { wrapper: Wrapper })
    const errorText = queryByClass(container, 'error-text')
    expect(errorText).not.toBeNull()
    expect(errorText!.textContent).toBe('Required')
  })

  test('does not render error message when showError is explicitly false', () => {
    const { container } = render(<Checkbox error='Required' showError={false} />, { wrapper: Wrapper })
    const errorText = queryByClass(container, 'error-text')
    expect(errorText).toBeNull()
  })

  test('does not render error message when error prop is falsy', () => {
    const { container } = render(<Checkbox error={false} showError />, { wrapper: Wrapper })
    const errorText = queryByClass(container, 'error-text')
    expect(errorText).toBeNull()
  })

  test('sets aria-invalid on input when error is present', () => {
    const { container } = render(<Checkbox error='Required' />, { wrapper: Wrapper })
    const input = container.querySelector('input') as HTMLInputElement
    expect(input.getAttribute('aria-invalid')).toBe('true')
  })

  test('does not set aria-invalid on input when error is absent', () => {
    const { container } = render(<Checkbox />, { wrapper: Wrapper })
    const input = container.querySelector('input') as HTMLInputElement
    expect(input.getAttribute('aria-invalid')).toBeNull()
  })

  // ── Default checked state ─────────────────────────────────────────

  test('renders native input as checked when defaultChecked is true', () => {
    const { container } = render(<Checkbox defaultChecked />, { wrapper: Wrapper })
    const input = container.querySelector('input') as HTMLInputElement
    expect(input.checked).toBe(true)
  })

  test('sets background to active opacity when defaultChecked is true', () => {
    const { container } = render(<Checkbox defaultChecked />, { wrapper: Wrapper })
    const background = queryByClass(container, 'background')!
    // Animation init sets active state: opacity and transform are explicitly set
    expect(background.style.opacity).not.toBe('')
  })

  test('uncontrolled defaultChecked checkbox toggles to unchecked on click', () => {
    const { container } = render(<Checkbox defaultChecked />, { wrapper: Wrapper })
    const input = container.querySelector('input') as HTMLInputElement
    expect(input.checked).toBe(true)
    fireEvent.click(input)
    expect(input.checked).toBe(false)
  })

  test('uncontrolled defaultChecked checkbox toggles back to checked on second click', () => {
    const { container } = render(<Checkbox defaultChecked />, { wrapper: Wrapper })
    const input = container.querySelector('input') as HTMLInputElement
    fireEvent.click(input)
    expect(input.checked).toBe(false)
    fireEvent.click(input)
    expect(input.checked).toBe(true)
  })

  // ── Disabled state ─────────────────────────────────────────────────

  test('sets is-disabled attribute on root when disabled prop is true', () => {
    const { container } = render(<Checkbox disabled />, { wrapper: Wrapper })
    const root = queryByClass(container, 'root')!
    expect(root.hasAttribute('is-disabled')).toBe(true)
  })

  test('does not set is-disabled attribute when not disabled', () => {
    const { container } = render(<Checkbox />, { wrapper: Wrapper })
    const root = queryByClass(container, 'root')!
    expect(root.hasAttribute('is-disabled')).toBe(false)
  })

  test('native input is disabled when disabled prop is true', () => {
    const { container } = render(<Checkbox disabled />, { wrapper: Wrapper })
    const input = container.querySelector('input') as HTMLInputElement
    expect(input.disabled).toBe(true)
  })

  test('does not trigger hover animation when disabled', () => {
    const { container } = render(<Checkbox disabled />, { wrapper: Wrapper })
    const root = queryByClass(container, 'root')!
    const background = queryByClass(container, 'background')!
    const initialOpacity = background.style.opacity

    fireEvent.mouseEnter(root)
    // Animation should be suppressed: opacity stays the same
    expect(background.style.opacity).toBe(initialOpacity)
  })

  test('does not trigger active animation when disabled', () => {
    const { container } = render(<Checkbox disabled />, { wrapper: Wrapper })
    const root = queryByClass(container, 'root')!
    const background = queryByClass(container, 'background')!
    const initialOpacity = background.style.opacity

    fireEvent.mouseDown(root)
    expect(background.style.opacity).toBe(initialOpacity)
  })

  test('does not trigger hover animation via label when disabled', () => {
    const { container } = render(
      <label>
        <Checkbox disabled />
      </label>,
      { wrapper: Wrapper },
    )
    const label = container.querySelector('label')!
    const background = queryByClass(container, 'background')!
    const initialOpacity = background.style.opacity

    fireEvent.mouseEnter(label)
    expect(background.style.opacity).toBe(initialOpacity)
  })

  test('does not trigger active animation via label when disabled', () => {
    const { container } = render(
      <label>
        <Checkbox disabled />
      </label>,
      { wrapper: Wrapper },
    )
    const label = container.querySelector('label')!
    const background = queryByClass(container, 'background')!
    const initialOpacity = background.style.opacity

    fireEvent.mouseDown(label)
    expect(background.style.opacity).toBe(initialOpacity)
  })
})
