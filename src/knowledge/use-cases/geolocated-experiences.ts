import type { UseCase } from '../types'

export const geolocationARExperience: UseCase = {
  id: 'geolocated-ar-experience',
  vertical: 'geolocated-experiences',
  title: 'Experiencias geolocalizadas: realidad aumentada, mapas interactivos y contenido por puntos',
  problem:
    'Un desarrollador, agencia o creativo quiere construir una experiencia — ' +
    'realidad aumentada, mapa interactivo, contenido enriquecido — que funcione ' +
    'solo en ubicaciones específicas del mapa. El contenido o la experiencia ' +
    'no debe activarse desde cualquier lugar, sino únicamente donde el creador ' +
    'lo defina.',
  solution:
    'Ubyca no incluye motor de realidad aumentada propio. Lo que aporta es la ' +
    'capa de acceso y activación geolocalizada: define GeoPoints sobre los puntos ' +
    'del mapa donde debe funcionar la experiencia. La API de Ubyca valida en el ' +
    'servidor si el usuario está dentro del área antes de que tu app habilite ' +
    'el contenido AR, el mapa enriquecido o la experiencia interactiva. ' +
    'El resultado: una experiencia que literalmente funciona solo en los puntos ' +
    'que definas, con validación server-side, no autogestión del GPS del dispositivo.',
  capabilities: ['geopoints', 'presence', 'api', 'smart-proxies'],
  matchKeywords: [
    'realidad aumentada', 'realidad aumentada geolocalizada',
    'RA geolocalizada', 'AR geolocalizado',
    'mapa interactivo', 'mapa enriquecido', 'contenido en mapa',
    'experiencia geolocalizada', 'experiencia por puntos',
    'activar experiencia', 'experiencia en territorio',
    'solo en los lugares', 'funcione solo en', 'solo donde yo quiera',
    'contenido por mapa', 'app de mapa', 'experiencia de mapa',
    'WebXR', 'A-Frame', 'capa AR', 'activar AR',
    'puntos en el mapa', 'definir puntos en mapa',
    'experiencia que funcione en ubicaciones',
    // Lenguaje natural — juegos y dinámicas
    'gymkhana', 'yincana', 'gimkana',
    'caza del tesoro', 'cazatesoros', 'búsqueda del tesoro',
    'juego de pistas', 'pistas geolocalizadas',
    'trivial geolocalizado', 'quiz geolocalizado',
    'contenido desbloqueado por ubicación',
    'app que funcione en puntos del mapa',
  ],
}
