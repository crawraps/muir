import { useLocation } from 'wouter'
import './styles/global.css'

const useRouteParams = () => {
  const [location] = useLocation()
  const segments = location.replace(/^\//, '').split('/').filter(Boolean)
  return segments
}

export const App = () => {
  const { segments } = useRouteParams()

  return <div className={cx('app-layout')}>{children}</div>
}
