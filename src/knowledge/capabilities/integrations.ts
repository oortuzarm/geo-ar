import type { Capability } from '../types'

export const integrations: Capability = {
  id: 'integrations',
  name: 'Integraciones',
  tagline: 'Conecta Ubyca con tus sistemas y aplicaciones existentes.',
  description:
    'Ubyca puede integrarse con sistemas externos mediante su REST API. ' +
    'Cualquier sistema que pueda hacer llamadas HTTP puede consumir resultados ' +
    'de presencia, leer datos de GeoPoints y acceder a analytics. ' +
    'Los webhooks permiten que Ubyca notifique proactivamente a sistemas externos ' +
    'cuando ocurren eventos de presencia. No hay un marketplace de integraciones ' +
    'predefinidas: la integración se construye sobre la API.',
  keyFeatures: [
    'Apps móviles nativas: integra validación GPS en iOS o Android via API',
    'Sitios web: consume presencia y analytics desde el frontend o backend',
    'E-commerce: activa promociones cuando el cliente llega al local físico',
    'CRM y ERP: registra visitas verificadas de vendedores directamente',
    'Sistemas de acceso: valida presencia como condición de autorización',
    'Plataformas de fidelización: dispara recompensas por visita física validada',
    'Autenticación: Bearer token, HTTPS obligatorio',
    'Scopes disponibles: presence:validate, presence:check, locations:read, analytics:read',
  ],
  whoIsItFor:
    'Desarrolladores y equipos técnicos que quieren usar presencia física ' +
    'como un input en sistemas ya existentes, sin reemplazar su infraestructura.',
  relatedCapabilities: ['api', 'presence', 'geopoints', 'analytics', 'smart-proxies'],
}
