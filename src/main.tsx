import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import 'leaflet/dist/leaflet.css'
import './index.css'
import App from './App'
import TawkProvider from './components/providers/TawkProvider'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <TawkProvider />
    <App />
  </StrictMode>,
)
