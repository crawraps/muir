import React from 'react'
import type { TableRootProps } from './model/types'
import { TableBody, TableCell, TableHead, TableHeaderCell, TableRoot, TableRow } from './ui/table'

/**
 * The single `Table` component the MDX renderer uses.
 *
 * It receives the standard MDX table tree (a root `<table>` containing
 * `<thead>` and `<tbody>`, each containing `<tr>`/`<th>`/`<td>`) and
 * re-emits it as a flat stack of ARIA-roled <div>s with `display: block`
 * on the wrappers. Accessibility semantics are preserved through the
 * `role` attributes on each wrapper.
 */
export function Table({ children, className, ref, ...props }: TableRootProps) {
  return (
    <TableRoot className={className} ref={ref} {...props}>
      {rebuildTree(children)}
    </TableRoot>
  )
}

/**
 * Walks the MDX children tree once, swapping each semantic element
 * (table/thead/tbody/tr/th/td) for its div-based counterpart.
 *
 * Pass-through children that are not table elements are kept as-is.
 */
function rebuildTree(children: React.ReactNode): React.ReactNode {
  return React.Children.map(children, node => {
    if (!React.isValidElement(node)) return node

    const type = (node.type as string | React.ComponentType<unknown>) || ''
    const elementChildren = (node.props as { children?: React.ReactNode }).children

    if (type === 'thead') return <TableHead>{rebuildTree(elementChildren)}</TableHead>
    if (type === 'tbody') return <TableBody>{rebuildTree(elementChildren)}</TableBody>
    if (type === 'tr') return <TableRow>{rebuildTree(elementChildren)}</TableRow>
    if (type === 'th') return <TableHeaderCell>{rebuildTree(elementChildren)}</TableHeaderCell>
    if (type === 'td') return <TableCell>{rebuildTree(elementChildren)}</TableCell>

    return node
  })
}
