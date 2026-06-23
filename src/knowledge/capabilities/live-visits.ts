import type { Capability } from '../types'

export const liveVisits: Capability = {
  id: 'live-visits',
  name: 'Visitas en vivo',
  tagline: 'Monitoreo de presencia activa en tiempo real.',
  description:
    'Visitas en vivo es la vista de monitoreo en tiempo real de Ubyca. ' +
    'Muestra cuántos usuarios están activos en el conjunto de ubicaciones ' +
    'ahora mismo, cuál es la zona más activa, cuántas activaciones ocurrieron ' +
    'hoy y el ranking de zonas por tráfico. ' +
    'Está disponible tanto para proyectos basados en GeoPoints como ' +
    'para Smart Proxies. Los datos se actualizan sin necesidad de recargar la página.',
  keyFeatures: [
    'Visitantes activos en este momento (conteo en tiempo real)',
    'Zona más activa del proyecto con recuento de presencias',
    'Activaciones del día y delta respecto al día anterior',
    'Ranking de zonas por tráfico activo',
    'Intensidad GPS de las señales activas',
    'Disponible para proyectos con GeoPoints y para Smart Proxies',
    'Vista consolidada de todos los proxies activos simultáneamente',
  ],
  whoIsItFor:
    'Equipos que operan eventos, instalaciones o campañas activas y necesitan ' +
    'visibilidad en tiempo real de lo que está ocurriendo en cada zona.',
  relatedCapabilities: ['analytics', 'smart-proxies', 'spatial-intelligence'],
}
