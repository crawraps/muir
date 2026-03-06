import type { Snackbar } from './queue'

export type Presets = { default: Required<Snackbar>; [key: string]: Partial<Snackbar> }

export const presets: Presets = {
  default: {
    message: 'Snackbar message',
    duration: 3000,
    anchors: {
      vertical: 'bottom',
      horizontal: 'center',
    },
    prefix: createElement(Fragment),
    suffix: createElement(Fragment),
  },
}

export const allAnchors: Snackbar['anchors'][] = [
  {
    vertical: 'top',
    horizontal: 'left',
  },
  {
    vertical: 'top',
    horizontal: 'center',
  },
  {
    vertical: 'top',
    horizontal: 'right',
  },
  {
    vertical: 'bottom',
    horizontal: 'left',
  },
  {
    vertical: 'bottom',
    horizontal: 'center',
  },
  {
    vertical: 'bottom',
    horizontal: 'right',
  },
]
