import type React from 'react'

/**
 * @docs
 * Properties for the BottomSheet component.
 */
export interface BottomSheetProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'children'> {
  /**
   * Ref to the underlying HTML element.
   */
  ref?: React.Ref<HTMLDivElement>

  /**
   * Whether the bottom sheet is currently open.
   * @default false
   */
  isOpen?: boolean

  /**
   * Called when the open state changes.
   */
  onOpenChange?: (open: boolean) => void

  /**
   * The content of the bottom sheet.
   */
  children?: React.ReactNode

  /**
   * Optional title for the bottom sheet.
   */
  title?: string

  /**
   * If true, clicking the backdrop will close the sheet.
   * @default true
   */
  closeOnBackdropClick?: boolean

  /**
   * Custom animation duration override.
   */
  duration?: number | string
}
