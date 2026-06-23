import type { Capability } from '../types'

export const presence: Capability = {
  id: 'presence',
  name: 'Presencia física',
  tagline: 'Validación GPS server-side en tiempo real.',
  description:
    'El núcleo de Ubyca es la validación de presencia física: contrastar las ' +
    'coordenadas GPS de un dispositivo contra los GeoPoints configurados. ' +
    'La validación ocurre en el servidor, no es auto-declarada por el usuario. ' +
    'El resultado incluye si el usuario está dentro del área, la distancia ' +
    'exacta al centro en metros, el tiempo de permanencia acumulado en la ' +
    'sesión y el resultado de las reglas de negocio definidas en el GeoPoint. ' +
    'La respuesta llega en menos de 80ms.',
  keyFeatures: [
    'Validación server-side: no depende de auto-declaración del dispositivo',
    'Resultado: presente / ausente + distancia exacta en metros',
    'Dwell time: tiempo de permanencia acumulado en segundos',
    'Evaluación de reglas: horario, dwell time mínimo y capacidad máxima',
    'Respuesta en menos de 80ms',
    'Dos modos: validate (con reglas) y check (sin reglas, solo GPS)',
    'No requiere app nativa: funciona desde el navegador móvil',
    'Sin hardware adicional: usa el GPS del dispositivo del usuario',
  ],
  whoIsItFor:
    'Cualquier sistema que necesite saber con certeza si un usuario está ' +
    'físicamente en un lugar específico en este momento.',
  apiEndpoints: ['POST /presence/validate', 'POST /presence/check'],
  relatedCapabilities: ['geopoints', 'api', 'analytics'],
}
