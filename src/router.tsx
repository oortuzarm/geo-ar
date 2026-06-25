import { createBrowserRouter, Navigate } from 'react-router-dom'
import LandingPage              from './pages/Landing/LandingPage'
import LandingV2Page            from './pages/Landing/LandingV2Page'
import ContactPage              from './pages/Contact/ContactPage'
import AppShell                 from './pages/Home/AppShell'
import WorkspacePage            from './pages/Home/WorkspacePage'
import LiveVisitsPage           from './pages/LiveVisits/LiveVisitsPage'
import HomePage                 from './pages/Home/HomePage'
import SettingsPage             from './pages/Settings/SettingsPage'
import MetricsPage              from './pages/Metrics/MetricsPage'
import MembersPage              from './pages/Members/MembersPage'
import DashboardPage            from './pages/Dashboard/DashboardPage'
import PreviewPage              from './pages/Preview/PreviewPage'
import PublicPage               from './pages/Public/PublicPage'
import EmbedPage               from './pages/Embed/EmbedPage'
import LoginPage                from './pages/Auth/LoginPage'
import RegisterPage             from './pages/Auth/RegisterPage'
import ForgotPasswordPage       from './pages/Auth/ForgotPasswordPage'
import ResetPasswordPage        from './pages/Auth/ResetPasswordPage'
import AcceptInvitationPage     from './pages/Auth/AcceptInvitationPage'
import AdminPage                from './pages/Admin/AdminPage'
import AdminPlansPage          from './pages/Admin/AdminPlansPage'
import AdminOnboardingPage     from './pages/Admin/AdminOnboardingPage'
import PlansPage               from './pages/Plans/PlansPage'
import IntegrationsPage        from './pages/Integrations/IntegrationsPage'
import SmartProxiesPage        from './pages/SmartProxies/SmartProxiesPage'
import SmartProxyFormPage      from './pages/SmartProxies/SmartProxyFormPage'
import SmartProxyDetailPage    from './pages/SmartProxies/SmartProxyDetailPage'
import DevelopersPage          from './pages/Developers/DevelopersPage'
import AccountPage              from './pages/Account/AccountPage'
import PrivacyPolicyPage        from './pages/Legal/PrivacyPolicyPage'
import TermsAndConditionsPage   from './pages/Legal/TermsAndConditionsPage'
import PricingPage              from './pages/Landing/PricingPage'
import StudioPage               from './pages/Landing/StudioPage'
import LandingDevelopersPage    from './pages/Landing/LandingDevelopersPage'
import CommunityPage            from './pages/Community/CommunityPage'
import SolutionsIndexPage       from './pages/Solutions/SolutionsIndexPage'
import IndustryPage             from './pages/Solutions/IndustryPage'
import ProtectedRoute           from './components/auth/ProtectedRoute'
import AdminRoute               from './components/auth/AdminRoute'
import RootLayout               from './components/routing/RootLayout'

// ── Auth pages (public — redirect to /app if already logged in) ───────────────

const authRoutes = [
  { path: '/login',                 element: <LoginPage /> },
  { path: '/register',              element: <RegisterPage /> },
  { path: '/forgot-password',       element: <ForgotPasswordPage /> },
  { path: '/reset-password/:token', element: <ResetPasswordPage /> },
]

// ── Legal pages (fully public, served on all domains) ────────────────────────

const legalRoutes = [
  { path: '/privacy_policy',        element: <PrivacyPolicyPage /> },
  { path: '/terms_and_conditions',  element: <TermsAndConditionsPage /> },
]

// ── Fully public routes (no auth required ever) ───────────────────────────────

const publicRoutes = [
  { path: '/public/:id',                 element: <PublicPage /> },
  { path: '/embed/:id',                  element: <EmbedPage /> },
  { path: '/accept-invitation/:token',   element: <AcceptInvitationPage /> },
  { path: '/community',                  element: <CommunityPage /> },
]

// ── Protected app routes (require authenticated session) ──────────────────────

