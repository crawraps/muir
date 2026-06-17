import { describe, expect, test } from '@rstest/core'
import { render, screen } from '@testing-library/react'
import { Text } from '../../../src'
import { Wrapper } from '../../helpers/wrapper'

describe('Text', () => {
  test('renders h1 as an h1 element', () => {
    render(<Text type='h1'>Heading 1</Text>, { wrapper: Wrapper })
    const el = screen.getByText('Heading 1')
    expect(el.tagName).toBe('H1')
  })

  test('renders h2 as an h2 element', () => {
    render(<Text type='h2'>Heading 2</Text>, { wrapper: Wrapper })
    expect(screen.getByText('Heading 2').tagName).toBe('H2')
  })

  test('renders h3 as an h3 element', () => {
    render(<Text type='h3'>Heading 3</Text>, { wrapper: Wrapper })
    expect(screen.getByText('Heading 3').tagName).toBe('H3')
  })

  test('renders h4 as an h4 element', () => {
    render(<Text type='h4'>Heading 4</Text>, { wrapper: Wrapper })
    expect(screen.getByText('Heading 4').tagName).toBe('H4')
  })

  test('renders h5 as an h5 element', () => {
    render(<Text type='h5'>Heading 5</Text>, { wrapper: Wrapper })
    expect(screen.getByText('Heading 5').tagName).toBe('H5')
  })

  test('renders h6 as an h6 element', () => {
    render(<Text type='h6'>Heading 6</Text>, { wrapper: Wrapper })
    expect(screen.getByText('Heading 6').tagName).toBe('H6')
  })

  test('renders body as a p element', () => {
    render(<Text type='body'>Paragraph</Text>, { wrapper: Wrapper })
    expect(screen.getByText('Paragraph').tagName).toBe('P')
  })

  test('renders label as a label element with htmlFor', () => {
    render(
      <Text htmlFor='email' type='label'>
        Email
      </Text>,
      { wrapper: Wrapper },
    )
    const el = screen.getByText('Email')
    expect(el.tagName).toBe('LABEL')
    expect(el.getAttribute('for')).toBe('email')
  })

  test('renders title as a span element', () => {
    render(<Text type='title'>Title</Text>, { wrapper: Wrapper })
    expect(screen.getByText('Title').tagName).toBe('SPAN')
  })

  test('renders display as a span element', () => {
    render(<Text type='display'>Display</Text>, { wrapper: Wrapper })
    expect(screen.getByText('Display').tagName).toBe('SPAN')
  })

  test('renders anchor as an a element with href', () => {
    render(
      <Text href='https://example.com' target='_blank' type='anchor'>
        Link
      </Text>,
      { wrapper: Wrapper },
    )
    const el = screen.getByText('Link')
    expect(el.tagName).toBe('A')
    expect(el.getAttribute('href')).toBe('https://example.com')
    expect(el.getAttribute('target')).toBe('_blank')
  })

  test('applies correct scale attribute for headings', () => {
    render(<Text type='h1'>H1</Text>, { wrapper: Wrapper })
    expect(screen.getByText('H1').getAttribute('scale')).toBe('headline')
    expect(screen.getByText('H1').getAttribute('text-size')).toBe('large')
  })

  test('applies correct scale attribute for body', () => {
    render(<Text type='body'>Body</Text>, { wrapper: Wrapper })
    expect(screen.getByText('Body').getAttribute('scale')).toBe('body')
  })

  test('applies correct scale attribute for display', () => {
    render(<Text type='display'>D</Text>, { wrapper: Wrapper })
    expect(screen.getByText('D').getAttribute('scale')).toBe('display')
  })

  test('overrides size via prop', () => {
    render(
      <Text size='large' type='body'>
        Large body
      </Text>,
      { wrapper: Wrapper },
    )
    expect(screen.getByText('Large body').getAttribute('text-size')).toBe('large')
  })

  test('applies is-anchor attribute for anchor type', () => {
    render(
      <Text href='#' type='anchor'>
        Anchor link
      </Text>,
      { wrapper: Wrapper },
    )
    expect(screen.getByText('Anchor link').hasAttribute('is-anchor')).toBe(true)
  })

  test('passes custom className', () => {
    render(
      <Text className='custom' type='body'>
        Custom
      </Text>,
      { wrapper: Wrapper },
    )
    expect(screen.getByText('Custom').className).toContain('custom')
  })

  test('default heading sizes are correct', () => {
    render(
      <>
        <Text type='h2'>H2</Text>
        <Text type='h3'>H3</Text>
        <Text type='h5'>H5</Text>
        <Text type='h6'>H6</Text>
      </>,
      { wrapper: Wrapper },
    )
    expect(screen.getByText('H2').getAttribute('text-size')).toBe('medium')
    expect(screen.getByText('H3').getAttribute('text-size')).toBe('small')
    expect(screen.getByText('H5').getAttribute('text-size')).toBe('medium')
    expect(screen.getByText('H6').getAttribute('text-size')).toBe('small')
  })
})
