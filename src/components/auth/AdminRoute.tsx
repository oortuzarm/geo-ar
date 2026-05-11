import { Navigate, Outlet } from 'react-router-dom'
import { useAuthStore } from '../../store/authStore'

/**
 * Must be nested inside ProtectedRoute (auth already verified).
 * Allows access only to users with role === 'admin'.
 * Any other authenticated user is redirected to /app.
 */
export default function AdminRoute() {
  const { currentUser } = useAuthStore()

  if (currentUser?.role !== 'admin') {
    return <Navigate to="/app" replace />
  }

  return <Outlet />
}
