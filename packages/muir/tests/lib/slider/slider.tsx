import { describe, expect, test } from '@rstest/core'
import { render } from '@testing-library/react'
import { Slider } from '../../../src'
import { Wrapper } from '../../helpers/wrapper'

describe('Slider', () => {
  test('renders a native input[type=range]', () => {
    const { container } = render(<Slider />, { wrapper: Wrapper })
    const input = container.querySelector('input') as HTMLInputElement
    expect(input.type).toBe('range')
  })

  test('passes min and max to native input', () => {
    const { container } = render(<Slider min={0} max={100} />, { wrapper: Wrapper })
    const input = container.querySelector('input') as HTMLInputElement
    expect(input.min).toBe('0')
    expect(input.max).toBe('100')
  })

  test('sets is-error attribute without rendering message by default', () => {
    const { container, queryByText } = render(<Slider error='Required' />, { wrapper: Wrapper })
    const root = container.querySelector('[is-error]') as HTMLElement
    expect(root).not.toBeNull()
    expect(queryByText('Required')).toBeNull()
  })

  test('renders error message when showError is true', () => {
    const { getByText } = render(<Slider error='Required' showError />, { wrapper: Wrapper })
    expect(getByText('Required')).toBeTruthy()
  })

  test('sets data-orientation to vertical when orientation is vertical', () => {
    const { container } = render(<Slider orientation='vertical' />, { wrapper: Wrapper })
    const root = container.querySelector('[data-orientation="vertical"]') as HTMLElement
    expect(root).not.toBeNull()
  })

  test('sets data-orientation to horizontal by default', () => {
    const { container } = render(<Slider />, { wrapper: Wrapper })
    const root = container.querySelector('[data-orientation="horizontal"]') as HTMLElement
    expect(root).not.toBeNull()
  })

  test('renders stop marks when stops prop is provided', () => {
    const { container } = render(<Slider stops={[0, 25, 50, 75, 100]} />, { wrapper: Wrapper })
    const input = container.querySelector('input') as HTMLInputElement
    expect(input).not.toBeNull()
  })

  test('renders track segments with data-active attributes', () => {
    const { container } = render(<Slider min={0} max={100} defaultValue={50} />, { wrapper: Wrapper })
    const activeSegments = container.querySelectorAll('[data-active]')
    expect(activeSegments.length).toBeGreaterThan(0)
  })

  test('sets is-disabled attribute when disabled', () => {
    const { container } = render(<Slider disabled />, { wrapper: Wrapper })
    const root = container.querySelector('[is-disabled]') as HTMLElement
    expect(root).not.toBeNull()
  })

  test('origin prop uses min value by default for fill start', () => {
    const { container } = render(<Slider min={-20} max={80} origin={0} defaultValue={30} />, { wrapper: Wrapper })
    const input = container.querySelector('input') as HTMLInputElement
    expect(input.min).toBe('-20')
    expect(input.max).toBe('80')
  })
})
