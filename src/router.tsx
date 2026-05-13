import { createBrowserRouter, Navigate } from 'react-router-dom'
import LandingPage     from './pages/Landing/LandingPage'
import LandingV2Page  from './pages/Landing/LandingV2Page'
import AppShell        from './pages/Home/AppShell'
import HomePage        from './pages/Home/HomePage'
import MetricsPage     from './pages/Metrics/MetricsPage'
import DashboardPage   from './pages/Dashboard/DashboardPage'
import PreviewPage     from './pages/Preview/PreviewPage'
import PublicPage      from './pages/Public/PublicPage'
import LoginPage       from './pages/Auth/LoginPage'
import RegisterPage    from './pages/Auth/RegisterPage'
import AdminPage       from './pages/Admin/AdminPage'
import ProtectedRoute  from './components/auth/ProtectedRoute'
import AdminRoute      from './components/auth/AdminRoute'

// ── Auth pages (public — redirect to /app if already logged in) ───────────────

const authRoutes = [
  { path: '/login',    element: <LoginPage /> },
  { path: '/register', element: <RegisterPage /> },
]

// ── Fully public routes (no auth required ever) ───────────────────────────────

const publicRoutes = [
  { path: '/public/:id', element: <PublicPage /> },
]

// ── Protected app routes (require authenticated session) ──────────────────────

const protectedChildren = [
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
  // ── Admin (require role === 'admin', nested under ProtectedRoute) ─────────
  {
    element: <AdminRoute />,
    children: [
      { path: '/admin', element: <AdminPage /> },
    ],
  },
]

// ── Landing-only router (ubyca.com, www.ubyca.com) ───────────────────────────
// No auth, no app routes — landing page catches everything.

export const landingRouter = createBrowserRouter([
  { path: '/landing-v2', element: <LandingV2Page /> },
  { path: '*', element: <LandingPage /> },
])

// ── App-only router (studio.ubyca.com) ───────────────────────────────────────
// Root → /app if authenticated, /login if not (handled by ProtectedRoute).

export const appRouter = createBrowserRouter([
  { path: '/', element: <Navigate to="/app" replace /> },
  ...authRoutes,
  ...publicRoutes,
  {
    element: <ProtectedRoute />,
    children: protectedChildren,
  },
])

// ── Dev router (localhost + unknown hosts) ────────────────────────────────────
// Full experience: landing at / plus all app + auth routes.

export const devRouter = createBrowserRouter([
  { path: '/', element: <LandingPage /> },
  { path: '/landing-v2', element: <LandingV2Page /> },
  ...authRoutes,
  ...publicRoutes,
  {
    element: <ProtectedRoute />,
    children: protectedChildren,
  },
])
