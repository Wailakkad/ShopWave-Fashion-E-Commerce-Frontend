import { Navigate, useLocation } from 'react-router-dom'
import { useSelector } from 'react-redux'

export default function ProtectedRoute({ children }) {
  const { user, initialLoading } = useSelector(state => state.auth)
  const location = useLocation()

  if (initialLoading) return null

  if (!user) {
    return <Navigate to={`/login?redirect=${location.pathname.slice(1)}`} replace />
  }

  return children
}
