import { Link, useRoute } from 'wouter'
import { getDocCategories } from '../../../shared/api/docs'

const categoryIcons: Record<string, React.ReactNode> = {
  components: (
    <svg fill='none' height='24' stroke='currentColor' strokeLinecap='round' strokeLinejoin='round' strokeWidth='2' viewBox='0 0 24 24' width='24'>
      <title>Components</title>
      <polygon points='12 2 2 7 12 12 22 7 12 2' />
      <polyline points='2 17 12 22 22 17' />
      <polyline points='2 12 12 17 22 12' />
    </svg>
  ),
  utilities: (
    <svg fill='none' height='24' stroke='currentColor' strokeLinecap='round' strokeLinejoin='round' strokeWidth='2' viewBox='0 0 24 24' width='24'>
      <title>Utilities</title>
      <path d='M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z' />
    </svg>
  ),
}

const defaultIcon = (
  <svg fill='none' height='24' stroke='currentColor' strokeLinecap='round' strokeLinejoin='round' strokeWidth='2' viewBox='0 0 24 24' width='24'>
    <title>Category</title>
    <circle cx='12' cy='12' r='10' />
  </svg>
)

export const Sidebar = () => {
  const [isHome] = useRoute('/')
  const categories = getDocCategories()

  return (
    <aside className={cx('sidebar')}>
      <div className={cx('sidebar-header')}>
        <div className={cx('logo-icon')}>C</div>
        <h2 className={cx('logo-text')}>Cuil UI</h2>
      </div>
      <nav className={cx('sidebar-nav')}>
        <Link className={cx(['nav-link', { active: isHome }])} href='/'>
          <span className={cx('icon')}>
            <svg fill='none' height='24' stroke='currentColor' strokeLinecap='round' strokeLinejoin='round' strokeWidth='2' viewBox='0 0 24 24' width='24'>
              <title>Home</title>
              <path d='M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z' />
              <polyline points='9 22 9 12 15 12 15 22' />
            </svg>
          </span>
          <span className={cx('text')}>Home</span>
        </Link>
        {categories.map(category => (
          <CategoryLink category={category} key={category} />
        ))}
      </nav>
    </aside>
  )
}

const CategoryLink = ({ category }: { category: string }) => {
  const [isActive] = useRoute(`/${category}/*?`)
  const label = category.charAt(0).toUpperCase() + category.slice(1)

  return (
    <Link className={cx(['nav-link', { active: isActive }])} href={`/${category}`}>
      <span className={cx('icon')}>{categoryIcons[category] || defaultIcon}</span>
      <span className={cx('text')}>{label}</span>
    </Link>
  )
}
