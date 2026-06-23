import type { ProductInfo } from './types'

export const product: ProductInfo = {
  name: 'Ubyca',

  tagline: 'La plataforma de presencia física en tiempo real.',

  description:
    'Ubyca es una plataforma que verifica en el servidor si un usuario está ' +
    'físicamente presente en una ubicación geográfica. Envías coordenadas GPS ' +
    'y recibes en menos de 80ms si el usuario está dentro de una zona, la ' +
    'distancia exacta al centro y el tiempo de permanencia acumulado. ' +
    'Los resultados se consumen desde Studio (interfaz visual) o desde la API ' +
    '(REST + JSON + OpenAPI 3.1).',

  positioning:
    'Ubyca no es un creador de puntos GPS ni una herramienta de mapas. ' +
    'Es una plataforma de presencia física: su núcleo es la validación ' +
    'server-side de coordenadas contra zonas geográficas configuradas, con ' +
    'reglas de negocio aplicadas en cada validación (horarios, dwell time, ' +
    'capacidad máxima). Tiene dos interfaces hacia el mismo motor: Studio ' +
    'para equipos sin perfil técnico y la API para integrar en sistemas externos.',

  accessPoints: [
    'Studio — studio.ubyca.com (interfaz visual, sin código)',
    'API REST — api.ubyca.com/v1 (para desarrolladores)',
  ],
}
