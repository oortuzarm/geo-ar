import { Navigate, Outlet } from 'react-router-dom'
import { useAuthStore } from '../../store/authStore'
import Spinner from '../ui/Spinner'

/**
 * Wraps routes that require an authenticated session.
 * Must be rendered after App.tsx has called refreshSession().
 * Shows a spinner while the session check is still in flight.
 */
export default function ProtectedRoute() {
  const { isAuthenticated, isLoading, isInitialized } = useAuthStore()

  if (!isInitialized || isLoading) {
    return (
      <div className="h-screen flex items-center justify-center bg-gray-950">
        <Spinner size="lg" />
      </div>
    )
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }

  return <Outlet />
}
