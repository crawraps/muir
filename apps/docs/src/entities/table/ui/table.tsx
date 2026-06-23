import { Surface } from '@muir/capacitor'
import type { TableCellProps, TableRootProps, TableRowProps, TableSectionProps } from '../model/types'
import styling from './style.module.css'

function TableRoot({ className, ref, ...props }: TableRootProps) {
  return (
    <Surface className={cx('surface')}>
      <table className={cx('root', styling.root, className)} ref={ref} {...props} />
    </Surface>
  )
}

function TableHead({ className, ref, ...props }: TableSectionProps) {
  return <thead className={cx('head', styling.head, className)} ref={ref} {...props} />
}

function TableBody({ className, ref, ...props }: TableSectionProps) {
  return <tbody className={cx('body', styling.body, className)} ref={ref} {...props} />
}

function TableRow({ className, ref, ...props }: TableRowProps) {
  return <tr className={cx('row', styling.row, className)} ref={ref} {...props} />
}

function TableHeaderCell({ className, ref, ...props }: TableCellProps) {
  return <th className={cx('cell', styling.cell, className)} ref={ref} {...props} />
}

function TableCell({ className, ref, ...props }: TableCellProps) {
  return <td className={cx('cell', styling.cell, className)} ref={ref} {...props} />
}

export { TableBody, TableCell, TableHead, TableHeaderCell, TableRoot, TableRow }
export type { TableRootProps }
