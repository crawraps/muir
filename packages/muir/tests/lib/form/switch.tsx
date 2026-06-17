import { describe, expect, test } from '@rstest/core'
import { fireEvent, render } from '@testing-library/react'
import { Form, FormSwitch } from '../../../src'
import { Wrapper } from '../../helpers/wrapper'

describe('FormSwitch', () => {
  test('registers and submits value', async () => {
    let submitted: Record<string, unknown> | null = null
    const { container } = render(
      <Form
        defaultValues={{ notifications: false }}
        onSubmit={data => {
          submitted = data
        }}
      >
        <FormSwitch label='Notifications' name='notifications' />
      </Form>,
      { wrapper: Wrapper },
    )

    fireEvent.click(container.querySelector('input') as HTMLInputElement)
    fireEvent.submit(container.querySelector('form') as HTMLElement)
    await new Promise(resolve => setTimeout(resolve, 0))
    expect(submitted).toEqual({ notifications: true })
  })
})
