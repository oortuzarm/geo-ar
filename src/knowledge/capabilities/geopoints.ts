import type { Capability } from '../types'

export const geopoints: Capability = {
  id: 'geopoints',
  name: 'GeoPoints',
  tagline: 'Zonas geográficas con lógica de negocio incorporada.',
  description:
    'Los GeoPoints son las unidades fundamentales de Ubyca: áreas geográficas ' +
    'definidas por un radio circular o un polígono personalizado. ' +
    'Cada GeoPoint tiene un nombre, coordenadas, geometría activa y un conjunto ' +
    'de reglas de negocio propias. La validación de presencia siempre ocurre ' +
    'contra un GeoPoint específico. Se crean y administran desde Studio o ' +
    'mediante la Locations API.',
  keyFeatures: [
    'Radio circular configurable en metros (precisión exacta)',
    'Polígonos personalizados para formas irregulares o complejas',
    'Reglas de horario: activación por días y ventanas de tiempo',
    'Dwell time mínimo: tiempo requerido de permanencia para validar',
    'Cupos: capacidad máxima simultánea de presencias válidas',
    'Contenido asociado: video, audio, texto o enlace que se desbloquea por proximidad',
    'Métricas individuales por GeoPoint: visitas, activaciones, conversión',
    'Estado activo/inactivo por punto',
  ],
  whoIsItFor:
    'Cualquier caso donde se necesita definir múltiples ubicaciones físicas ' +
    'con comportamientos, reglas o contenidos distintos entre sí.',
  apiEndpoints: ['GET /locations/{id}', 'POST /locations', 'DELETE /locations/{id}'],
  relatedCapabilities: ['presence', 'analytics', 'studio'],
}
