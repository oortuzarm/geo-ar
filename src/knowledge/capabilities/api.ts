import type { Capability } from '../types'

export const api: Capability = {
  id: 'api',
  name: 'API',
  tagline: 'REST API para integrar validación de presencia en cualquier sistema.',
  description:
    'La API de Ubyca expone un conjunto de endpoints REST para validar presencia ' +
    'GPS, consultar GeoPoints y consumir analytics desde cualquier sistema externo. ' +
    'Usa autenticación Bearer token con scopes por API key. ' +
    'La especificación completa está disponible en OpenAPI 3.1. ' +
    'Base URL: https://api.ubyca.com/v1. ' +
    'Latencia de validación: menos de 80ms.',
  keyFeatures: [
    'POST /presence/validate — validación GPS con reglas de negocio (dwell time, horario, capacidad)',
    'POST /presence/check — consulta rápida de presencia sin reglas',
    'GET /locations/{id} — geometría, radio y metadatos de un GeoPoint',
    'GET /projects/{id}/analytics — métricas de visitas, dwell time y conversión',
    'Autenticación Bearer token con scopes por endpoint',
    'Respuesta en JSON en menos de 80ms',
    'Especificación OpenAPI 3.1 descargable',
  ],
  whoIsItFor:
    'Desarrolladores e integradores que necesitan validar presencia física ' +
    'como parte de un sistema propio: apps móviles, plataformas corporativas, ' +
    'CRM, ERP o cualquier sistema que necesite saber si un usuario está en un lugar.',
  apiEndpoints: [
    'POST /presence/validate',
    'POST /presence/check',
    'GET /locations/{id}',
    'GET /projects/{id}/analytics',
  ],
  relatedCapabilities: ['geopoints', 'presence', 'analytics', 'integrations'],
}
