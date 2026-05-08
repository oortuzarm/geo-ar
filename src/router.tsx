import { createBrowserRouter } from 'react-router-dom'
import AppShell from './pages/Home/AppShell'
import HomePage from './pages/Home/HomePage'
import MetricsPage from './pages/Metrics/MetricsPage'
import DashboardPage from './pages/Dashboard/DashboardPage'
import PreviewPage from './pages/Preview/PreviewPage'
import PublicPage from './pages/Public/PublicPage'

export const router = createBrowserRouter([
  {
    element: <AppShell />,
    children: [
      { index: true,      element: <HomePage /> },
      { path: 'metrics',  element: <MetricsPage /> },
    ],
  },
  {
    path: '/project/new',
    element: <DashboardPage />,
  },
  {
    path: '/project/:id',
    element: <DashboardPage />,
  },
  {
    path: '/project/:id/preview',
    element: <PreviewPage />,
  },
  {
    path: '/public/:id',
    element: <PublicPage />,
  },
])
