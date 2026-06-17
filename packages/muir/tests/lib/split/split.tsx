import { describe, expect, test } from '@rstest/core'
import { render, screen } from '@testing-library/react'
import { Button, Split, TextInput } from '../../../src'
import { Wrapper } from '../../helpers/wrapper'

describe('Split', () => {
  test('renders children', () => {
    render(
      <Split>
        <Button>First</Button>
        <Button>Second</Button>
      </Split>,
      { wrapper: Wrapper },
    )
    expect(screen.getByText('First')).toBeDefined()
    expect(screen.getByText('Second')).toBeDefined()
  })

  test('renders as horizontal by default', () => {
    const { container } = render(
      <Split>
        <Button>A</Button>
        <Button>B</Button>
      </Split>,
      { wrapper: Wrapper },
    )
    const split = container.firstElementChild
    expect(split?.className).toContain('split')
    expect(split?.hasAttribute('is-vertical')).toBe(false)
  })

  test('applies is-vertical attribute when vertical prop is set', () => {
    const { container } = render(
      <Split vertical>
        <Button>A</Button>
        <Button>B</Button>
      </Split>,
      { wrapper: Wrapper },
    )
    const split = container.firstElementChild
    expect(split?.hasAttribute('is-vertical')).toBe(true)
  })

  test('passes className prop', () => {
    const { container } = render(
      <Split className='custom'>
        <Button>A</Button>
      </Split>,
      { wrapper: Wrapper },
    )
    const split = container.firstElementChild
    expect(split?.className).toContain('custom')
  })

  test('renders with mixed children types', () => {
    const { container } = render(
      <Split>
        <Button>Action</Button>
        <TextInput placeholder='Type here' />
      </Split>,
      { wrapper: Wrapper },
    )
    expect(screen.getByText('Action')).toBeDefined()
    expect(screen.getByPlaceholderText('Type here')).toBeDefined()
    expect(container.querySelector('[class*="split"]')?.children.length).toBe(2)
  })

  test('supports custom style with background-color variable', () => {
    const { container } = render(
      <Split style={{ '--background-color': 'red' } as React.CSSProperties}>
        <Button>Styled</Button>
      </Split>,
      { wrapper: Wrapper },
    )
    const split = container.firstElementChild as HTMLElement
    expect(split?.style.getPropertyValue('--background-color')).toBe('red')
  })
})
