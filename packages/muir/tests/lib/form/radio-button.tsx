import { describe, expect, test } from '@rstest/core'
import { fireEvent, render } from '@testing-library/react'
import { Form, FormRadioButton } from '../../../src'
import { Wrapper } from '../../helpers/wrapper'

describe('FormRadioButton', () => {
  test('registers a group and submits selected value', async () => {
    let submitted: Record<string, unknown> | null = null
    const { container } = render(
      <Form
        defaultValues={{ size: 'm' }}
        onSubmit={data => {
          submitted = data
        }}
      >
        <FormRadioButton label='Small' name='size' value='s' />
        <FormRadioButton label='Medium' name='size' value='m' />
        <FormRadioButton label='Large' name='size' value='l' />
      </Form>,
      { wrapper: Wrapper },
    )

    const inputs = Array.from(container.querySelectorAll('input')) as HTMLInputElement[]
    fireEvent.click(inputs[2])
    fireEvent.submit(container.querySelector('form') as HTMLElement)
    await new Promise(resolve => setTimeout(resolve, 0))
    expect(submitted).toEqual({ size: 'l' })
  })
})
