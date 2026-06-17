import { describe, expect, test } from '@rstest/core'
import { fireEvent, render, screen } from '@testing-library/react'
import { BottomSheet } from '../../../src'
import { Wrapper } from '../../helpers/wrapper'

describe('BottomSheet', () => {
  test('renders content when isOpen is true', () => {
    render(
      <BottomSheet isOpen={true} onOpenChange={() => {}}>
        <div>Content</div>
      </BottomSheet>,
      { wrapper: Wrapper },
    )
    expect(screen.getByText('Content')).toBeInTheDocument()
  })

  test('calls onOpenChange when escape key is pressed', () => {
    let calledWith: boolean | undefined
    render(
      <BottomSheet
        isOpen={true}
        onOpenChange={open => {
          calledWith = open
        }}
      >
        <div>Content</div>
      </BottomSheet>,
      { wrapper: Wrapper },
    )

    fireEvent.keyDown(document, { key: 'Escape', code: 'Escape' })

    expect(calledWith).toBe(false)
  })

  test('has correct accessibility attributes', () => {
    render(
      <BottomSheet isOpen={true} onOpenChange={() => {}} title='AccTitle'>
        <div>Content</div>
      </BottomSheet>,
      { wrapper: Wrapper },
    )

    const sheets = screen.getAllByRole('dialog')
    const sheet = sheets[sheets.length - 1]
    expect(sheet).toHaveAttribute('aria-modal', 'true')
    expect(sheet).toHaveAttribute('aria-labelledby', 'bs-title')
    expect(screen.getByText('AccTitle')).toBeInTheDocument()
  })
})
