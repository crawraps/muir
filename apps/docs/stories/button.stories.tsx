import type { Meta, StoryObj } from '@storybook/react'
import { ThemeProvider } from '../lib/app/theme-provider/model/ThemeProvider'
import { Button } from '../lib/components/button'

const meta: Meta<typeof Button> = {
  title: 'Components/Button',
  component: Button,
  tags: ['autodocs'],
  decorators: [
    Story => (
      <ThemeProvider>
        <div style={{ padding: '2rem' }}>
          <Story />
        </div>
      </ThemeProvider>
    ),
  ],
  argTypes: {
    variant: {
      control: { type: 'select' },
      options: ['elevated', 'filled', 'outlined', 'text', 'filled-tonal'],
    },
    disabled: { control: 'boolean' },
    readOnly: { control: 'boolean' },
  },
}

export default meta
type Story = StoryObj<typeof Button>

export const Default: Story = {
  args: {
    children: 'Button',
    variant: 'filled',
  },
}

export const Elevated: Story = {
  args: {
    children: 'Elevated Button',
    variant: 'elevated',
  },
}

export const Outlined: Story = {
  args: {
    children: 'Outlined Button',
    variant: 'outlined',
  },
}

export const Text: Story = {
  args: {
    children: 'Text Button',
    variant: 'text',
  },
}

export const FilledTonal: Story = {
  args: {
    children: 'Filled Tonal Button',
    variant: 'filled-tonal',
  },
}

export const AsLink: Story = {
  args: {
    children: 'Link Button',
    href: 'https://example.com',
    target: '_blank',
    variant: 'text',
  },
}

export const WithIcon: Story = {
  args: {
    children: (
      <>
        <span>★</span>
        <span>Button with Icon</span>
      </>
    ),
    variant: 'filled',
  },
}

export const Disabled: Story = {
  args: {
    children: 'Disabled Button',
    disabled: true,
  },
}

export const ReadOnly: Story = {
  args: {
    children: 'Read Only Button',
    readOnly: true,
  },
}

export const Accessibility: Story = {
  args: {
    children: 'Accessible Button',
    'aria-label': 'This is an accessible button',
  },
}
