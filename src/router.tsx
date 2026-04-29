import { createBrowserRouter } from 'react-router-dom'
import HomePage from './pages/Home/HomePage'
import DashboardPage from './pages/Dashboard/DashboardPage'
import PreviewPage from './pages/Preview/PreviewPage'
import PublicPage from './pages/Public/PublicPage'

export const router = createBrowserRouter([
  {
    path: '/',
    element: <HomePage />,
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
