import { useEffect } from 'react'
import { RouterProvider } from 'react-router-dom'
import { landingRouter, appRouter, devRouter, smartLinkRouter } from './router'
import { useAuthStore } from './store/authStore'
import { useSettingsStore } from './store/settingsStore'
import Spinner from './components/ui/Spinner'
import OnboardingFlow from './pages/Onboarding/OnboardingFlow'

const LANDING_HOSTS    = new Set(['ubyca.com', 'www.ubyca.com'])
const APP_HOSTS        = new Set(['studio.ubyca.com'])
const SMART_LINK_HOSTS = new Set(['go.ubyca.com'])

function pickRouter() {
  const { hostname } = window.location
  if (LANDING_HOSTS.has(hostname))    return landingRouter
  if (APP_HOSTS.has(hostname))        return appRouter
  if (SMART_LINK_HOSTS.has(hostname)) return smartLinkRouter
  return devRouter
}

const isLandingHost    = LANDING_HOSTS.has(window.location.hostname)
const isSmartLinkHost  = SMART_LINK_HOSTS.has(window.location.hostname)

export default function App() {
  const { refreshSession, isLoading, isInitialized, currentUser } = useAuthStore()
  const fetchPublicSettings = useSettingsStore((s) => s.fetchPublicSettings)

  useEffect(() => {
    // Fetch public settings on every domain — /community is available everywhere
    fetchPublicSettings()
    // go.ubyca.com and ubyca.com are fully public — no session needed.
    if (!isLandingHost && !isSmartLinkHost) refreshSession()
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  // Landing domains: render immediately with no auth overhead.
  if (isLandingHost) {
    return <RouterProvider router={landingRouter} />
  }

  // go.ubyca.com: public Smart Link resolver — no auth, render immediately.
  if (isSmartLinkHost) {
    return <RouterProvider router={smartLinkRouter} />
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

  const showOnboarding =
    currentUser !== null &&
    currentUser.onboardingCompleted === false

  return (
    <>
      <RouterProvider router={pickRouter()} />
      {showOnboarding && <OnboardingFlow />}
    </>
  )
}
