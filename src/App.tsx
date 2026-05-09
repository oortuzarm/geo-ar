import { RouterProvider } from 'react-router-dom'
import { landingRouter, appRouter, devRouter } from './router'

const LANDING_HOSTS = new Set(['ubyca.com', 'www.ubyca.com'])
const APP_HOSTS     = new Set(['studio.ubyca.com'])

function pickRouter() {
  const { hostname } = window.location
  if (LANDING_HOSTS.has(hostname)) return landingRouter
  if (APP_HOSTS.has(hostname))     return appRouter
  return devRouter // localhost and any other host
}

export default function App() {
  return <RouterProvider router={pickRouter()} />
}
