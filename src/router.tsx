import { createBrowserRouter, Navigate } from 'react-router-dom'
import LandingPage from './pages/Landing/LandingPage'
import AppShell from './pages/Home/AppShell'
import HomePage from './pages/Home/HomePage'
import MetricsPage from './pages/Metrics/MetricsPage'
import DashboardPage from './pages/Dashboard/DashboardPage'
import PreviewPage from './pages/Preview/PreviewPage'
import PublicPage from './pages/Public/PublicPage'

// ── Shared app routes (used in both appRouter and devRouter) ──────────────────

const appRoutes = [
  {
    path: '/app',
    element: <AppShell />,
    children: [
      { index: true,     element: <HomePage /> },
      { path: 'metrics', element: <MetricsPage /> },
    ],
  },
  { path: '/project/new',         element: <DashboardPage /> },
  { path: '/project/:id',         element: <DashboardPage /> },
  { path: '/project/:id/preview', element: <PreviewPage /> },
  { path: '/public/:id',          element: <PublicPage /> },
]

// ── Landing-only router (ubyca.com, www.ubyca.com) ───────────────────────────

export const landingRouter = createBrowserRouter([
  { path: '*', element: <LandingPage /> },
])

// ── App-only router (studio.ubyca.com) ───────────────────────────────────────
// Root redirects straight to /app — no landing page on this domain.

export const appRouter = createBrowserRouter([
  { path: '/', element: <Navigate to="/app" replace /> },
  ...appRoutes,
])

// ── Dev router (localhost + unknown hosts) ────────────────────────────────────
// Full experience: landing at / plus all app routes, mirrors pre-split behavior.

export const devRouter = createBrowserRouter([
  { path: '/', element: <LandingPage /> },
  ...appRoutes,
])
