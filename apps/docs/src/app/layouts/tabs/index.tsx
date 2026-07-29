import { Navbar } from 'src/widgets/navbar'
import type { Props } from './properties'

export function NavbarLayout({ ...props }: Props) {
  return (
    <div className={cx('navbar-layout')}>
      <Navbar
        items={[
          {
            name: 'Landing',
            link: '/landing',
            match: /\/tabs\/landing/,
          },
          {
            name: 'Docs',
            link: '/docs',
            match: /\/tabs\/docs/,
          },
          {
            name: 'More',
            link: '/more',
            match: /\/tabs\/more/,
          },
        ]}
      />
      {props.children}
    </div>
  )
}
