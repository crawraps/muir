import { useLocation } from 'wouter'

export function useSegments() {
  const [location] = useLocation()
  return location.replace(/^\//, '').split('/').filter(Boolean)
}
