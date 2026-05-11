import { useEffect } from 'react'
import { RouterProvider } from 'react-router-dom'
import { landingRouter, appRouter, devRouter } from './router'
import { useAuthStore } from './store/authStore'
import Spinner from './components/ui/Spinner'

const LANDING_HOSTS = new Set(['ubyca.com', 'www.ubyca.com'])
const APP_HOSTS     = new Set(['studio.ubyca.com'])

function pickRouter() {
  const { hostname } = window.location
  if (LANDING_HOSTS.has(hostname)) return landingRouter
  if (APP_HOSTS.has(hostname))     return appRouter
  return devRouter
}

const isLandingHost = LANDING_HOSTS.has(window.location.hostname)

export default function App() {
  const { refreshSession, isLoading, isInitialized } = useAuthStore()

  // On landing domains auth is never needed — skip the session check entirely.
  useEffect(() => {
    if (!isLandingHost) refreshSession()
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  // Landing domains: render immediately with no auth overhead.
  if (isLandingHost) {
    return <RouterProvider router={landingRouter} />
  }

  // App / dev domains: show a brief spinner while the session cookie is verified.
  // This prevents protected routes from flash-redirecting to /login before the
  // check completes, and prevents /public/:id from doing so too.
  if (!isInitialized || isLoading) {
    return (
      <div className="h-screen flex items-center justify-center bg-gray-950">
        <Spinner size="lg" />
      </div>
    )
  }

  return <RouterProvider router={pickRouter()} />
}
