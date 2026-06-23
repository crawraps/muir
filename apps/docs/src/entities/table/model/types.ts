import type React from 'react'

type TableProps = React.HTMLAttributes<HTMLTableElement> & { ref?: React.Ref<HTMLTableElement> }
type TableSectionPropsBase = React.HTMLAttributes<HTMLTableSectionElement> & { ref?: React.Ref<HTMLTableSectionElement> }
type TableRowPropsBase = React.HTMLAttributes<HTMLTableRowElement> & { ref?: React.Ref<HTMLTableRowElement> }
type TableCellPropsBase = React.HTMLAttributes<HTMLTableCellElement> & { ref?: React.Ref<HTMLTableCellElement> }

/**
 * @docs
 * Properties for the Table root.
 */
export interface TableRootProps extends Omit<TableProps, 'children'> {
  children?: React.ReactNode
}

export interface TableSectionProps extends Omit<TableSectionPropsBase, 'children' | 'role'> {
  children?: React.ReactNode
}

export interface TableRowProps extends Omit<TableRowPropsBase, 'children' | 'role'> {
  children?: React.ReactNode
}

/** Shared shape for `TableCell` and `TableHeaderCell`. */
export interface TableCellProps extends Omit<TableCellPropsBase, 'children' | 'role'> {
  children?: React.ReactNode
}
