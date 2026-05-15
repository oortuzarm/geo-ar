import { Outlet, ScrollRestoration } from 'react-router-dom'
import ScrollToTop from './ScrollToTop'

export default function RootLayout() {
  return (
    <>
      <ScrollToTop />
      <ScrollRestoration />
      <Outlet />
    </>
  )
}
