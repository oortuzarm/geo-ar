import type { Capability } from '../types'

export const smartProxies: Capability = {
  id: 'smart-proxies',
  name: 'Smart Proxies',
  tagline: 'Añade tracking geolocalizado a cualquier URL existente.',
  description:
    'Smart Proxies es una feature que convierte cualquier URL existente en un ' +
    'punto de experiencia geolocalizada. Ubyca actúa como proxy inverso: ' +
    'crea una URL pública propia que sirve el contenido del sitio destino ' +
    'mientras registra la ubicación GPS de cada visitante, el tiempo de ' +
    'permanencia, los clics y las conversiones. No requiere modificar el sitio ' +
    'destino. Antes de activar, Ubyca escanea la compatibilidad del sitio destino.',
  keyFeatures: [
    'Proxy inverso sobre cualquier URL: el contenido original no se modifica',
    'Registro de ubicación GPS de cada visitante con su consentimiento',
    'Métricas propias: openings, location granted, clics, dwell completions',
    'Tiempo de permanencia promedio (avgDwellSeconds)',
    'Sesiones únicas y usuarios únicos que interactuaron',
    'Tasa de conversión: visitantes → activaciones',
    'Mapas de intensidad y hotspots de los visitantes',
    'Monitoreo en tiempo real de visitas activas',
    'Escaneo previo de compatibilidad del sitio destino',
    'Dominio personalizado opcional por proxy',
  ],
  whoIsItFor:
    'Organizaciones que tienen sitios o aplicaciones web existentes y quieren ' +
    'añadir tracking de presencia física y analytics geoespaciales sin ' +
    'modificar su código fuente.',
  relatedCapabilities: ['analytics', 'live-visits', 'spatial-intelligence'],
}
