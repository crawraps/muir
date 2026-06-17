import { describe, expect, test } from '@rstest/core'
import { fireEvent, render } from '@testing-library/react'
import { Form, FormCheckbox } from '../../../src'
import { Wrapper } from '../../helpers/wrapper'

describe('FormCheckbox', () => {
  test('registers and submits value', async () => {
    let submitted: Record<string, unknown> | null = null
    const { container } = render(
      <Form
        defaultValues={{ agree: false }}
        onSubmit={data => {
          submitted = data
        }}
      >
        <FormCheckbox name='agree' />
      </Form>,
      { wrapper: Wrapper },
    )

    fireEvent.click(container.querySelector('input') as HTMLInputElement)
    fireEvent.submit(container.querySelector('form') as HTMLElement)
    await new Promise(resolve => setTimeout(resolve, 0))
    expect(submitted).toEqual({ agree: true })
  })
})
