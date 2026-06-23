import type { Capability } from '../types'

export const integrations: Capability = {
  id: 'integrations',
  name: 'Integraciones',
  tagline: 'Presencia física como input en sistemas ya existentes.',
  description:
    'Ubyca no reemplaza los sistemas del cliente: los complementa. ' +
    'Cualquier sistema que pueda hacer llamadas HTTP puede consumir resultados ' +
    'de validación de presencia, leer datos de GeoPoints y acceder a analytics. ' +
    'No existe un marketplace de integraciones predefinidas ni conectores nativos ' +
    'con CRM, ERP o plataformas de marketing: toda integración se construye sobre ' +
    'la REST API de Ubyca. El cliente mantiene el control total de la lógica de ' +
    'negocio; Ubyca aporta únicamente el dato de presencia y sus métricas.',
  keyFeatures: [
    'Apps móviles iOS / Android: llamada a API desde la app nativa del cliente',
    'Sitios web y PWA: validación GPS desde el navegador via fetch a la API',
    'E-commerce: gate de beneficios que requiere presencia física verificada',
    'CRM y ERP: registro automático de visitas de campo verificadas por GPS',
    'Sistemas de control de acceso: presencia como condición de autorización',
    'Plataformas de fidelización: acumulación de puntos solo por visita validada',
    'Sin webhooks: la integración es siempre request-response iniciado por el cliente',
  ],
  whoIsItFor:
    'Desarrolladores y arquitectos de sistemas que quieren añadir presencia ' +
    'física verificada como un input dentro de flujos y reglas ya existentes, ' +
    'sin modificar la infraestructura central del cliente.',
  relatedCapabilities: ['api', 'presence', 'geopoints', 'analytics'],
}
