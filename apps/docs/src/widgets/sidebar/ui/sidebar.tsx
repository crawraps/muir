import { atr } from '@muir/base'
import { Pane } from 'src/entities/pane'
import { DocsList } from 'src/features/docs-list'
import type { Props } from '../model/types'

export function Sidebar({ className, hidden, ...props }: Props) {
  return (
    <Pane className={cx('sidebar', className)} is-hidden={atr(hidden)} {...props}>
      <DocsList />
    </Pane>
  )
}
