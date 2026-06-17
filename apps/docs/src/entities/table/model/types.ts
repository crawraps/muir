import type React from 'react'

type DivProps = React.HTMLAttributes<HTMLDivElement> & { ref?: React.Ref<HTMLDivElement> }

/**
 * @docs
 * Properties for the Table root.
 *
 * Implemented as a `<div role="table">` with `display: block` so that
 * downstream styles can freely apply scroll, sticky headers, or card
 * stacks without fighting the browser's default `table` display value.
 */
export interface TableRootProps extends Omit<DivProps, 'children'> {
  children?: React.ReactNode
}

export interface TableSectionProps extends Omit<DivProps, 'children' | 'role'> {
  children?: React.ReactNode
}

export interface TableRowProps extends Omit<DivProps, 'children' | 'role'> {
  children?: React.ReactNode
}

/** Shared shape for `TableCell` and `TableHeaderCell`. */
export interface TableCellProps extends Omit<DivProps, 'children' | 'role'> {
  children?: React.ReactNode
}
