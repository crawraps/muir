import type React from 'react'

/** Vertical anchor position. */
export type VerticalAnchor = 'top' | 'bottom'

/** Horizontal anchor position. */
export type HorizontalAnchor = 'left' | 'right'

/** Anchor: combination of edges, or a single dimension for centering. */
export type Anchor = VerticalAnchor | HorizontalAnchor | `${VerticalAnchor}-${HorizontalAnchor}`

/** Resolved position from an anchor array. */
export interface ResolvedPosition {
  vertical: VerticalAnchor | 'center'
  horizontal: HorizontalAnchor | 'center'
}

/** Resolve an array of anchor strings into a vertical/horizontal position. */
export function resolveAnchors(anchors: Anchor[]): ResolvedPosition {
  const vertical: VerticalAnchor[] = []
  const horizontal: HorizontalAnchor[] = []
  for (const anchor of anchors) {
    if (anchor === 'top' || anchor === 'bottom') {
      vertical.push(anchor)
    }
    if (anchor === 'left' || anchor === 'right') {
      horizontal.push(anchor)
    }
    if (anchor.includes('-')) {
      const [v, h] = anchor.split('-') as [VerticalAnchor, HorizontalAnchor]
      vertical.push(v)
      horizontal.push(h)
    }
  }
  return {
    vertical: vertical[0] ?? 'center',
    horizontal: horizontal[0] ?? 'center',
  }
}

/**
 * @docs
 * Properties for the contentWrapper component rendered inside a snackbar.
 */
export interface SnackWrapperProps {
  /** Unique snackbar identifier. */
  id: number
  /** The content to display. */
  content: React.ReactNode
  /** Callback to dismiss the snackbar instantly. */
  onDismiss: () => void
  /** Callback to hide the snackbar with animation. */
  onHide: () => void
  /** Callback to show the snackbar (re-trigger entrance animation). */
  onShow: () => void
}

/**
 * @docs
 * Options for showing a snackbar via snackbar.show().
 */
export interface SnackOptions {
  /** The content to display in the snackbar. */
  content: React.ReactNode

  /**
   * Template name to use. Falls back to "default" if not found.
   * @default 'default'
   */
  template?: string

  /**
   * Duration in milliseconds before the snackbar auto-hides.
   * Set to 0 to disable auto-hide.
   * @default 2000
   */
  duration?: number

  /**
   * Anchor overrides for this specific snackbar call.
   * Overrides the template's anchors.
   * @default ['bottom', 'left', 'right'] (bottom-center)
   */
  anchors?: Anchor[]

  /**
   * Custom surface element rendered as the snackbar background.
   * Defaults to `<Surface />`.
   */
  surface?: React.ReactNode

  /**
   * Custom wrapper component around the snackbar content.
   * Useful for adding icons, dismiss buttons, or layout.
   */
  contentWrapper?: React.ComponentType<SnackWrapperProps>

  /**
   * Inline styles applied to the snackbar element.
   */
  style?: React.CSSProperties
}

/**
 * Template definition for snackbars.
 * Omits the `template` field since the template name is the key.
 */
export type SnackTemplate = Omit<SnackOptions, 'template'>

/** Internal snackbar entry in the active queue. */
export interface SnackEntry extends Required<Omit<SnackOptions, 'surface' | 'contentWrapper' | 'style'>> {
  id: number
  anchors: Anchor[]
  surface?: React.ReactNode
  contentWrapper?: React.ComponentType<SnackWrapperProps>
  style?: React.CSSProperties
  /** Whether the snackbar is currently animating out (being hidden). */
  isHiding: boolean
}

/** Actions available on the snackbar context. */
export interface SnackbarActions {
  show: (options: SnackOptions) => number
  hide: (id?: number) => void
  dismiss: (id?: number) => void
  list: () => SnackEntry[]
}

/**
 * @docs
 * Properties for the SnackbarProvider component.
 */
export interface SnackbarProviderProps {
  /** Child content — snackbars render in this tree. */
  children?: React.ReactNode

  /**
   * Template definitions. Each key is the template name.
   * The "default" template is used when no template is specified.
   * Defaults to a bottom-center template with 2000ms duration.
   */
  templates?: Record<string, SnackTemplate>

  /**
   * Inline styles applied to each anchor group container.
   */
  style?: React.CSSProperties
}
