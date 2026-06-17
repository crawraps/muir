import { describe, expect, test } from '@rstest/core'
import { fireEvent, render } from '@testing-library/react'
import { Form, FormToggleButton } from '../../../src'
import { Wrapper } from '../../helpers/wrapper'

describe('FormToggleButton', () => {
  test('registers with form and submits toggled value', async () => {
    let submitted: Record<string, unknown> | null = null
    const { container } = render(
      <Form
        defaultValues={{ enabled: false }}
        onSubmit={data => {
          submitted = data
        }}
      >
        <FormToggleButton name='enabled'>Enable</FormToggleButton>
        <button type='submit'>submit</button>
      </Form>,
      { wrapper: Wrapper },
    )

    const toggle = container.querySelector('[aria-pressed]') as HTMLElement
    expect(toggle.getAttribute('aria-pressed')).toBe('false')

    fireEvent.click(toggle)
    expect(toggle.getAttribute('aria-pressed')).toBe('true')

    fireEvent.submit(container.querySelector('form') as HTMLElement)
    await new Promise(resolve => setTimeout(resolve, 0))
    expect(submitted).toEqual({ enabled: true })
  })

  test('uses default value from form', () => {
    const { container } = render(
      <Form defaultValues={{ enabled: true }} onSubmit={() => {}}>
        <FormToggleButton name='enabled'>Enable</FormToggleButton>
      </Form>,
      { wrapper: Wrapper },
    )

    const toggle = container.querySelector('[aria-pressed]') as HTMLElement
    expect(toggle.getAttribute('aria-pressed')).toBe('true')
  })
})
