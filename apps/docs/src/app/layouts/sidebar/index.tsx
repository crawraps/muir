import { Sidebar } from 'src/widgets/sidebar'
import type { Props } from './properties'

export function SidebarLayout({ ...props }: Props) {
  return (
    <div className={cx('sidebar-layout')}>
      <Sidebar />
      {props.children}
    </div>
  )
}
