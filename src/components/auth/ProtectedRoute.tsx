import { Navigate, Outlet } from 'react-router-dom'
import { useAuthStore } from '../../store/authStore'
import Spinner from '../ui/Spinner'
export default function ProtectedRoute() {
  const { isAuthenticated, isLoading, isInitialized } = useAuthStore()

  console.info(
    '[ProtectedRoute] render — isAuthenticated:', isAuthenticated,
    '| isLoading:', isLoading,
    '| isInitialized:', isInitialized,
  )

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
