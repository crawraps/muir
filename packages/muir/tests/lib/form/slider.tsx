import { describe, expect, test } from '@rstest/core'
import { fireEvent, render } from '@testing-library/react'
import { Form, FormSlider } from '../../../src'
import { Wrapper } from '../../helpers/wrapper'

describe('FormSlider', () => {
  test('registers and submits value', async () => {
    let submitted: Record<string, unknown> | null = null
    const { container } = render(
      <Form
        defaultValues={{ volume: 50 }}
        onSubmit={data => {
          submitted = data
        }}
      >
        <FormSlider name='volume' />
      </Form>,
      { wrapper: Wrapper },
    )

    const input = container.querySelector('input') as HTMLInputElement
    expect(input.value).toBe('50')
    fireEvent.change(input, { target: { value: '75' } })
    fireEvent.submit(container.querySelector('form') as HTMLElement)
    await new Promise(resolve => setTimeout(resolve, 0))
    expect(submitted).toEqual({ volume: '75' })
  })
})