const protectedChildren = [
  {
    path: '/app',
    element: <AppShell />,
    children: [
      { index: true,        element: <WorkspacePage /> },
      { path: 'live-visits', element: <LiveVisitsPage /> },
      { path: 'metrics',    element: <MetricsPage /> },
      { path: 'members',    element: <MembersPage /> },
      { path: 'account',    element: <AccountPage /> },
      { path: 'settings',   element: <SettingsPage /> },
      { path: 'plans',         element: <PlansPage /> },
      { path: 'integrations',  element: <IntegrationsPage /> },
      { path: 'developers/*',   element: <DevelopersPage /> },
      { path: 'smart-proxies',           element: <SmartProxiesPage /> },
      { path: 'smart-proxies/new',       element: <SmartProxyFormPage /> },
      { path: 'smart-proxies/:id',       element: <SmartProxyDetailPage /> },
      { path: 'smart-proxies/:id/edit',  element: <SmartProxyFormPage /> },
      // Legacy multi-project view — kept accessible but not linked from the sidebar
      { path: 'projects',   element: <HomePage /> },
    ],
  },
  { path: '/project/new',         element: <DashboardPage /> },
  { path: '/project/:id',         element: <DashboardPage /> },
  { path: '/project/:id/preview', element: <PreviewPage /> },
  // ── Admin (require role === 'admin', nested under ProtectedRoute) ─────────
  {
    element: <AdminRoute />,
    children: [
      { path: '/admin',            element: <AdminPage /> },
      { path: '/admin/plans',      element: <AdminPlansPage /> },
      { path: '/admin/onboarding', element: <AdminOnboardingPage /> },
    ],
  },
]

// LandingV2Page is now the official home. LandingPage kept at /landing-old.

export const landingRouter = createBrowserRouter([
  {
    element: <RootLayout />,
    children: [
      { path: '/contact',              element: <ContactPage /> },
      { path: '/precios',              element: <PricingPage /> },
      { path: '/studio',               element: <StudioPage /> },
      { path: '/community',            element: <CommunityPage /> },
      { path: '/docs/*',               element: <LandingDevelopersPage /> },
      { path: '/developers',           element: <Navigate to="/docs" replace /> },
      { path: '/solutions',            element: <SolutionsIndexPage /> },
      { path: '/solutions/:slug',      element: <IndustryPage /> },
      { path: '/landing-v2',           element: <LandingV2Page /> },
      { path: '/landing-old',          element: <LandingPage /> },
      ...legalRoutes,
      { path: '*',                     element: <LandingV2Page /> },
    ],
  },
])

// ── App-only router (studio.ubyca.com) ───────────────────────────────────────
// Root → /app if authenticated, /login if not (handled by ProtectedRoute).

export const appRouter = createBrowserRouter([
  {
    element: <RootLayout />,
    children: [
      { path: '/', element: <Navigate to="/app" replace /> },
      ...authRoutes,
      ...publicRoutes,
      ...legalRoutes,
      {
        element: <ProtectedRoute />,
        children: protectedChildren,
      },
    ],
  },
])

// ── Dev router (localhost + unknown hosts) ────────────────────────────────────
// Full experience: landing at / plus all app + auth routes.

export const devRouter = createBrowserRouter([
  {
    element: <RootLayout />,
    children: [
      { path: '/',                     element: <LandingV2Page /> },
      { path: '/contact',              element: <ContactPage /> },
      { path: '/precios',              element: <PricingPage /> },
      { path: '/studio',               element: <StudioPage /> },
      { path: '/docs/*',               element: <LandingDevelopersPage /> },
      { path: '/developers',           element: <Navigate to="/docs" replace /> },
      { path: '/solutions',            element: <SolutionsIndexPage /> },
      { path: '/solutions/:slug',      element: <IndustryPage /> },
      { path: '/landing-v2',           element: <LandingV2Page /> },
      { path: '/landing-old',          element: <LandingPage /> },
      ...authRoutes,
      ...publicRoutes,
      ...legalRoutes,
      {
        element: <ProtectedRoute />,
        children: protectedChildren,
      },
    ],
  },
])
