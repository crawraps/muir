import type { Meta, StoryObj } from '@storybook/react'
import { ThemeProvider } from '../lib/app/theme-provider/model/ThemeProvider'
import { Icon } from '../lib/components/icon'

const EXAMPLE_ICONS = ['home', 'search', 'settings', 'favorite', 'arrow-forward', 'close', 'check', 'add', 'delete', 'info']

const meta: Meta<typeof Icon> = {
  title: 'Components/Icon',
  component: Icon,
  tags: ['autodocs'],
  decorators: [
    Story => {
      // Inject inline SVG sprite for Storybook
      const spriteHtml = `
        <svg xmlns="http://www.w3.org/2000/svg">
          <defs>
            <symbol id="home" viewBox="0 0 24 24"><path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/></symbol>
            <symbol id="search" viewBox="0 0 24 24"><path d="M15.5 14h-.79l-.28-.27A6.47 6.47 0 0 0 16 9.5 6.5 6.5 0 1 0 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/></symbol>
            <symbol id="settings" viewBox="0 0 24 24"><path d="M19.14 12.94c.04-.3.06-.61.06-.94 0-.32-.02-.64-.07-.94l2.03-1.58a.49.49 0 0 0 .12-.61l-1.92-3.32a.49.49 0 0 0-.59-.22l-2.39.96c-.5-.38-1.03-.7-1.62-.94l-.36-2.54a.484.484 0 0 0-.48-.41h-3.84c-.24 0-.43.17-.47.41l-.36 2.54c-.59.24-1.13.57-1.62.94l-2.39-.96a.49.49 0 0 0-.59.22L2.74 8.87c-.12.21-.08.47.12.61l2.03 1.58c-.05.3-.07.62-.07.94s.02.64.07.94l-2.03 1.58a.49.49 0 0 0-.12.61l1.92 3.32c.12.22.37.29.59.22l2.39-.96c.5.38 1.03.7 1.62.94l.36 2.54c.05.24.24.41.48.41h3.84c.24 0 .44-.17.47-.41l.36-2.54c.59-.24 1.13-.56 1.62-.94l2.39.96c.22.08.47 0 .59-.22l1.92-3.32c.12-.22.07-.47-.12-.61l-2.01-1.58zM12 15.6A3.6 3.6 0 1 1 12 8.4a3.6 3.6 0 0 1 0 7.2z"/></symbol>
            <symbol id="favorite" viewBox="0 0 24 24"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></symbol>
            <symbol id="arrow-forward" viewBox="0 0 24 24"><path d="M12 4l-1.41 1.41L16.17 11H4v2h12.17l-5.58 5.59L12 20l8-8z"/></symbol>
            <symbol id="close" viewBox="0 0 24 24"><path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/></symbol>
            <symbol id="check" viewBox="0 0 24 24"><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/></symbol>
            <symbol id="add" viewBox="0 0 24 24"><path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6z"/></symbol>
            <symbol id="delete" viewBox="0 0 24 24"><path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"/></symbol>
            <symbol id="info" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z"/></symbol>
          </defs>
        </svg>
      `
      return (
        <ThemeProvider>
          <div style={{ padding: '2rem' }}>
            {/* biome-ignore lint/security/noDangerouslySetInnerHtml: SVG sprite injection for Storybook */}
            <div aria-hidden='true' dangerouslySetInnerHTML={{ __html: spriteHtml }} hidden />
            <Story />
          </div>
        </ThemeProvider>
      )
    },
  ],
  argTypes: {
    name: {
      control: { type: 'select' },
      options: EXAMPLE_ICONS,
    },
    size: {
      control: { type: 'number', min: 12, max: 96, step: 4 },
    },
  },
}

export default meta
type Story = StoryObj<typeof Icon>

export const Default: Story = {
  args: {
    name: 'home',
    size: 24,
  },
}

export const AllIcons: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', alignItems: 'center' }}>
      {EXAMPLE_ICONS.map(name => (
        <div key={name} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
          <Icon name={name} size={24} />
          <span style={{ fontSize: '12px', color: 'var(--md-sys-color-on-surface-variant)' }}>{name}</span>
        </div>
      ))}
    </div>
  ),
}

export const Sizes: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
      <Icon name='home' size={16} />
      <Icon name='home' size={24} />
      <Icon name='home' size={32} />
      <Icon name='home' size={48} />
    </div>
  ),
}

export const CustomColor: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
      <span style={{ color: 'var(--md-sys-color-primary)' }}>
        <Icon name='favorite' size={24} />
      </span>
      <span style={{ color: 'var(--md-sys-color-error)' }}>
        <Icon name='favorite' size={24} />
      </span>
      <span style={{ color: 'var(--md-sys-color-tertiary)' }}>
        <Icon name='favorite' size={24} />
      </span>
    </div>
  ),
}

export const Accessibility: Story = {
  args: {
    name: 'info',
    size: 24,
    'aria-label': 'Information icon',
    'aria-hidden': undefined,
  },
}
